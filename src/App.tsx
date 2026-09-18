import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

import { DashboardView } from './pages/Dashboard';
import { PlanningView } from './pages/Planning';
import { CostsView } from './pages/Costs';
import { InfrastructureView } from './pages/Infrastructure';
import { SecurityView } from './pages/Security';
import { NetworkView } from './pages/Network';
import { ServicesView } from './pages/Services';

export const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-bgMain font-sans transition-colors duration-250">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 flex flex-col min-w-0">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardView />} />
                <Route path="/planning" element={<PlanningView />} />
                <Route path="/costs" element={<CostsView />} />
                <Route path="/infrastructure" element={<InfrastructureView />} />
                <Route path="/security" element={<SecurityView />} />
                <Route path="/network" element={<NetworkView />} />
                <Route path="/services" element={<ServicesView />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;