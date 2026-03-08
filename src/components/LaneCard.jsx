/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Package, IndianRupee, MapPin } from 'lucide-react';

export function LaneCard({ lane, isSelected, register }) {
  return (
    <motion.label
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`relative cursor-pointer flex flex-col p-6 rounded-2xl border transition-all duration-300 shadow-xl backdrop-blur-md ${
        isSelected 
          ? 'bg-primary/10 border-primary shadow-primary/20' 
          : 'bg-card/80 border-white/5 hover:bg-white/[0.03] hover:border-white/20 shadow-black/40' // ShadCN-like dark mode panel
      }`}
    >
      <input
        type="checkbox"
        value={lane.id}
        className="hidden"
        {...register("selectedLanes")}
      />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-start md:items-center space-x-3">
          <div className={`p-2 rounded-lg transition-colors ${isSelected ? 'bg-primary shadow-lg shadow-primary/30 text-white' : 'bg-slate-800 text-slate-400'}`}>
            <MapPin className="w-5 h-5 flex-shrink-0" />
          </div>
          <h3 className={`text-lg font-bold tracking-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>
            {lane.lane}
          </h3>
        </div>
        <div className={`w-6 h-6 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all ${
          isSelected ? 'bg-primary border-primary shadow-sm shadow-primary/50' : 'border-slate-600 bg-transparent'
        }`}>
          {isSelected && (
            <motion.svg
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="flex items-center space-x-3 bg-black/20 p-3 rounded-xl border border-white/5">
          <Package className="w-4 h-4 text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Shipments</span>
            <span className="text-white font-mono font-semibold">{lane.shipments}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 bg-black/20 p-3 rounded-xl border border-white/5">
          <IndianRupee className="w-4 h-4 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Avg Cost</span>
             <span className="text-white font-mono font-semibold">₹{lane.avgCost.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.label>
  );
}
