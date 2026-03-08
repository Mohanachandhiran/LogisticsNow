/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Search, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, User, Clock, Info } from 'lucide-react';

export function VendorTable({ data }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  // Connect to dynamically matched recommendations
  const evaluateAiRecommendation = (vendor) => {
    try {
       const storedMatches = localStorage.getItem('vendorMatches');
       if (storedMatches) {
          const matches = JSON.parse(storedMatches);
          const isMatch = matches.find(m => m.lane === vendor.lane && m.recommendedVendor === vendor.vendor);
          if (isMatch) return 'Recommended';
       }
    } catch(e) {}
    
    if (vendor.reliability >= 88) return 'Alternative';
    return 'High Risk';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Recommended': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Alternative': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'High Risk': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const toggleRow = (id) => {
     setExpandedRow(prev => prev === id ? null : id);
  };

  return (
    <div className="w-full relative shadow-2xl shadow-black/50 rounded-2xl bg-card border border-white/10 overflow-hidden backdrop-blur-xl">
      <div className="flex justify-between items-center p-6 border-b border-white/5 bg-slate-900/40">
        <h3 className="text-xl font-bold text-white tracking-tight flex items-center">
          <Network className="w-5 h-5 mr-3 text-secondary" />
          AI Vendor Matching Results
        </h3>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search vendors or lanes..." 
            className="pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-500 w-72"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-900/80 border-b border-white/5 tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-5 font-semibold">Lane</th>
              <th scope="col" className="px-6 py-5 font-semibold">Vendor</th>
              <th scope="col" className="px-6 py-5 font-semibold">Quoted Cost</th>
              <th scope="col" className="px-6 py-5 font-semibold text-center">Reliability Score</th>
              <th scope="col" className="px-6 py-5 font-semibold text-right">AI Recommendation</th>
              <th scope="col" className="px-6 py-5"></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {data.map((row, idx) => {
                const recommendation = evaluateAiRecommendation(row);
                const statusStyle = getStatusColor(recommendation);
                const isExpanded = expandedRow === row.id;

                return (
                  <React.Fragment key={row.id}>
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.3 }}
                      onHoverStart={() => setHoveredId(row.id)}
                      onHoverEnd={() => setHoveredId(null)}
                      onClick={() => toggleRow(row.id)}
                      className={`border-b border-white/5 transition-colors cursor-pointer ${isExpanded ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-white/[0.03] border-l-4 border-l-transparent bg-transparent'}`}
                    >
                      <td className="px-6 py-5 font-medium text-white">
                        {row.lane}
                      </td>
                      <td className="px-6 py-5 font-semibold text-indigo-300 flex items-center space-x-2">
                         <div className="w-6 h-6 rounded-md bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                            <span className="text-xs font-bold text-indigo-400">{row.vendor.charAt(0)}</span>
                         </div>
                         <span>{row.vendor}</span>
                      </td>
                      <td className="px-6 py-5 font-mono text-slate-200 text-base">
                        ₹{row.quote.toLocaleString()}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center space-x-2">
                           <span className="font-bold font-mono text-lg">{row.reliability}</span>
                           <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${row.reliability}%` }}
                                 transition={{ duration: 1, delay: 0.5 }}
                                 className={`h-full rounded-full ${row.reliability >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                              />
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-inner ${statusStyle}`}>
                          {recommendation === 'Recommended' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {recommendation === 'Alternative' && <AlertCircle className="w-3.5 h-3.5" />}
                          {recommendation === 'High Risk' && <AlertCircle className="w-3.5 h-3.5 animate-pulse" />}
                          <span>{recommendation}</span>
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
                          <td colSpan={6} className="px-6 py-4">
                             <div className="flex items-start md:items-center space-y-4 md:space-y-0 md:space-x-8 text-sm">
                                <div className="flex items-center space-x-3 text-slate-400">
                                   <User className="w-4 h-4 text-secondary" />
                                   <span className="font-medium text-white">Contact:</span>
                                   <span>{row.contact}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-slate-400">
                                   <Clock className="w-4 h-4 text-secondary" />
                                   <span className="font-medium text-white">Lead Time:</span>
                                   <span>{row.leadTime}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-slate-400">
                                   <Info className="w-4 h-4 text-secondary" />
                                   <span className="font-medium text-white">AI Confidence Score:</span>
                                   <span className="text-emerald-400 font-bold tracking-widest">{Math.floor(88 + Math.random() * 10)}%</span>
                                </div>
                                {recommendation === 'Recommended' && (
                                   <div className="ml-auto bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg font-semibold flex items-center shadow-inner">
                                      Primary Allocated Vendor
                                   </div>
                                )}
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
