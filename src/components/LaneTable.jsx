import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, Search, Info, Activity, ArrowUpRight, Zap, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';

export function LaneTable({ data }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [sentRfqs, setSentRfqs] = useState(new Set());
  const [sendingId, setSendingId] = useState(null);

  const handleSendRfq = async (row, vendor) => {
      const key = `${row.id}-${vendor.name}`;
      setSendingId(key);
      try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/send-rfq`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  lane: row.lane,
                  vendor: vendor.name,
                  shipments: vendor.shipments,
                  impact: vendor.impact
              })
          });
          const result = await response.json();
          if (result.success) {
              setSentRfqs(prev => new Set([...prev, key]));
          } else {
              alert('Error sending RFQ: ' + result.error);
          }
      } catch (err) {
          alert('Failed to connect to backend server to send RFQ');
      } finally {
          setSendingId(null);
      }
  };

  const toggleExpand = (id) => {
     setExpandedId(prev => prev === id ? null : id);
  };

  const getWorstVendors = (row) => {
     if (row.worstVendors) return row.worstVendors;
     return [
       { name: "Express Logistics", score: 42, impact: 9, reason: "Frequent Delays", shipments: 45 },
       { name: "FastTrack", score: 55, impact: 6, reason: "Excessive Cost", shipments: 30 },
       { name: "Speedy Freight", score: 62, impact: 4, reason: "Slow Transport Speeds", shipments: 15 }
     ];
  };

  return (
    <div className="w-full relative shadow-xl shadow-black/40 rounded-2xl bg-card border border-white/5 overflow-hidden backdrop-blur-xl">
      <div className="flex justify-between items-center p-6 border-b border-white/5">
        <h3 className="text-xl font-bold text-white tracking-tight flex items-center">
          <TrendingUp className="w-5 h-5 mr-3 text-primary" />
          Cleaned Lane Intelligence
        </h3>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search lanes..." 
            className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-500 w-64"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300 relative">
          <thead className="text-xs text-slate-400 uppercase bg-slate-900/60 border-b border-white/5">
            <tr>
              <th scope="col" className="px-6 py-5 font-semibold tracking-wider">Lane Route</th>
              <th scope="col" className="px-6 py-5 font-semibold tracking-wider">Total Shipments</th>
              <th scope="col" className="px-6 py-5 font-semibold tracking-wider">Average Cost</th>
              <th scope="col" className="px-6 py-5 font-semibold tracking-wider text-center">Health Score</th>
              <th scope="col" className="px-6 py-5 font-semibold tracking-wider text-center">Status</th>
              <th scope="col" className="px-6 py-5 font-semibold tracking-wider text-right rounded-tr-2xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {data.map((row, idx) => {
                const getStatusColor = (score) => {
                  if (score >= 80) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
                  if (score >= 50) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
                  return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
                };

                const getStatusText = (score) => {
                  if (score >= 80) return 'Healthy';
                  if (score >= 50) return 'Moderate';
                  return 'Risk';
                };

                const statusStyle = getStatusColor(row.healthScore);
                const statusText = getStatusText(row.healthScore);
                const isRisk = row.healthScore < 50;
                const rowId = row.id || idx;

                return (
                  <React.Fragment key={rowId}>
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    onHoverStart={() => setHoveredId(rowId)}
                    onHoverEnd={() => setHoveredId(null)}
                    className="border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors relative group"
                  >
                    <td className="px-6 py-5 font-medium text-white flex items-center space-x-3">
                      {isRisk && <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />}
                      <span>{row.lane}</span>
                    </td>
                    <td className="px-6 py-5 font-mono text-slate-300">
                      {row.shipments.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 font-mono text-slate-300">
                      ₹{row.avgCost.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <span className="font-bold font-mono text-base">{row.healthScore}</span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${row.healthScore}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full rounded-full ${row.healthScore >= 80 ? 'bg-emerald-500' : row.healthScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle}`}>
                        {getStatusText(row.healthScore) === 'Healthy' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>}
                        {getStatusText(row.healthScore) === 'Moderate' && <div className="w-1.5 h-1.5 rounded-full bg-amber-400"/>}
                        {getStatusText(row.healthScore) === 'Risk' && <div className="w-1.5 h-1.5 rounded-full bg-rose-400"/>}
                        <span>{statusText}</span>
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <Button 
                         variant="outline" 
                         size="sm"
                         onClick={() => toggleExpand(rowId)}
                         className={`border-indigo-500/20 hover:bg-indigo-500/10 ${expandedId === rowId ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-300'} transition-all`}
                       >
                          <Activity className="w-4 h-4 mr-2 text-indigo-400 group-hover:animate-pulse" />
                          Improve Health
                       </Button>
                    </td>
                  </motion.tr>

                  {/* Expanded Vendor Suggestions Row */}
                  <AnimatePresence>
                     {expandedId === rowId && (
                        <motion.tr
                           initial={{ opacity: 0, height: 0 }}
                           animate={{ opacity: 1, height: 'auto' }}
                           exit={{ opacity: 0, height: 0 }}
                           className="bg-slate-900/50 border-b border-indigo-500/10"
                        >
                           <td colSpan={6} className="p-0 overflow-hidden text-left relative">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                              <div className="px-8 py-6">
                                 <div className="flex items-center space-x-2 text-indigo-400 font-bold uppercase tracking-wider text-xs mb-4">
                                     <Zap className="w-4 h-4 fill-indigo-400" />
                                     <span>AI Vendor Replacement Suggestions</span>
                                 </div>
                                 <p className="text-slate-400 text-sm mb-4">
                                    The AI has identified the top 3 underperforming vendors dragging down this lane's health. Remove or retender these contracts.
                                 </p>
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {getWorstVendors(row).map((vp, vidx) => (
                                       <div key={vidx} className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-4 flex flex-col hover:border-indigo-500/30 transition-colors group">
                                          <div className="flex justify-between items-start mb-2 shrink-0">
                                              <span className="text-white font-bold truncate pr-2">{vp.name}</span>
                                              <span className="flex items-center text-rose-400 font-mono text-xs bg-rose-400/10 px-2 py-0.5 rounded border border-rose-400/20 shrink-0">
                                                 Score: {vp.score}
                                              </span>
                                          </div>
                                          <span className="text-slate-400 text-xs font-semibold uppercase mb-4 line-clamp-1">
                                             {vp.reason}
                                          </span>
                                          
                                          <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
                                             <div className="flex items-center space-x-1.5">
                                                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                                                <span className="text-emerald-400 text-xs font-bold leading-tight flex flex-wrap">
                                                   +{vp.impact} Lane Health
                                                </span>
                                             </div>
                                             
                                             {(() => {
                                                const key = `${row.id}-${vp.name}`;
                                                const isSent = sentRfqs.has(key);
                                                const isSending = sendingId === key;
                                                
                                                return (
                                                   <button 
                                                      onClick={() => handleSendRfq(row, vp)}
                                                      disabled={isSent || isSending}
                                                      className={`text-[10px] uppercase font-bold flex items-center shrink-0 ml-2 transition-colors
                                                         ${isSent ? 'text-emerald-500 cursor-not-allowed' : 
                                                           isSending ? 'text-indigo-400 opacity-50 cursor-wait' : 
                                                           'text-slate-400 hover:text-white'}`}
                                                   >
                                                      <RefreshCw className={`w-3 h-3 mr-1 ${isSending ? 'animate-spin' : ''}`} /> 
                                                      {isSent ? 'Sent' : isSending ? 'Sending...' : 'Change'}
                                                   </button>
                                                );
                                             })()}
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </td>
                        </motion.tr>
                     )}
                  </AnimatePresence>

                  </React.Fragment>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
