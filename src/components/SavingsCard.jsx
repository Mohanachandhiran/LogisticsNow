/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Card, CardContent } from './ui/Card';
import { TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

export function SavingsCard({ savings }) {
  return (
    <Card className="bg-slate-900 border-white/5 shadow-xl h-full flex flex-col justify-center overflow-hidden relative group">
       <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-700" />
       <CardContent className="p-8 pb-6 flex items-center justify-between">
          <div className="flex flex-col space-y-2 z-10">
             <span className="text-sm font-semibold text-slate-400 tracking-wider uppercase mb-1 flex items-center">
                <IndianRupee className="w-4 h-4 mr-2 text-emerald-400" />
                Cost Savings Identified
             </span>
             <div className="flex items-baseline space-x-2">
                <motion.span 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 tracking-tight"
                >
                   ₹{savings.toLocaleString()}
                </motion.span>
                <span className="text-slate-500 font-medium">/shipment</span>
             </div>
          </div>
          <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ type: "spring", stiffness: 300, damping: 20 }}
             className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 z-10 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          >
             <TrendingDown className="w-8 h-8 text-emerald-400 group-hover:-translate-y-1 transition-transform" />
          </motion.div>
       </CardContent>
    </Card>
  );
}
