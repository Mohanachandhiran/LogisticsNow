/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Card, CardContent } from './ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';

export function VendorDecisionChart({ competitors, recommendedVendor }) {
  
  const minCost = Math.min(...competitors.map(c => c.quote));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl shadow-xl backdrop-blur-md opacity-90 text-sm">
          <p className="text-white font-medium mb-1">{label}</p>
          <p className="text-emerald-400 font-mono font-bold">
            ₹{payload[0].value.toLocaleString()} 
            <span className="text-slate-400 font-sans font-normal text-xs ml-1">quoted</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-[400px] bg-slate-900 border-white/5 shadow-xl flex flex-col relative overflow-hidden">
      <div className="p-6 pb-2 border-b border-white/5">
        <h3 className="text-lg font-bold text-white tracking-wide">Vendor Price Comparison</h3>
        <p className="text-xs text-slate-400">Baseline quotation quotes across all bidding competitors.</p>
      </div>
      <CardContent className="flex-1 p-6 pb-0 flex items-end">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5 }}
           className="w-full h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={competitors} margin={{ top: 20, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
              
              <ReferenceLine y={minCost} stroke="#10b981" strokeDasharray="3 3" opacity={0.5} label={{ position: 'top', value: 'Recommended Baseline', fill: '#10b981', fontSize: 10 }} />

              <XAxis 
                dataKey="vendor" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                domain={[minCost - 500, 'auto']}
              />
              
              <Tooltip cursor={{ fill: '#ffffff02' }} content={<CustomTooltip />} />
              
              <Bar 
                dataKey="quote" 
                radius={[6, 6, 0, 0]} 
                animationDuration={1500}
                barSize={50}
              >
                {competitors.map((entry, index) => {
                  const isRecommended = entry.vendor === recommendedVendor;
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={isRecommended ? '#10b981' : '#334155'}
                      className="hover:opacity-80 transition-opacity outline-none cursor-pointer"
                    />
                  )
                })}
              </Bar>

            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
}
