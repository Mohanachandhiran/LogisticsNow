/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Card, CardContent } from './ui/Card';
import { CheckCircle2, MapPin, Truck, Star, Shield, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export function DecisionCard({ decision }) {
  return (
    <Card className="relative overflow-hidden bg-slate-900 border-emerald-500/30 shadow-2xl shadow-emerald-500/10 h-full">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
      
      <CardContent className="p-8 pb-6 flex flex-col h-full relative z-10">
        <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
          <div className="flex flex-col space-y-2">
            <span className="text-slate-400 text-sm font-semibold tracking-wider uppercase flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-emerald-400" />
              Target Lane
            </span>
            <span className="text-2xl font-bold text-white tracking-tight">{decision.lane}</span>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            AI RECOMMENDED
          </div>
        </div>

        <div className="flex items-center space-x-5 mb-8">
           <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-[2px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                 <Truck className="w-7 h-7 text-white" />
              </div>
           </div>
           <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-400">Awarded Vendor</span>
              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                 {decision.vendor}
              </span>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
          <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex flex-col items-start justify-center overflow-hidden">
            <div className="flex items-center space-x-2 text-slate-400 mb-2 w-full">
               <Shield className="w-4 h-4 text-amber-400 flex-shrink-0" />
               <span className="text-[11px] font-bold uppercase tracking-wider truncate">Reliability Score</span>
            </div>
            <span className="text-2xl lg:text-3xl font-mono font-bold text-white">{decision.reliability}%</span>
          </div>

          <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex flex-col items-start justify-center overflow-hidden">
            <div className="flex items-center space-x-2 text-slate-400 mb-2 w-full">
               <Cpu className="w-4 h-4 text-emerald-400 flex-shrink-0" />
               <span className="text-[11px] font-bold uppercase tracking-wider truncate">AI Confidence</span>
            </div>
            <div className="flex items-center space-x-3 w-full">
               <span className="text-2xl lg:text-3xl font-mono font-bold text-emerald-400">{decision.aiScore}%</span>
               <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${decision.aiScore}%` }}
                     transition={{ duration: 1.5, delay: 0.5 }}
                     className="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]"
                  />
               </div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
