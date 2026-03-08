/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, ChevronUp, AlertCircle, Sparkles, TrendingDown, ArrowRight } from 'lucide-react';

export function MatchTable({ data }) {
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();

  const toggleRow = (id) => {
     setExpandedRow(prev => prev === id ? null : id);
  };

  return (
    <div className="w-full relative shadow-2xl shadow-black/50 rounded-2xl bg-card border border-white/10 overflow-hidden backdrop-blur-xl">
      <div className="flex justify-between items-center p-6 border-b border-white/5 bg-slate-900/40">
        <h3 className="text-xl font-bold text-white tracking-tight flex items-center">
          <Sparkles className="w-5 h-5 mr-3 text-secondary" />
          Vendor Matching Results
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-900/80 border-b border-white/5 tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-5 font-semibold">Lane</th>
              <th scope="col" className="px-6 py-5 font-semibold">Recommended Vendor</th>
              <th scope="col" className="px-6 py-5 font-semibold">Quote Price</th>
              <th scope="col" className="px-6 py-5 font-semibold">Reliability</th>
              <th scope="col" className="px-6 py-5 font-semibold">Savings</th>
              <th scope="col" className="px-6 py-5 font-semibold text-right">Decision</th>
              <th scope="col" className="px-6 py-5"></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {data.map((row, idx) => {
                const isExpanded = expandedRow === row.id;

                const getStatusColor = (score) => {
                  if (score >= 90) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
                  if (score >= 85) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
                  return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
                };

                const getStatusText = (score) => {
                  if (score >= 90) return 'AI Recommended';
                  if (score >= 85) return 'Alternative Vendor';
                  return 'High Risk';
                };

                const statusStyle = getStatusColor(row.reliability);
                const statusText = getStatusText(row.reliability);

                return (
                  <React.Fragment key={row.id}>
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.3 }}
                      onClick={() => toggleRow(row.id)}
                      className={`border-b border-white/5 transition-colors cursor-pointer ${isExpanded ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-white/[0.03] border-l-4 border-l-transparent bg-transparent'}`}
                    >
                      <td className="px-6 py-5 font-medium text-white">
                        {row.lane}
                      </td>
                      <td className="px-6 py-5 font-semibold text-indigo-300 flex items-center space-x-2">
                         <div className="w-6 h-6 rounded-md bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                            <span className="text-xs font-bold text-indigo-400">{row.recommendedVendor.charAt(0)}</span>
                         </div>
                         <span>{row.recommendedVendor}</span>
                      </td>
                      <td className="px-6 py-5 font-mono text-slate-200">
                        ₹{row.cost.toLocaleString()}
                      </td>
                      <td className="px-6 py-5 font-bold text-white">
                        {row.reliability}
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex items-center text-emerald-400 space-x-1 font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 w-max px-2 py-1 rounded-md">
                            <TrendingDown className="w-4 h-4" />
                            <span>₹{row.savings.toLocaleString()}</span>
                         </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-inner ${statusStyle}`}>
                          {statusText === 'AI Recommended' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {statusText === 'Alternative Vendor' && <AlertCircle className="w-3.5 h-3.5" />}
                          {statusText === 'High Risk' && <AlertCircle className="w-3.5 h-3.5 animate-pulse" />}
                          <span>{statusText}</span>
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                         {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                      </td>
                    </motion.tr>
                    
                    {/* Expandable row content */}
                    {isExpanded && (
                       <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-black/20 border-b border-white/5"
                       >
                          <td colSpan={7} className="px-6 py-6">
                             <div className="space-y-4">
                               <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                                  <h4 className="text-white font-semibold">Vendor Comparison</h4>
                                  <span className="text-emerald-400 font-bold bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 flex items-center">
                                      <Sparkles className="w-4 h-4 mr-2" />
                                      AI Confidence: {row.confidence}%
                                  </span>
                               </div>
                               
                               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  {/* Recommended */}
                                  <div className="bg-primary/10 border border-primary/30 p-4 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                                      <div className="flex items-center mb-3 space-x-2 text-primary font-bold">
                                         <CheckCircle2 className="w-4 h-4" />
                                         <span>{row.recommendedVendor}</span>
                                      </div>
                                      <div className="text-sm space-y-2">
                                         <p className="flex justify-between text-slate-300"><span>Cost:</span> <span className="font-mono text-white">₹{row.cost.toLocaleString()}</span></p>
                                         <p className="flex justify-between text-slate-300"><span>Reliability:</span> <span className="font-mono text-emerald-400">{row.reliability}</span></p>
                                      </div>
                                  </div>

                                  {/* Alternatives */}
                                  {row.alternatives && row.alternatives.map((alt, altIdx) => (
                                     <div key={altIdx} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
                                         <div className="flex items-center mb-3 space-x-2 text-slate-400 font-semibold">
                                            <span>{alt.vendor}</span>
                                         </div>
                                         <div className="text-sm space-y-2">
                                            <p className="flex justify-between text-slate-400"><span>Cost:</span> <span className="font-mono text-slate-300">₹{alt.cost.toLocaleString()}</span></p>
                                            <p className="flex justify-between text-slate-400"><span>Reliability:</span> <span className="font-mono text-amber-400">{alt.reliability}</span></p>
                                         </div>
                                     </div>
                                  ))}
                               </div>

                               {/* Proceed Button */}
                               <div className="flex justify-end pt-4 mt-4 border-t border-white/10">
                                   <button 
                                      onClick={() => navigate('/procurement-summary', { state: { selectedLaneId: row.id } })}
                                      className="flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                                   >
                                       Proceed to Contract Award
                                       <ArrowRight className="w-4 h-4 ml-2" />
                                   </button>
                               </div>
                             </div>
                          </td>
                       </motion.tr>
                    )}
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
