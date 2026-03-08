/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileSpreadsheet, XCircle, BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/Card';
import { Button } from './ui/Button';

export function UploadVendorCard({ onRunMatching }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto overflow-hidden shadow-2xl shadow-indigo-500/10">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold flex justify-center items-center">
            <BrainCircuit className="w-6 h-6 mr-3 text-secondary" />
            Vendor Quotation Upload
        </CardTitle>
        <CardDescription className="text-base mt-2 text-slate-400">
          Upload bulk vendor quotations to trigger the AI-powered matching engine.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <motion.div
          animate={dragActive ? "active" : "inactive"}
          variants={{
            active: { scale: 1.02, borderColor: '#6366F1', backgroundColor: 'rgba(99, 102, 241, 0.1)' },
            inactive: { scale: 1, borderColor: 'rgba(255, 255, 255, 0.1)', backgroundColor: 'transparent' }
          }}
          transition={{ duration: 0.2 }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className="relative mt-4 group flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all text-center"
        >
          <input
            id="vendor-upload"
            type="file"
            className="hidden"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleChange}
          />
          
          <label htmlFor="vendor-upload" className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
             <motion.div
                 whileHover={{ y: -5, scale: 1.1 }}
                 transition={{ type: "spring", stiffness: 400, damping: 10 }}
             >
                <UploadCloud className="w-16 h-16 text-slate-400 group-hover:text-primary transition-colors mb-4" />
             </motion.div>
            <h4 className="text-xl font-semibold text-white mb-2">
              Drag & Drop Vendor Quote File
            </h4>
            <span className="text-slate-400 font-medium bg-slate-800/80 px-4 py-1.5 rounded-full text-sm shadow-inner shadow-black/50">
              or Browse File
            </span>
            <p className="mt-6 text-xs text-slate-500 font-medium tracking-wide">
              Supported: CSV / Excel (XLSX, XLS)
            </p>
          </label>
        </motion.div>

        {selectedFile && (
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex items-center justify-between p-4 mt-6 bg-slate-800/80 rounded-xl border border-white/5 shadow-inner"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <FileSpreadsheet className="w-8 h-8 text-secondary flex-shrink-0" />
              <div className="flex flex-col items-start truncate overflow-hidden pr-4">
                <span className="text-white font-medium truncate w-full">{selectedFile.name}</span>
                <span className="text-slate-400 text-xs text-left">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
            <button
              className="text-slate-400 hover:text-rose-400 transition-colors flex-shrink-0"
              onClick={() => setSelectedFile(null)}
            >
              <XCircle className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => onRunMatching(selectedFile)}
          disabled={!selectedFile}
          className="w-full text-lg h-14 bg-gradient-to-r from-primary to-secondary text-white border-0 hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/25 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 disabled:shadow-none overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
          <span className="relative z-10 flex items-center">
             Run Vendor Matching
             <BrainCircuit className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
}
