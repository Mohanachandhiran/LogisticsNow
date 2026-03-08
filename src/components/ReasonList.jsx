/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Card, CardContent } from './ui/Card';
import { Check, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

export function ReasonList({ reasons }) {
  return (
    <Card className="bg-slate-900 border-white/5 shadow-xl h-full flex flex-col">
       <div className="p-6 pb-2 border-b border-white/5 w-full flex items-center mb-6">
          <BrainCircuit className="w-5 h-5 mr-3 text-secondary" />
          <h3 className="text-lg font-bold text-white tracking-wide">AI Recommendation Context</h3>
       </div>
       <CardContent className="px-6 pb-8 flex-1">
          <p className="text-sm font-medium text-slate-400 mb-6 tracking-wide">Why was this vendor algorithmically selected?</p>
          <div className="space-y-5">
            {reasons.map((reason, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1, duration: 0.4 }}
                className="flex items-start"
              >
                <div className="bg-primary/20 p-1.5 rounded-full mr-4 flex-shrink-0 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                  <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                </div>
                <p className="text-slate-300 font-medium leading-relaxed mt-0.5">{reason}</p>
              </motion.div>
            ))}
          </div>
       </CardContent>
    </Card>
  );
}
