/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, FileText, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';

const steps = [
  { id: 1, text: "Packaging lane data", icon: Box },
  { id: 2, text: "Preparing RFQ template", icon: FileText },
  { id: 3, text: "Sending vendor invites", icon: Send }
];

export function RFQModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000); // 2 seconds per step
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentStep]);

  const isComplete = currentStep === steps.length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
           initial={{ scale: 0.95, opacity: 0, y: 30 }}
           animate={{ scale: 1, opacity: 1, y: 0 }}
           exit={{ scale: 0.95, opacity: 0, y: 30 }}
           transition={{ type: "spring", stiffness: 300, damping: 25 }}
           className="w-full max-w-md relative"
        >
          <Card className="bg-slate-900 border-primary/20 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
            <CardContent className="p-8 flex flex-col items-center">
              
              {!isComplete ? (
                 <>
                    <div className="text-center mb-8">
                       <h2 className="text-2xl font-bold text-white mb-2">RFQ Generation Started</h2>
                       <p className="text-slate-400 text-sm">Preparing RFQ packages for selected lanes. Vendors will be invited to submit quotes.</p>
                    </div>

                    <div className="w-full space-y-6">
                      {steps.map((step, index) => {
                         const isPending = index > currentStep;
                         const isActive = index === currentStep;
                         const isDone = index < currentStep;
                         const StepIcon = step.icon;

                         return (
                            <motion.div 
                               initial={{ opacity: 0, x: -20 }}
                               animate={{ opacity: isPending ? 0.3 : 1, x: 0 }}
                               key={step.id}
                               className="flex items-center space-x-4 w-full bg-slate-800/50 p-3 rounded-lg border border-white/5"
                            >
                               <div className="relative">
                                  {isDone ? (
                                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                         <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                      </motion.div>
                                  ) : isActive ? (
                                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                  ) : (
                                      <StepIcon className="w-6 h-6 text-slate-500" />
                                  )}
                               </div>
                               <span className={`font-medium ${isActive ? 'text-white' : isDone ? 'text-slate-300' : 'text-slate-500'}`}>
                                  {step.text}
                               </span>
                               {isActive && (
                                   <motion.span
                                     initial={{ opacity: 0 }}
                                     animate={{ opacity: [0, 1, 0] }}
                                     transition={{ repeat: Infinity, duration: 1.5 }}
                                     className="text-primary font-bold ml-auto"
                                   >...</motion.span>
                               )}
                            </motion.div>
                         );
                      })}
                    </div>
                 </>
              ) : (
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center space-y-6 py-6"
                 >
                    <div className="relative">
                       <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                       <CheckCircle2 className="w-24 h-24 text-emerald-400 relative z-10" />
                    </div>
                    <div>
                       <h2 className="text-2xl font-bold text-white mb-2">RFQ Generated Successfully</h2>
                       <p className="text-slate-400 text-sm">Vendor invitation templates have been dispatched for the selected lanes.</p>
                    </div>
                    <Button 
                        onClick={onClose} 
                        className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white"
                    >
                        Back to Dashboard
                    </Button>
                 </motion.div>
              )}

            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
