import React, { useState } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import ToastContainer from './components/Toast';
import Background3D from './components/Background3D';

import DashboardPage from './pages/DashboardPage';
import TableManagementPage from './pages/TableManagementPage';
import WaiterManagementPage from './pages/WaiterManagementPage';
import CustomerQueuePage from './pages/CustomerQueuePage';
import ReservationsPage from './pages/ReservationsPage';
import AIAllocationPage from './pages/AIAllocationPage';
import SimulationPage from './pages/SimulationPage';
import AlgorithmComparisonPage from './pages/AlgorithmComparisonPage';
import AIAssistantPage from './pages/AIAssistantPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
  const { activeTab, bg3DEnabled } = useRestaurant();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'tables':
        return <TableManagementPage />;
      case 'waiters':
        return <WaiterManagementPage />;
      case 'queue':
        return <CustomerQueuePage />;
      case 'reservations':
        return <ReservationsPage />;
      case 'allocation':
        return <AIAllocationPage />;
      case 'simulation':
        return <SimulationPage />;
      case 'comparison':
        return <AlgorithmComparisonPage />;
      case 'assistant':
        return <AIAssistantPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080B11]/90 text-slate-100 flex relative overflow-x-hidden">
      {/* Ambient Lighting Depth Glows */}
      <div className="fixed top-[-100px] right-[10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-100px] left-[15%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* 3D Isometric & Depth Elements Canvas */}
      <Background3D enabled={bg3DEnabled} />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 z-10">
        <TopNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <RestaurantProvider>
      <AppContent />
    </RestaurantProvider>
  );
}
