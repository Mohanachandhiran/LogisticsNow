/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

const steps = [
  'Uploading file',
  'Cleaning location names',
  'Detecting shipment lanes',
  'Clustering loads',
  'Generating procurement insights'
];

export function ProcessingSteps({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1500 + Math.random() * 1000); // 1.5 - 2.5s per step
      return () => clearTimeout(timer);
    } else {
      setTimeout(onComplete, 1000);
    }
  }, [currentStep, onComplete]);

  return (
    <div className="w-full max-w-md mx-auto space-y-4 py-8 relative">
      <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-white/10" />
      <AnimatePresence>
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          const isPending = currentStep < index;

          if (isPending) return null;

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative flex items-center space-x-4 pl-2"
            >
              <div className="relative z-10 bg-card p-1 rounded-full">
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-emerald-400 font-bold"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </motion.div>
                ) : isCurrent ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-primary"
                  >
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </motion.div>
                ) : (
                  <Circle className="w-6 h-6 text-slate-500" />
                )}
              </div>
              <motion.span
                animate={{
                  color: isCompleted ? '#94a3b8' : '#ffffff',
                  fontWeight: isCurrent ? 600 : 400
                }}
                className="text-lg transition-colors"
              >
                {step}
                {isCurrent && <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >...</motion.span>}
              </motion.span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
