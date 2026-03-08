import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { LaneCard } from '../components/LaneCard';
import { RFQSummary } from '../components/RFQSummary';
import { RFQModal } from '../components/RFQModal';
import { mockRfqLanes } from '../data/mockRfqLanes';
import { motion, AnimatePresence } from 'framer-motion';
import { Route } from 'lucide-react';

export function RFQPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const { register, watch, handleSubmit } = useForm({
    defaultValues: { selectedLanes: [] }
  });

  const storedLanes = localStorage.getItem('processedLanes');
  let activeLanes = null;
  if (storedLanes) {
    try {
      const parsed = JSON.parse(storedLanes);
      if (parsed && parsed.length > 0) activeLanes = parsed;
    } catch(e) {}
  }

  // If absolutely no dynamic data is found, guard the route
  if (!activeLanes || activeLanes.length === 0) {
      return <Navigate to="/upload" replace />;
  }

  const selectedLaneIds = watch('selectedLanes') || [];
  // Ensure robust string comparison for dynamic IDs vs static Mock numeric IDs
  const checkedIds = selectedLaneIds.map(id => id.toString());
  
  const selectedLanesData = activeLanes.filter(l => checkedIds.includes(l.id.toString()));

  const totalShipments = selectedLanesData.reduce((acc, l) => acc + l.shipments, 0);
  const estimatedValue = selectedLanesData.reduce((acc, l) => acc + (l.avgCost * l.shipments), 0);

  const onSubmit = (data) => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);

    // Fire bulk RFQ emails asynchronously in the background
    try {
      selectedLanesData.forEach(async (lane) => {
        const potentialImpact = lane.healthScore ? Math.floor(100 - lane.healthScore) : 15;
        await fetch('http://127.0.0.1:5000/api/send-rfq', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lane: lane.lane,
                vendor: "Premium Partner",
                shipments: lane.shipments,
                impact: Math.max(1, potentialImpact) // Safe impact floor
            })
        });
      });
    } catch (e) {
      console.error("Bulk RFQ Error:", e);
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative font-sans overflow-x-hidden pt-20 pb-16">
      <Navbar />

      {/* Abstract Animated Gradients */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-primary/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-100px] right-[10%] w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 mix-blend-screen pointer-events-none z-0" />

      <main className="w-full max-w-7xl mx-auto px-6 relative z-10 flex flex-col">
        {/* Header Section */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <div className="flex items-center space-x-3 text-primary uppercase tracking-widest text-xs font-bold mb-2">
                <Route className="w-4 h-4" />
                <span>RFQ Generation</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                Select lanes to send RFQ
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-medium max-w-lg">
                Choose the optimized lanes you'd like to package and dispatch for dynamic vendor bidding.
            </p>
        </motion.div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Lane Selection List */}
            <div className="lg:col-span-2 flex flex-col space-y-4">
                {activeLanes.map((lane, idx) => (
                   <motion.div
                       key={lane.id}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: idx * 0.1, duration: 0.4 }}
                   >
                       <LaneCard 
                           lane={lane} 
                           register={register}
                           isSelected={checkedIds.includes(lane.id.toString())}
                       />
                   </motion.div>
                ))}
            </div>

            {/* Sticky Summary Panel */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-1"
            >
                <RFQSummary 
                    selectedCount={checkedIds.length}
                    totalShipments={totalShipments}
                    estimatedValue={estimatedValue}
                    isGenerating={modalOpen}
                />
            </motion.div>
        </form>

      </main>

      {/* RFQ Processing Modal */}
      {modalOpen && (
          <RFQModal isOpen={modalOpen} onClose={handleCloseModal} />
      )}

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 border border-emerald-500/30 shadow-2xl shadow-emerald-900/40 text-white px-6 py-4 rounded-full flex items-center space-x-3 z-50 backdrop-blur-md"
          >
             <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981] animate-pulse" />
             <span className="font-semibold tracking-wide">RFQ generated and sent to target vendors.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
