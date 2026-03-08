/* eslint-disable no-unused-vars */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, IndianRupee, Activity, Crown, Download, Network } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { MetricCard } from '../components/MetricCard';
import { MatchTable } from '../components/MatchTable';
import { VendorMatchCharts } from '../components/VendorMatchCharts';
import { Button } from '../components/ui/Button';
import { vendorMatches as mockMatches } from '../data/mockMatches';

export function VendorResultsPage() {
  const storedMatches = localStorage.getItem('vendorMatches');
  let vendorMatches = null;
  if (storedMatches) {
      try {
          const parsed = JSON.parse(storedMatches);
          if (parsed && parsed.length > 0) vendorMatches = parsed;
      } catch (e) {}
  }

  // If absolutely no dynamic data is found, guard the route
  if (!vendorMatches || vendorMatches.length === 0) {
      return <Navigate to="/vendor-matching" replace />;
  }

  const totalLanesMatched = vendorMatches.length;
  const totalCostSavings = vendorMatches.reduce((acc, curr) => acc + curr.savings, 0);
  const avgReliability = vendorMatches.length > 0 ? Math.round(vendorMatches.reduce((acc, curr) => acc + curr.reliability, 0) / vendorMatches.length) : 0;
  
  // Find top vendor based on allocation frequency
  const allocation = {};
  vendorMatches.forEach(v => {
      allocation[v.recommendedVendor] = (allocation[v.recommendedVendor] || 0) + 1;
  });
  const topVendor = Object.keys(allocation).sort((a,b) => allocation[b] - allocation[a])[0];

  return (
    <div className="min-h-screen bg-background text-foreground relative font-sans overflow-x-hidden pt-24 pb-16">
      <Navbar />

      {/* Abstract Animated Gradients */}
      <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-10 left-[-100px] w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 mix-blend-screen pointer-events-none z-0" />

      <main className="w-full max-w-7xl mx-auto px-6 relative z-10 flex flex-col space-y-8">
        {/* Header Section */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0"
        >
            <div>
               <div className="flex items-center space-x-3 text-secondary uppercase tracking-widest text-xs font-bold mb-2">
                   <Network className="w-4 h-4" />
                   <span>AI Vendor Matching Engine</span>
               </div>
               <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                   Final Intelligence Results
               </h1>
               <p className="text-slate-400 text-sm md:text-base font-medium max-w-lg">
                   Automatically assigned lanes based on comprehensive price-vs-reliability optimizations.
               </p>
            </div>
            <div className="flex items-center space-x-3">
               <Button variant="outline" className="hidden md:flex bg-slate-800/50 border-white/10 hover:bg-slate-700/50">
                  <Download className="w-4 h-4 mr-2" />
                  Download Allocation Report
               </Button>
            </div>
        </motion.div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           <MetricCard title="Lines Matched" value={totalLanesMatched} icon={Map} delay={0.1} />
           <MetricCard title="Total Cost Savings" value={`₹${totalCostSavings.toLocaleString()}`} icon={IndianRupee} delay={0.2} trend={8.4} />
           <MetricCard title="Average Reliability" value={`${avgReliability}%`} icon={Activity} delay={0.3} trend={2.1} />
           <MetricCard title="Top Vendor Partner" value={topVendor} icon={Crown} delay={0.4} />
        </div>

        {/* Intelligence Table */}
        <MatchTable data={vendorMatches} />

        {/* Charts Section */}
        <div className="pt-4 pb-8">
           <VendorMatchCharts data={vendorMatches} />
        </div>

        {/* Call to Action Wrapper for mobile */}
        <div className="flex w-full justify-center md:hidden pt-4">
           <Button className="w-full bg-slate-800 border-white/10 hover:bg-slate-700">
               <Download className="w-4 h-4 mr-2" />
               Download Report
           </Button>
        </div>

      </main>
    </div>
  );
}
