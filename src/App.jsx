import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UploadPage } from './pages/UploadPage';
import { LaneDashboard } from './pages/LaneDashboard';
import { RFQPage } from './pages/RFQPage';
import { VendorMatchingPage } from './pages/VendorMatchingPage';
import { VendorResultsPage } from './pages/VendorResultsPage';
import { ProcurementSummaryPage } from './pages/ProcurementSummaryPage';

function App() {
  return (
    <div className="dark">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/lanes" element={<LaneDashboard />} />
          <Route path="/generate-rfq" element={<RFQPage />} />
          <Route path="/vendor-matching" element={<VendorMatchingPage />} />
          <Route path="/vendor-results" element={<VendorResultsPage />} />
          <Route path="/procurement-summary" element={<ProcurementSummaryPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
