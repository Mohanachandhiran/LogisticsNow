import csv
import random
from datetime import datetime, timedelta

# Configuration
num_records = 10000
filename = 'synthetic_shipment_data.csv'
start_date = datetime(2024, 1, 1)

vendors = ['BlueDart', 'DTDC', 'Delhivery', 'EcomExpress']
statuses = ['Delivered', 'Delayed']

# Defining routes based on patterns in your sample
routes = [
    {'origin': 'Chennai', 'dest': 'Bengaluru', 'base_cost': 10000, 'base_time': 2, 'weight_min': 900, 'weight_max': 1200},
    {'origin': 'Chennai', 'dest': 'Hyderabad', 'base_cost': 12000, 'base_time': 3, 'weight_min': 1300, 'weight_max': 1600},
    {'origin': 'Mumbai',  'dest': 'Pune',      'base_cost': 6000,  'base_time': 1, 'weight_min': 800, 'weight_max': 1000},
    {'origin': 'Delhi',   'dest': 'Jaipur',    'base_cost': 5000,  'base_time': 1, 'weight_min': 600, 'weight_max': 800}
]

print(f"Generating {num_records} records...")

with open(filename, mode='w', newline='') as file:
    writer = csv.writer(file)
    
    # Write the header row
    writer.writerow(['shipment_id', 'origin_city', 'destination_city', 'shipment_date', 
                     'weight_kg', 'volume_m3', 'vendor', 'cost_inr', 'delivery_time_days', 'status'])
    
    for i in range(1, num_records + 1):
        # 1. Shipment ID (e.g., SHP00001)
        shipment_id = f"SHP{i:05d}"
        
        # 2. Origin & Destination
        route = random.choice(routes)
        origin = route['origin']
        dest = route['dest']
        
        # 3. Shipment Date (Random day within a 1-year span)
        days_offset = random.randint(0, 365)
        shipment_date = (start_date + timedelta(days=days_offset)).strftime('%Y-%m-%d')
        
        # 4. Weight & Volume
        weight = random.randint(route['weight_min'], route['weight_max'])
        # In the sample, volume generally maps to ~130-150 kg per cubic meter.
        density_factor = random.uniform(135.0, 145.0)
        volume = round(weight / density_factor, 1)
        
        # 5. Vendor
        vendor = random.choice(vendors)
        
        # 6. Cost (Base route cost + weight adjustments + random fluctuation)
        cost_variance = random.randint(-200, 500)
        weight_premium = (weight - route['weight_min']) * 1.5
        raw_cost = route['base_cost'] + weight_premium + cost_variance
        cost = int(round(raw_cost / 50.0) * 50) # Round to nearest 50 for clean numbers
        
        # 7. Status (e.g., 90% Delivered, 10% Delayed)
        status = random.choices(statuses, weights=[0.90, 0.10], k=1)[0]
        
        # 8. Delivery Time
        delivery_time = route['base_time']
        
        # Add extra time if the status is "Delayed" or if it's a historically slower vendor on a route
        if status == 'Delayed':
            delivery_time += random.randint(1, 2)
        elif vendor == 'DTDC' and dest == 'Bengaluru': 
            delivery_time += 1 # In sample, DTDC took 3 days to BLR while others took 2
            
        # Write the row to the CSV
        writer.writerow([shipment_id, origin, dest, shipment_date, weight, volume, vendor, cost, delivery_time, status])

print(f"Successfully created '{filename}'!")