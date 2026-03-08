import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { MetricCard } from '../components/MetricCard';
import { LaneTable } from '../components/LaneTable';
import { Charts } from '../components/Charts';
import { mockLanes } from '../data/mockLanes';
import { Map, Package, IndianRupee, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export function LaneDashboard() {
  const location = useLocation();
  let lanesToDisplay = location.state?.lanesData;

  try {
      const stored = localStorage.getItem('processedLanes');
      if (stored) {
         const parsed = JSON.parse(stored);
         if (parsed && parsed.length > 0) {
             lanesToDisplay = parsed;
         }
      }
  } catch (e) {}

  // If absolutely no dynamic data is found, guard the route
  if (!lanesToDisplay || lanesToDisplay.length === 0) {
      return <Navigate to="/upload" replace />;
  }

  // Derive metrics
  const totalLanes = lanesToDisplay.length;
  const totalShipments = lanesToDisplay.reduce((acc, curr) => acc + curr.shipments, 0);
  const totalCost = lanesToDisplay.reduce((acc, curr) => acc + (curr.avgCost * curr.shipments), 0);
  const avgCost = totalShipments > 0 ? Math.round(totalCost / totalShipments) : 0;
  const riskLanes = lanesToDisplay.filter(l => l.healthScore < 50).length;

  return (
    <div className="min-h-screen bg-background text-foreground relative font-sans overflow-x-hidden pt-20 pb-16">
      <Navbar />

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 mix-blend-screen pointer-events-none z-0" />

      <main className="w-full max-w-7xl mx-auto px-6 relative z-10 flex flex-col space-y-8">
        
        {/* Header */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0"
        >
            <div>
               <p className="text-primary font-bold uppercase tracking-widest text-xs mb-1">Procurement Analytics</p>
               <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                 Cleaned Lane Intelligence
               </h1>
               <p className="text-slate-400 text-sm md:text-base font-medium max-w-lg">
                 AI-driven insights on your shipment volumes, costs, and route health scores.
               </p>
            </div>
            <div className="flex items-center space-x-3">
               <span className="text-xs text-slate-500 font-semibold uppercase bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">
                  Last updated: Just now
               </span>
            </div>
        </motion.div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           <MetricCard title="Total Lanes" value={totalLanes} icon={Map} delay={0.1} />
           <MetricCard title="Total Shipments" value={totalShipments} icon={Package} delay={0.2} trend={12.5} />
           <MetricCard title="Average Cost" value={`₹${avgCost.toLocaleString()}`} icon={IndianRupee} delay={0.3} trend={-3.2} />
           <MetricCard title="Risk Lanes" value={riskLanes} icon={AlertTriangle} delay={0.4} />
        </div>

        {/* Intelligence Table */}
        <LaneTable data={lanesToDisplay} />

        {/* Charts Section */}
        <div className="pt-4">
           <Charts data={lanesToDisplay} />
        </div>

      </main>
    </div>
  );
}
