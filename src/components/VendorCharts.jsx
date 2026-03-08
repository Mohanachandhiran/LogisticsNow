/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Card, CardContent } from './ui/Card';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts';
import { motion } from 'framer-motion';

export function VendorCharts({ data }) {
  // Prep data for quote comparison
  const quoteData = data.map(d => ({
    name: d.vendor,
    cost: d.quote,
    lane: d.lane.split(' → ')[0] // using origin city for simplicity of label
  }));

  // Group data to average out reliability scores across vendors if they have multiple entries
  const reliabilityDataRaw = data.reduce((acc, current) => {
     if (!acc[current.vendor]) {
         acc[current.vendor] = { sum: current.reliability, count: 1 };
     } else {
         acc[current.vendor].sum += current.reliability;
         acc[current.vendor].count += 1;
     }
     return acc;
  }, {});
  
  const reliabilityData = Object.keys(reliabilityDataRaw).map(vendor => ({
      vendor: vendor,
      reliability: Math.round(reliabilityDataRaw[vendor].sum / reliabilityDataRaw[vendor].count),
      fullMark: 100
  }));

  const CustomTooltipPrice = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl shadow-xl backdrop-blur-md opacity-90 text-sm">
          <p className="text-white font-medium mb-1">{label}</p>
          <p className="text-emerald-400 font-mono font-bold">
            ₹{payload[0].value.toLocaleString()} <span className="text-slate-400 font-sans font-normal text-xs">/ load</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Card className="h-[400px] border-white/5 bg-card/80 backdrop-blur-md shadow-xl flex flex-col">
          <div className="p-6 pb-2 border-b border-white/5">
            <h3 className="text-lg font-bold text-white tracking-wide">Vendor Quote Comparison</h3>
            <p className="text-xs text-slate-400">Comparing baseline quotation bids grouped by vendor.</p>
          </div>
          <CardContent className="flex-1 p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quoteData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorQuotes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip content={<CustomTooltipPrice />} cursor={{ fill: '#ffffff05' }} />
                <Bar 
                  dataKey="cost" 
                  fill="url(#colorQuotes)" 
                  radius={[6, 6, 0, 0]} 
                  animationDuration={1500}
                >
                  {quoteData.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Card className="h-[400px] border-white/5 bg-card/80 backdrop-blur-md shadow-xl flex flex-col">
          <div className="p-6 pb-2 border-b border-white/5">
            <h3 className="text-lg font-bold text-white tracking-wide">Vendor Reliability Radar</h3>
            <p className="text-xs text-slate-400">Multidimensional reliability scores mapped over time.</p>
          </div>
          <CardContent className="flex-1 p-4 pb-0 flex items-center justify-center relative bg-slate-900/40 rounded-b-2xl">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={reliabilityData}>
                    <PolarGrid stroke="#ffffff20" />
                    <PolarAngleAxis dataKey="vendor" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar 
                        name="Reliability Score" 
                        dataKey="reliability" 
                        stroke="#6366F1" 
                        fill="#6366F1" 
                        fillOpacity={0.5} 
                        animationDuration={1500} 
                    />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                       itemStyle={{ color: '#fff' }}
                    />
                </RadarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
