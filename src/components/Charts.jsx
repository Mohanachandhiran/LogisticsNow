/* eslint-disable no-unused-vars */
import React from 'react';
import { Card, CardContent } from './ui/Card';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
  RadialBarChart, RadialBar, Legend, PieChart, Pie
} from 'recharts';
import { motion } from 'framer-motion';

export function Charts({ data }) {
  // Prep data for bar chart
  const volumeData = data.map(d => ({
    name: d.lane.split(' → ')[0], // just use origin town for label space
    shipments: d.shipments
  }));

  // Group health scores for radial/pie chart
  const healthData = [
    { name: 'Healthy', value: data.filter(d => d.healthScore >= 80).length, fill: '#10b981' }, // emerald
    { name: 'Moderate', value: data.filter(d => d.healthScore >= 50 && d.healthScore < 80).length, fill: '#f59e0b' }, // amber
    { name: 'Risk', value: data.filter(d => d.healthScore < 50).length, fill: '#f43f5e' }, // rose
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl shadow-xl backdrop-blur-md opacity-90 text-sm">
          <p className="text-white font-medium mb-1">{label}</p>
          <p className="text-primary font-mono font-bold">
            {payload[0].value} <span className="text-slate-400 font-sans font-normal text-xs">shipments</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="lg:col-span-2"
      >
        <Card className="h-[400px] border-white/5 bg-card/80 backdrop-blur-md shadow-xl flex flex-col">
          <div className="p-6 pb-2 border-b border-white/5">
            <h3 className="text-lg font-bold text-white tracking-wide">Lane Shipment Volume</h3>
            <p className="text-xs text-slate-400">Total volume distributed across identified lane origins.</p>
          </div>
          <CardContent className="flex-1 p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                <Bar 
                  dataKey="shipments" 
                  fill="url(#colorShipments)" 
                  radius={[6, 6, 0, 0]} 
                  animationDuration={1500}
                >
                  {volumeData.map((entry, index) => (
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
        className="lg:col-span-1"
      >
        <Card className="h-[400px] border-white/5 bg-card/80 backdrop-blur-md shadow-xl flex flex-col">
          <div className="p-6 pb-2 border-b border-white/5">
            <h3 className="text-lg font-bold text-white tracking-wide">Lane Health Distribution</h3>
            <p className="text-xs text-slate-400">Overall AI-assessed health matrix.</p>
          </div>
          <CardContent className="flex-1 p-6 pb-0 flex items-center justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1500}
                    stroke="none"
                  >
                    {healthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-80 transition-opacity cursor-pointer outline-none" />
                    ))}
                  </Pie>
                  <Tooltip 
                     formatter={(value, name) => [`${value} Lanes`, name]}
                     contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                     itemStyle={{ color: '#fff' }}
                  />
                  <Legend 
                     verticalAlign="bottom" 
                     height={36} 
                     iconType="circle"
                     formatter={(value) => <span className="text-slate-300 font-medium text-sm">{value}</span>}
                  />
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                <span className="block text-3xl font-bold text-white">{data.length}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total</span>
             </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
