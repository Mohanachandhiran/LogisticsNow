/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { motion } from 'framer-motion';

export function UploadCard({ onProcessRequest }) {
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
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    setSelectedFile(file);
  };

  return (
    <Card className="w-full max-w-lg mx-auto overflow-hidden">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-3xl font-bold">Logistics Data Upload</CardTitle>
        <CardDescription className="text-base mt-2 text-slate-400">
          Upload your raw shipment CSV or Excel file to begin cleaning and generating intelligent lanes.
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
            id="file-upload"
            type="file"
            className="hidden"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleChange}
          />
          
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
            <UploadCloud className="w-16 h-16 text-slate-400 group-hover:text-primary transition-colors mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">
              Drag & Drop Shipment File Here
            </h4>
            <span className="text-slate-400 font-medium bg-slate-800/50 px-3 py-1 rounded-full text-sm">
              or Browse File
            </span>
            <p className="mt-6 text-xs text-slate-500 font-medium">
              Supported: CSV / Excel (XLSX, XLS)
            </p>
          </label>
        </motion.div>

        {selectedFile && (
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex items-center justify-between p-4 mt-6 bg-slate-800/80 rounded-xl border border-white/5"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <FileSpreadsheet className="w-8 h-8 text-emerald-400 flex-shrink-0" />
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
          onClick={() => onProcessRequest(selectedFile)}
          disabled={!selectedFile}
          className="w-full text-lg h-14 bg-gradient-to-r from-primary to-secondary text-white border-0 hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/25 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 disabled:shadow-none"
        >
          Process Data
        </Button>
      </CardFooter>
    </Card>
  );
}
