/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Card, CardContent } from './ui/Card';

export function MetricCard({ title, value, icon: Icon, delay = 0, trend }) {
  const [displayValue, setDisplayValue] = useState(0);
  const isNumeric = typeof value === 'number';
  const targetValue = isNumeric ? value : parseFloat(value.toString().replace(/[^0-9.]/g, ''));
  const prefix = !isNumeric && value.toString().includes('₹') ? '₹' : '';
  const suffix = !isNumeric && !value.toString().includes('₹') ? value.toString().replace(/[0-9.,]/g, '') : '';

  useEffect(() => {
    let startTime;
    let animationFrame;
    const duration = 1500; // 1.5s animation

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      if (progress < duration) {
        const nextVal = Math.floor((progress / duration) * targetValue);
        setDisplayValue(nextVal);
        animationFrame = requestAnimationFrame(animateCount);
      } else {
        setDisplayValue(targetValue);
      }
    };

    const timer = setTimeout(() => {
        animationFrame = requestAnimationFrame(animateCount);
    }, delay * 1000);

    return () => {
        clearTimeout(timer);
        if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [targetValue, delay]);

  const formattedValue = isNumeric || suffix === '' ? 
    (prefix ? `${prefix}${displayValue.toLocaleString()}` : displayValue.toLocaleString()) : 
    value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative group cursor-default"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-20 blur-xl rounded-2xl transition-opacity duration-300" />
      <Card className="relative h-full overflow-hidden border-white/5 bg-card/80 backdrop-blur-md group-hover:border-primary/30 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-400">{title}</h3>
            <div className="p-2 bg-slate-800/50 rounded-lg text-slate-300 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
              <Icon className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {formattedValue}
            </h2>
            {trend && (
              <span className={`text-xs font-semibold ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
        </CardContent>
        
        {/* Decorative gradient line */}
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ width: '100%' }} />
      </Card>
    </motion.div>
  );
}
