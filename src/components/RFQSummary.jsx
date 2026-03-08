/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, IndianRupee, PackageOpen, Send } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';

export function RFQSummary({ selectedCount, totalShipments, estimatedValue, onGenerate, isGenerating }) {
  return (
    <div className="sticky top-24">
      <Card className="bg-card/90 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <ClipboardList className="w-5 h-5 mr-3 text-secondary" />
            RFQ Summary
          </h2>

          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <span className="text-sm font-medium text-slate-400">Selected Lanes</span>
              <AnimatePresence mode="popLayout">
                <motion.span 
                  key={selectedCount}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="text-2xl font-bold text-white font-mono"
                >
                  {selectedCount}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <span className="text-sm font-medium text-slate-400">Total Shipments</span>
              <AnimatePresence mode="popLayout">
                <motion.div 
                  key={totalShipments}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2"
                >
                  <PackageOpen className="w-4 h-4 text-emerald-400" />
                  <span className="text-xl font-bold text-emerald-400 font-mono">
                    {totalShipments.toLocaleString()}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-col space-y-2 bg-slate-800/50 p-4 rounded-xl border border-primary/20 bg-primary/5">
              <span className="text-sm font-medium text-primary-foreground/70 text-indigo-300">Estimated RFQ Value</span>
              <AnimatePresence mode="popLayout">
                <motion.div 
                    key={estimatedValue}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-1"
                >
                  <IndianRupee className="w-5 h-5 text-indigo-400" />
                  <span className="text-3xl font-bold text-white font-mono tracking-tight">
                    {estimatedValue.toLocaleString()}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-8">
            <Button
              size="lg"
              disabled={selectedCount === 0 || isGenerating}
              onClick={onGenerate}
              className="w-full h-14 bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg shadow-lg hover:shadow-primary/25 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
              <span className="relative z-10 flex items-center">
                Generate RFQ
                <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </Button>
            {selectedCount === 0 && (
                <p className="text-xs text-center text-rose-400 mt-3 font-medium">Please select at least one lane</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
