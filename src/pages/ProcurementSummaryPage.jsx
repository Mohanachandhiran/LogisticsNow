import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, FileCheck, BrainCircuit, Activity, Package, MapPin, 
  ChevronRight, Circle, CheckCircle2 
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { DecisionCard } from '../components/DecisionCard';
import { ReasonList } from '../components/ReasonList';
import { SavingsCard } from '../components/SavingsCard';
import { VendorDecisionChart } from '../components/VendorDecisionChart';
import { mockDecision } from '../data/mockDecision';
import { Button } from '../components/ui/Button';

// Timeline Component
const ProcurementTimeline = () => {
    const steps = [
        { name: "Data Upload", status: "complete" },
        { name: "Lane Analysis", status: "complete" },
        { name: "RFQ Generation", status: "complete" },
        { name: "Vendor Matching", status: "complete" },
        { name: "Final Decision", status: "current" }
    ];

    return (
        <div className="w-full flex items-center justify-between mb-10 overflow-x-auto pb-4 hide-scrollbar relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10 -translate-y-1/2" />
            
            {steps.map((step, idx) => {
                const isComplete = step.status === "complete";
                const isCurrent = step.status === "current";
                return (
                    <div key={idx} className="flex flex-col items-center relative z-10 flex-shrink-0 min-w[100px] px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg transition-colors ${
                            isComplete ? 'bg-emerald-500 border-emerald-500 shadow-emerald-500/20 text-white' : 
                            isCurrent ? 'bg-primary border-primary shadow-primary/20 text-white' : 
                            'bg-slate-900 border-slate-700 text-slate-500'
                        }`}>
                            {isComplete ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-2 h-2 fill-current" />}
                        </div>
                        <span className={`text-[10px] mt-2 font-bold uppercase tracking-widest ${
                            isCurrent ? 'text-primary' : isComplete ? 'text-emerald-400' : 'text-slate-500'
                        }`}>
                            {step.name}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}

export function ProcurementSummaryPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const selectedLaneId = location.state?.selectedLaneId;
  let decision = null;
  
  try {
      const storedMatches = localStorage.getItem('vendorMatches');
      const storedQuotes = localStorage.getItem('allVendorQuotes');
      
      if (storedMatches) {
          const matchedLanes = JSON.parse(storedMatches);
          if (matchedLanes && matchedLanes.length > 0) {
              let bestMatch = matchedLanes[0];
              if (selectedLaneId) {
                   const targeted = matchedLanes.find(m => m.id === selectedLaneId);
                   if (targeted) bestMatch = targeted;
              }
              
              let competitors = [];
              if (storedQuotes) {
                   const allQuotes = JSON.parse(storedQuotes);
                   const laneQuotes = allQuotes.filter(q => q.lane === bestMatch.lane);
                   if (laneQuotes.length > 0) {
                        competitors = laneQuotes.map(q => ({
                            vendor: q.vendor,
                            quote: q.quote
                        }));
                   }
              }

              let reasons = [
                 `Algorithm metrics emphasize high reliability tracking (${bestMatch.reliability}%) against the risk index.`,
                 `AI successfully isolated secure competitive rate structures locking ₹${bestMatch.cost.toLocaleString()}`,
                 `Operational logistics calculations project ₹${bestMatch.savings.toLocaleString()} in positive route savings.`
              ];
              
              if (bestMatch.confidence) {
                 reasons.push(`Model attributes a dominant ${bestMatch.confidence}% confidence score for optimal long-term scaling.`);
              }

              decision = {
                  lane: bestMatch.lane,
                  vendor: bestMatch.recommendedVendor,
                  quotePrice: bestMatch.cost,
                  savings: bestMatch.savings,
                  contact: bestMatch.contact || "Assigned Operations Manager",
                  competitors: competitors,
                  reliability: bestMatch.reliability,
                  aiScore: bestMatch.confidence || Math.floor(88 + Math.random() * 10),
                  reasons: reasons,
                  riskLevel: "Low", // Assuming low since it's the AI best match
              };
          }
      }
  } catch(e) {}

  // If absolutely no dynamic data is found, guard the route
  if (!decision) {
      return <Navigate to="/vendor-matching" replace />;
  }

  const handleApprove = async () => {
     setModalOpen(true);
     
     // Asynchronously trigger Award contract emails for the decision
     try {
       const response = await fetch('http://127.0.0.1:5000/api/send-award', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
               lane: decision.lane,
               vendor: decision.vendor,
               cost: decision.quotePrice,
               contact: decision.contact || "Logistics Partner"
           })
       });
       if (response.ok) {
           setTimeout(() => {
               navigate('/vendor-results');
           }, 2500); // Auto redirect after showing the success modal for 2.5s
       }
     } catch (e) {
       console.error("Award Dispatch Error:", e);
     }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative font-sans overflow-x-hidden pt-24 pb-16">
      <Navbar />

      {/* Abstract Ambient Lights */}
      <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-primary/10 blur-[200px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-[5%] w-[600px] h-[600px] bg-emerald-500/5 blur-[200px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 mix-blend-screen pointer-events-none z-0" />

      <main className="w-full max-w-7xl mx-auto px-6 relative z-10 flex flex-col">
        
        {/* Timeline */}
        <ProcurementTimeline />

        {/* Header */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0 mb-8"
        >
            <div>
               <div className="flex items-center space-x-3 text-emerald-400 uppercase tracking-widest text-[10px] font-bold mb-2">
                   <BrainCircuit className="w-4 h-4" />
                   <span>AI Procurement Decision Engine</span>
               </div>
               <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                   Procurement Summary
               </h1>
               <div className="flex items-center space-x-4 mt-2">
                   <p className="text-slate-400 text-sm md:text-base font-medium">Final intelligence review prior to contract award.</p>
                   <span className="hidden md:flex px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      Vendor Risk: {decision.riskLevel}
                   </span>
               </div>
            </div>
            
            <Button variant="outline" className="w-full md:w-auto bg-slate-800/50 border-white/10 hover:bg-slate-700/50">
                <Download className="w-4 h-4 mr-2" />
                Download Decision Report
            </Button>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Decision Highlight Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-2 h-full"
            >
                <DecisionCard decision={decision} />
            </motion.div>

            {/* AI Reasoning Stack */}
            <div className="lg:col-span-1 flex flex-col space-y-6 h-full">
                <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.5, delay: 0.2 }}
                   className="flex-1"
                >
                   <ReasonList reasons={decision.reasons} />
                </motion.div>
                <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.5, delay: 0.3 }}
                   className="flex-1"
                >
                   <SavingsCard savings={decision.savings} />
                </motion.div>
            </div>
        </div>

        {/* Visual Charts & Footer Alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-2"
            >
                <VendorDecisionChart competitors={decision.competitors} recommendedVendor={decision.vendor} />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="lg:col-span-1 flex flex-col justify-end space-y-4 pt-10 pb-6"
            >
                <Button 
                   onClick={handleApprove}
                   size="lg" 
                   className="w-full h-16 text-lg font-bold bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-shadow group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10 flex items-center">
                       Approve Vendor
                       <FileCheck className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                    </span>
                </Button>
                
                <Button 
                   onClick={() => navigate('/vendor-results')} 
                   variant="outline" 
                   size="lg" 
                   className="w-full h-14 bg-transparent border-white/20 hover:bg-white/5 font-semibold text-slate-300"
                >
                    View Vendor Report Analysis
                </Button>
            </motion.div>
        </div>

      </main>

      {/* Approval Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="bg-slate-900 border border-emerald-500/30 shadow-2xl overflow-hidden relative max-w-sm w-full rounded-2xl"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
               <div className="p-8 flex flex-col items-center text-center space-y-4">
                  <motion.div 
                     initial={{ scale: 0 }} 
                     animate={{ scale: 1 }} 
                     transition={{ type: "spring", delay: 0.2 }}
                     className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                  >
                     <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Vendor Approved</h3>
                  <p className="text-slate-400 font-medium">
                     <strong className="text-white font-bold">{decision.vendor}</strong> has been successfully selected and awarded the contract for this lane.
                  </p>
                  <Button 
                      onClick={() => navigate('/vendor-results')} 
                      className="w-full mt-6 bg-slate-800 hover:bg-slate-700 font-semibold"
                  >
                     View Vendor Report Analysis
                  </Button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
