import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import ToastContainer from './components/Toast';
import Background3D from './components/Background3D';
import FloatingAIAssistant from './components/FloatingAIAssistant';

import LandingPage from './pages/LandingPage';
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
import AdvancedToolsPage from './pages/AdvancedToolsPage';

function AppContent() {
  const { activeTab, bg3DEnabled } = useRestaurant();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
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
      case 'assistant':
        return <DashboardPage />;
      case 'advanced':
        return <AdvancedToolsPage />;
      case 'settings':
        return <SettingsPage />;
      // Backward-compatible direct fallbacks
      case 'allocation':
        return <AdvancedToolsPage />;
      case 'simulation':
        return <AdvancedToolsPage />;
      case 'comparison':
        return <AdvancedToolsPage />;
      case 'analytics':
        return <AdvancedToolsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#111613] text-[#28352D] dark:text-[#F3EFEA] flex relative overflow-x-hidden selection:bg-[#55745E]/20 dark:selection:bg-[#6E9A7B]/30 transition-colors duration-200">
      {/* 3D Isometric & Depth Elements Canvas (Default Disabled) */}
      <Background3D enabled={bg3DEnabled} />

      {/* Sidebar Navigation */}
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

      {/* Floating AI Assistant (Shown on all dashboard pages after entering app) */}
      {activeTab !== 'landing' && <FloatingAIAssistant />}

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RestaurantProvider>
          <AppContent />
        </RestaurantProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
