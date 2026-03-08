/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { UploadCard } from '../components/UploadCard';
import { ProcessingSteps } from '../components/ProcessingSteps';
import { Navbar } from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Map } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { mockShipments } from '../data/mockShipments';
import { useNavigate } from 'react-router-dom';

export function UploadPage() {
  const [appState, setAppState] = useState('upload'); // upload, processing, complete, insights
  const [processedLanes, setProcessedLanes] = useState([]);
  const [totalProcessed, setTotalProcessed] = useState(0);
  const navigate = useNavigate();

  const handleProcessStart = async (file) => {
    setAppState('processing');
    
    // Simulate initial process UI state then start fetch
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/analyze`, {
            method: 'POST',
            body: formData,
        });
        
        const result = await response.json();
        
        if (response.ok) {
            setProcessedLanes(result.lanes);
            setTotalProcessed(result.total_processed);
            localStorage.setItem('processedLanes', JSON.stringify(result.lanes));
            // Processing step handles its own timing, but we wait for it to complete eventually
            // handleProcessComplete() will be called by ProcessingSteps component when it finishes
        } else {
            console.error(result.error);
            setAppState('upload');
            alert('Error processing file: ' + result.error);
        }
    } catch (error) {
         console.error('Fetch error:', error);
         setAppState('upload');
         alert('Cannot connect to Python backend');
    }
  };

  const handleProcessComplete = () => {
    setAppState('complete');
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col pt-16 font-sans">
      <Navbar />

      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 z-0 mix-blend-screen pointer-events-none" />
      
      {/* Background gradients */}
      <div className="absolute top-[20%] left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full mix-blend-lighten pointer-events-none" />
      <div className="absolute bottom-[20%] right-1/4 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full mix-blend-lighten pointer-events-none" />

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {appState === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full"
            >
              <div className="text-center mb-10 max-w-2xl mx-auto space-y-4">
                 <motion.h1 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-400 to-secondary pb-1"
                 >
                   AI Logistics Data Engine
                 </motion.h1>
                 <motion.p 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.3 }}
                    className="text-lg text-slate-400 font-medium"
                 >
                   Upload dirty shipment data, clean it using AI, and generate logistics lanes automatically.
                 </motion.p>
              </div>

              <UploadCard onProcessRequest={handleProcessStart} />
            </motion.div>
          )}

          {appState === 'processing' && (
             <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-lg"
             >
                <Card className="w-full bg-card/90">
                  <CardContent className="pt-10 pb-8 px-8">
                     <h3 className="text-2xl font-bold text-center text-white mb-6">Processing Logistics Data Engine</h3>
                     <ProcessingSteps onComplete={handleProcessComplete} />
                  </CardContent>
                </Card>
             </motion.div>
          )}

          {appState === 'complete' && (
            <motion.div
               key="complete"
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, y: -30 }}
               transition={{ type: "spring", stiffness: 300, damping: 25 }}
               className="w-full max-w-md text-center"
            >
               <Card className="border-emerald-500/30 bg-card">
                  <CardContent className="flex flex-col items-center pt-8 pb-8 px-6 space-y-6">
                    <motion.div
                       initial={{ scale: 0 }}
                       animate={{ scale: 1, rotate: [-10, 10, 0] }}
                       transition={{ type: "spring", delay: 0.1, duration: 0.6 }}
                       className="relative"
                    >
                       <div className="absolute inset-0 bg-emerald-500 blur-[40px] opacity-40 rounded-full" />
                       <CheckCircle2 className="w-24 h-24 text-emerald-400 relative z-10" />
                    </motion.div>

                    <div className="space-y-2">
                       <h2 className="text-2xl font-bold text-white tracking-tight">Data Processed Successfully</h2>
                       <p className="text-slate-400 font-medium">
                          Identified and extracted {processedLanes.length} optimized lanes from {totalProcessed} raw shipment records.
                       </p>
                    </div>

                    <div className="pt-4 w-full">
                       <Button 
                          onClick={() => navigate('/lanes', { state: { lanesData: processedLanes } })}
                          className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                       >
                         <Map className="w-5 h-5 mr-2" />
                         View Generated Lanes
                       </Button>
                    </div>
                  </CardContent>
               </Card>
            </motion.div>
          )}

          {appState === 'insights' && (
             <motion.div
                key="insights"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-5xl"
             >
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-3xl font-bold text-white tracking-tight">Intelligent Logistics Lanes</h2>
                   <Button variant="outline" onClick={() => setAppState('upload')}>Upload New File</Button>
                </div>
                
                <Card className="bg-card shadow-2xl overflow-hidden border-white/5">
                   <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-slate-300">
                         <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-white/5">
                            <tr>
                               <th scope="col" className="px-6 py-4 rounded-tl-xl font-semibold tracking-wider">Origin Location</th>
                               <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Destination Location</th>
                               <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Historical Loads</th>
                               <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Prediction</th>
                               <th scope="col" className="px-6 py-4 rounded-tr-xl font-semibold tracking-wider">Confidence</th>
                            </tr>
                         </thead>
                         <tbody>
                            {mockShipments.map((lane, idx) => (
                               <motion.tr 
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  key={idx} 
                                  className="border-b border-white/5 bg-transparent hover:bg-white/5 transition-colors"
                               >
                                  <td className="px-6 py-4 font-medium text-white flex items-center space-x-2">
                                     <div className="w-2 h-2 rounded-full bg-primary/50" />
                                     <span>{lane.origin}</span>
                                  </td>
                                  <td className="px-6 py-4 font-medium text-white flex items-center space-x-2">
                                     <div className="w-2 h-2 rounded-full bg-secondary/50" />
                                     <span>{lane.destination}</span>
                                  </td>
                                  <td className="px-6 py-4 text-slate-300 font-mono text-base">
                                     {lane.loads}
                                  </td>
                                  <td className="px-6 py-4">
                                     <span className="bg-primary/20 text-primary-foreground px-3 py-1 text-xs font-semibold rounded-full border border-primary/20">
                                       +{Math.floor(lane.loads * 0.15)} projected
                                     </span>
                                  </td>
                                  <td className="px-6 py-4">
                                     <div className="flex items-center space-x-3">
                                        <div className="w-full bg-slate-800 rounded-full h-2 min-w-[80px]">
                                           <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${lane.confidenceWidth}%` }}></div>
                                        </div>
                                        <span className="text-emerald-400 font-mono text-xs font-bold">High</span>
                                     </div>
                                  </td>
                               </motion.tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </Card>
             </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
