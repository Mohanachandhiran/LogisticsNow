import os
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message

app = Flask(__name__)
CORS(app)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'pranatheeshs@gmail.com'
app.config['MAIL_PASSWORD'] = 'jhzl vwrr edwo ltiz'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

@app.route('/api/analyze', methods=['POST'])
def analyze_logistics_data():

    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'File must be a CSV'}), 400

    try:

        # Load CSV
        df = pd.read_csv(file)

        required_cols = [
            'origin_city',
            'destination_city',
            'cost_inr',
            'delivery_time_days',
            'vendor',
            'status'
        ]

        if not all(col in df.columns for col in required_cols):
            return jsonify({
                'error': f'Missing required columns. Expected: {required_cols}'
            }), 400

        # Create lane identifier
        df['lane'] = df['origin_city'] + ' - ' + df['destination_city']

        # Global benchmarks
        global_avg_cost = df['cost_inr'].mean()
        global_avg_delivery = df['delivery_time_days'].mean()

        # Group data
        grouped = df.groupby('lane').agg(
            shipments=('origin_city', 'count'),
            avgCost=('cost_inr', 'mean'),
            avgDeliveryTime=('delivery_time_days', 'mean')
        ).reset_index()

        lanes_result = []

        for i, row in grouped.iterrows():

            lane_df = df[df['lane'] == row['lane']]
            shipments = int(row['shipments'])

            avg_cost = float(row['avgCost'])
            avg_delivery = float(row['avgDeliveryTime'])

            # -------------------------------
            # 1️⃣ Delivery Speed Score
            # -------------------------------
            delivery_ratio = avg_delivery / global_avg_delivery
            delivery_score = max(0, 100 - (delivery_ratio * 40))

            # -------------------------------
            # 2️⃣ Cost Efficiency Score
            # -------------------------------
            cost_ratio = avg_cost / global_avg_cost
            cost_score = max(0, 100 - (cost_ratio * 40))

            # -------------------------------
            # 3️⃣ Delay Rate Score
            # -------------------------------
            delayed = lane_df[
                lane_df['status'].str.lower() == 'delayed'
            ].shape[0]

            total = lane_df.shape[0]

            delay_rate = delayed / total if total > 0 else 0
            delay_score = max(0, 100 - (delay_rate * 100))

            # -------------------------------
            # 4️⃣ Shipment Volume Score
            # -------------------------------
            shipment_score = min(100, shipments * 10)

            # -------------------------------
            # 5️⃣ Vendor Diversity Score
            # -------------------------------
            vendor_count = lane_df['vendor'].nunique()
            vendor_score = min(100, vendor_count * 30)

            # -------------------------------
            # Final Weighted Health Score
            # -------------------------------
            health_score = int(
                delivery_score * 0.25 +
                cost_score * 0.25 +
                delay_score * 0.20 +
                shipment_score * 0.15 +
                vendor_score * 0.15
            )

            # -------------------------------
            # Lane Status
            # -------------------------------
            if health_score >= 90:
                status = "Healthy"
            elif health_score >= 70:
                status = "Moderate"
            else:
                status = "Risk"

            # -------------------------------
            # AI Recommendation
            # -------------------------------
            if health_score < 50:
                recommendation = "Re-tender RFQ"
            elif delay_rate > 0.25:
                recommendation = "Replace vendor"
            else:
                recommendation = "Stable lane"

            # Confidence metric
            confidence_width = min(95, 40 + shipments * 3)

            # -------------------------------
            # Vendor Analysis for Improvement
            # -------------------------------
            vendor_group = lane_df.groupby('vendor').agg(
                v_shipments=('vendor', 'count'),
                v_avgCost=('cost_inr', 'mean'),
                v_avgDelivery=('delivery_time_days', 'mean')
            ).reset_index()

            vendors_stats = []
            for _, v_row in vendor_group.iterrows():
                v_name = v_row['vendor']
                v_shipments = v_row['v_shipments']
                v_avg_cost = v_row['v_avgCost']
                v_avg_delivery = v_row['v_avgDelivery']

                v_df = lane_df[lane_df['vendor'] == v_name]
                v_delayed = v_df[v_df['status'].str.lower() == 'delayed'].shape[0]
                v_delay_rate = v_delayed / v_shipments if v_shipments > 0 else 0

                v_delivery_ratio = v_avg_delivery / global_avg_delivery
                v_del_score = max(0, 100 - (v_delivery_ratio * 40))

                v_cost_ratio = v_avg_cost / global_avg_cost
                v_c_score = max(0, 100 - (v_cost_ratio * 40))

                v_d_score = max(0, 100 - (v_delay_rate * 100))

                v_health = int(v_del_score * 0.35 + v_c_score * 0.35 + v_d_score * 0.30)
                
                impact = max(1, int((100 - v_health) * 0.15))
                
                reason = "Overall Underperformance"
                if v_delay_rate > 0.3:
                    reason = "Frequent Delays"
                elif v_cost_ratio > 1.2:
                    reason = "Excessive Cost"
                elif v_delivery_ratio > 1.2:
                    reason = "Slow Transport Speeds"

                vendors_stats.append({
                    "name": v_name,
                    "score": v_health,
                    "reason": reason,
                    "impact": impact,
                    "shipments": v_shipments
                })

            vendors_stats.sort(key=lambda x: x['score'])
            worst_vendors = vendors_stats[:3]

            lanes_result.append({
                "id": i + 1,
                "lane": row['lane'],
                "shipments": shipments,
                "avgCost": int(round(avg_cost)),
                "avgDeliveryTime": round(avg_delivery, 2),
                "healthScore": health_score,
                "status": status,
                "delayRate": round(delay_rate * 100, 2),
                "vendorsUsed": vendor_count,
                "recommendation": recommendation,
                "confidenceWidth": confidence_width,
                "worstVendors": worst_vendors
            })

        # Sort by shipment volume
        lanes_result.sort(key=lambda x: x['shipments'], reverse=True)

        return jsonify({
            "success": True,
            "lanes": lanes_result,
            "total_processed": len(df)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/send-rfq', methods=['POST'])
def send_rfq():
    data = request.json
    lane = data.get('lane')
    vendor = data.get('vendor')
    shipments = data.get('shipments')
    impact = data.get('impact')
    
    msg = Message(
        subject=f"Logistics RFQ Invitation: {lane}",
        sender='pranatheeshs@gmail.com',
        recipients=['pranatheesh@gmail.com']
    )
    
    msg.html = f"""
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #f8fafc; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px;">Logistics RFQ Invitation</h1>
            <p style="color: #e0e7ff; margin-top: 10px; font-size: 14px; opacity: 0.9;">Lane Intelligence Builder Procurement Engine</p>
        </div>
        
        <div style="padding: 40px 30px;">
            <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 25px;">
                Hello <strong>Team from {vendor}</strong>,
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 30px;">
                You are officially invited to participate in a Request for Quotation (RFQ) for the following high-priority logistics lane. Please review the details below.
            </p>
            
            <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                <h3 style="color: #818cf8; margin-top: 0; margin-bottom: 20px; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #334155; padding-bottom: 10px;">Lane Intelligence Overview</h3>
                
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding-bottom: 15px; color: #94a3b8; font-size: 14px; vertical-align: middle;">Lane Route</td>
                        <td align="right" style="padding-bottom: 15px; text-align: right; vertical-align: middle;">
                            <span style="color: white; font-weight: bold; font-size: 14px; background-color: #0f172a; padding: 8px 12px; border-radius: 6px; border: 1px solid #334155; display: inline-block;">{lane}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="color: #94a3b8; font-size: 14px; vertical-align: middle;">Annual Shipments</td>
                        <td align="right" style="text-align: right; vertical-align: middle;">
                            <span style="color: #34d399; font-weight: bold; font-size: 16px; font-family: monospace; display: inline-block;">{shipments:,} Units</span>
                        </td>
                    </tr>
                </table>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 30px;">
                We are actively looking to optimize our logistics operations on this route. Please provide your best competitive quotation based on these parameters.
            </p>
            
            <div style="text-align: center; margin-top: 40px; border-top: 1px solid #334155; padding-top: 25px;">
                <p style="color: #64748b; font-size: 12px; margin: 0;">
                    Securely generated by the AI Procurement Engine at Lane Intelligence Builder.
                </p>
            </div>
        </div>
    </div>
    """
    
    try:
        mail.send(msg)
        return jsonify({'success': True, 'message': 'RFQ sent successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/vendor-match', methods=['POST'])
def vendor_match():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'File must be a CSV'}), 400

    try:
        df = pd.read_csv(file)
        
        required_cols = ['id', 'lane', 'vendor', 'quote', 'reliability', 'leadTime', 'contact']
        if not all(col in df.columns for col in required_cols):
            return jsonify({
                'error': f'Missing required columns. Expected: {required_cols}'
            }), 400

        # Parse leadTime (e.g., "3 Days" -> 3.0)
        df['lead_time_days'] = df['leadTime'].astype(str).str.extract(r'(\d+)').astype(float)
        
        all_quotes = []
        for _, r in df.iterrows():
            all_quotes.append({
                "id": str(r['id']),
                "lane": r['lane'],
                "vendor": r['vendor'],
                "quote": int(r['quote']),
                "reliability": int(r['reliability']),
                "leadTime": r['leadTime'],
                "contact": r['contact']
            })

        results = []
        for lane, group in df.groupby('lane'):
            # Normalize fields for scoring
            max_quote = group['quote'].max()
            max_rel = group['reliability'].max()
            max_lead = group['lead_time_days'].max()
            
            # Handling zero max values
            if max_quote == 0: max_quote = 1
            if max_rel == 0: max_rel = 1
            if max_lead == 0: max_lead = 1

            # Simple AI Score formula (lower quote & lead, higher rel is better)
            group['score'] = (group['reliability'] / max_rel) * 0.5 - (group['quote'] / max_quote) * 0.3 - (group['lead_time_days'] / max_lead) * 0.2
            
            best_vendor = group.loc[group['score'].idxmax()]
            
            avg_quote = group['quote'].mean()
            savings = avg_quote - best_vendor['quote']
            
            alternatives = []
            for _, alt in group[group['vendor'] != best_vendor['vendor']].iterrows():
                alternatives.append({
                    "vendor": alt['vendor'],
                    "cost": int(alt['quote']),
                    "reliability": int(alt['reliability'])
                })
            
            # Simple confidence generation based on margin between best score and average score
            confidence = min(99, max(75, int(85 + (best_vendor['score'] - group['score'].mean()) * 50)))
            if str(confidence) == 'nan':
               confidence = 90
               
            results.append({
                "id": f"m{len(results)+1}",
                "lane": lane,
                "recommendedVendor": best_vendor['vendor'],
                "cost": int(best_vendor['quote']),
                "reliability": int(best_vendor['reliability']),
                "savings": int(savings if savings > 0 else 0),
                "leadTime": best_vendor['leadTime'],
                "contact": best_vendor['contact'],
                "confidence": confidence,
                "alternatives": alternatives
            })

        return jsonify({
            "success": True,
            "matches": results,
            "all_quotes": all_quotes,
            "total_evaluated": len(df)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/send-award', methods=['POST'])
def send_award():
    data = request.json
    lane = data.get('lane')
    vendor = data.get('vendor')
    cost = data.get('cost')
    contact = data.get('contact')
    
    msg = Message(
        subject=f"Notice of Logistics Award: {lane}",
        sender='pranatheeshs@gmail.com',
        recipients=['pranatheesh@gmail.com'] # Using provided tester email
    )
    
    msg.html = f"""
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #f8fafc; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px;">Contract Award Notice</h1>
            <p style="color: #d1fae5; margin-top: 10px; font-size: 14px; opacity: 0.9;">Lane Intelligence Builder Procurement Engine</p>
        </div>
        
        <div style="padding: 40px 30px;">
            <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 25px;">
                Hello <strong>{contact} ({vendor})</strong>,
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 30px;">
                Congratulations. Your latest logistics quotation has been processed by our AI Procurement Engine, and you have been officially awarded the contract for the following route:
            </p>
            
            <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                <h3 style="color: #34d399; margin-top: 0; margin-bottom: 20px; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #334155; padding-bottom: 10px;">Contract Details</h3>
                
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding-bottom: 15px; color: #94a3b8; font-size: 14px; vertical-align: middle;">Lane Route</td>
                        <td align="right" style="padding-bottom: 15px; text-align: right; vertical-align: middle;">
                            <span style="color: white; font-weight: bold; font-size: 14px; background-color: #0f172a; padding: 8px 12px; border-radius: 6px; border: 1px solid #334155; display: inline-block;">{lane}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="color: #94a3b8; font-size: 14px; vertical-align: middle;">Approved Quote</td>
                        <td align="right" style="text-align: right; vertical-align: middle;">
                            <span style="color: #34d399; font-weight: bold; font-size: 16px; font-family: monospace; display: inline-block;">PKR/INR {cost}</span>
                        </td>
                    </tr>
                </table>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 30px;">
                Our procurement team will follow up directly with the final onboarding documentation. 
            </p>
            
            <div style="text-align: center; margin-top: 40px; border-top: 1px solid #334155; padding-top: 25px;">
                <p style="color: #64748b; font-size: 12px; margin: 0;">
                    Securely generated by the AI Procurement Engine at Lane Intelligence Builder.
                </p>
            </div>
        </div>
    </div>
    """
    
    try:
        mail.send(msg)
        return jsonify({'success': True, 'message': 'Award sent successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)