/* eslint-disable no-unused-vars */
import React from 'react';
import { PackageSearch, Bell, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Upload Data', path: '/upload' },
    { name: 'Lane Dashboard', path: '/lanes' },
    { name: 'Generate RFQ', path: '/generate-rfq' },
    { name: 'Vendor Matching', path: '/vendor-matching' },
    { name: 'Vendor Results', path: '/vendor-results' },
    { name: 'Procurement Summary', path: '/procurement-summary' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-background/50 backdrop-blur-xl z-50 px-6 flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-3 group">
        <div className="bg-gradient-to-br from-primary to-secondary p-1.5 rounded-lg group-hover:shadow-[0_0_15px_#6366F1] transition-shadow">
          <PackageSearch className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-semibold text-xl tracking-tight hidden md:block">
          Lane Intelligence Builder
        </span>
      </Link>
      
      <div className="hidden lg:flex flex-1 justify-center">
        <div className="flex items-center space-x-1 border border-white/5 bg-slate-900/50 backdrop-blur-md rounded-full px-2 py-1 shadow-inner shadow-black/50">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path === '/upload' && location.pathname === '/');
            return (
              <Link
                key={link.path}
                to={link.path}
                relative="path"
                className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? 'text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center space-x-4 text-slate-400">
        <motion.button whileHover={{ scale: 1.1 }} className="hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} className="hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
        </motion.button>
        <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors">
          <img src="https://ui-avatars.com/api/?name=User&background=6366F1&color=fff" alt="User Profile" />
        </div>
      </div>
    </nav>
  );
}
