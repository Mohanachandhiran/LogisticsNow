/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { UploadVendorCard } from '../components/UploadVendorCard';
import { VendorProcessingSteps } from '../components/VendorProcessingSteps';
import { VendorTable } from '../components/VendorTable';
import { VendorCharts } from '../components/VendorCharts';
import { mockVendorQuotes } from '../data/mockVendorQuotes';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Truck } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function VendorMatchingPage() {
  const [appState, setAppState] = useState('upload'); // upload, processing, complete, insights
  const [allVendorQuotes, setAllVendorQuotes] = useState(mockVendorQuotes); // default to mock on error

  const handleProcessStart = async (file) => {
    setAppState('processing');
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/vendor-match`, {
            method: 'POST',
            body: formData,
        });
        
        const result = await response.json();
        
        if (response.ok) {
            setAllVendorQuotes(result.all_quotes || result.matches);
            localStorage.setItem('vendorMatches', JSON.stringify(result.matches));
            localStorage.setItem('allVendorQuotes', JSON.stringify(result.all_quotes));
        } else {
            console.error(result.error);
            alert('Error processing file: ' + result.error);
            setAppState('upload');
        }
    } catch (error) {
         console.error('Fetch error:', error);
         alert('Cannot connect to Python backend. Generating Mock.');
    }
  };

  const handleProcessComplete = () => {
    setAppState('complete');
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative font-sans overflow-x-hidden pt-20 pb-16">
      <Navbar />

      {/* Futuristic Background Design */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/10 blur-[200px] rounded-full pointer-events-none mix-blend-lighten" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 mix-blend-screen pointer-events-none z-0" />
      
      {/* Animated Truck Route overlay simulation */}
      <div className="absolute left-0 top-1/2 w-full h-[1px] bg-white/5 pointer-events-none z-0 overflow-hidden">
          <motion.div 
             initial={{ x: "-10%" }}
             animate={{ x: "110%" }}
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             className="w-16 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent"
          />
      </div>

      <main className="w-full max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
        <AnimatePresence mode="wait">
          
          {/* STATE: UPLOAD */}
          {appState === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full flex flex-col items-center"
            >
              <div className="text-center mb-10 max-w-3xl mx-auto space-y-4">
                 <div className="flex justify-center items-center space-x-3 mb-2">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/10 rounded-full border border-secondary/20">
                       Vendor Matching Engine
                    </span>
                 </div>
                 <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
                   Evaluate & Match Vendor Intelligence
                 </h1>
                 <p className="text-lg text-slate-400 font-medium">
                   Upload bulk vendor quotations to securely trigger deep AI matching, minimizing costs while maximizing carrier reliability.
                 </p>
              </div>

              <UploadVendorCard onRunMatching={handleProcessStart} />
            </motion.div>
          )}

          {/* STATE: PROCESSING */}
          {appState === 'processing' && (
             <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-xl"
             >
                <Card className="w-full bg-slate-900 border-primary/20 shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
                  <CardContent className="pt-10 pb-8 px-10">
                     <h3 className="text-2xl font-bold text-center text-white mb-6 tracking-wide">
                        AI Matching Engine Processing
                     </h3>
                     <VendorProcessingSteps onComplete={handleProcessComplete} />
                  </CardContent>
                </Card>
             </motion.div>
          )}

          {/* STATE: COMPLETE */}
          {appState === 'complete' && (
            <motion.div
               key="complete"
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, y: -30 }}
               transition={{ type: "spring", stiffness: 300, damping: 20 }}
               className="w-full max-w-lg text-center"
            >
               <Card className="border-emerald-500/40 bg-slate-900 shadow-2xl shadow-emerald-500/10">
                  <CardContent className="flex flex-col items-center pt-10 pb-10 px-8 space-y-6">
                    <motion.div
                       initial={{ scale: 0 }}
                       animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                       transition={{ type: "spring", delay: 0.1, duration: 0.7 }}
                       className="relative"
                    >
                       <div className="absolute inset-0 bg-emerald-500 blur-[50px] opacity-30 rounded-full" />
                       <CheckCircle2 className="w-24 h-24 text-emerald-400 relative z-10" />
                    </motion.div>

                    <div className="space-y-3">
                       <h2 className="text-3xl font-bold text-white tracking-tight">Vendor Matching Completed</h2>
                       <p className="text-slate-400 font-medium leading-relaxed">
                          Analyzed {allVendorQuotes.length} quotations across major lanes. Processed complex reliability matrices and isolated top performing vendors.
                       </p>
                    </div>

                    <div className="pt-6 w-full opacity-0 animate-[fade-in_0.5s_ease-out_0.5s_forwards]">
                       <Button 
                          onClick={() => setAppState('insights')}
                          className="w-full h-14 text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg shadow-indigo-600/30 group relative overflow-hidden"
                       >
                         <span className="relative z-10 flex items-center">
                            View AI Recommendations
                            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                         </span>
                         <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-300 transform skew-x-12" />
                       </Button>
                    </div>
                  </CardContent>
               </Card>
            </motion.div>
          )}

          {/* STATE: INSIGHTS DASHBOARD */}
          {appState === 'insights' && (() => {
             let totalSavings = 4800;
             try {
                 const stored = localStorage.getItem('vendorMatches');
                 if (stored) {
                     const matches = JSON.parse(stored);
                     totalSavings = matches.reduce((acc, curr) => acc + curr.savings, 0);
                 }
             } catch(e) {}

             return (
             <motion.div
                key="insights"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full flex items-start flex-col"
             >
                <div className="w-full flex flex-col md:flex-row md:items-end justify-between mb-8 space-y-4 md:space-y-0">
                   <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Vendor Match Insights</h2>
                      <p className="text-slate-400 mt-2 font-medium max-w-xl">
                         Holistic view of quoted rates versus carrier reliability, augmented by the AI recommendation engine.
                      </p>
                   </div>
                   <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl">
                         <Truck className="w-5 h-5" />
                         <span className="font-bold">~₹{totalSavings.toLocaleString()} Total Estimated Savings</span>
                      </div>
                      <Button variant="outline" onClick={() => setAppState('upload')}>New Evaluation</Button>
                   </div>
                </div>
                
                {/* Visuals */}
                <div className="w-full mb-8">
                   <VendorCharts data={allVendorQuotes} />
                </div>

                {/* Table */}
                <div className="w-full pb-10">
                   <VendorTable data={allVendorQuotes} />
                </div>

             </motion.div>
             );
          })()}
        </AnimatePresence>
      </main>
    </div>
  );
}
