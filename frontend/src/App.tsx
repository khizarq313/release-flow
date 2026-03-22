import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import DetailView from './components/DetailView';
import CreateReleaseModal from './components/CreateReleaseModal';
import { ToastProvider } from './components/Toast';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';

export type ViewType = 'dashboard' | 'releases' | 'analytics' | 'settings';
export type UserProfile = { name: string; role: string; initials: string };

function AppContent() {
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [userProfile, setUserProfile] = useState<UserProfile>({ 
    name: 'Dev Ops', 
    role: 'Release Lead', 
    initials: 'DO' 
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Handle clicking a release from dashboard
  const handleSelectRelease = (id: string) => {
    setSelectedReleaseId(id);
    setCurrentView('releases');
  };

  // Render main content area based on state
  const renderContent = () => {
    if (selectedReleaseId) {
      return <DetailView id={selectedReleaseId} onBack={() => {
        setSelectedReleaseId(null);
        setCurrentView('dashboard');
      }} />;
    }
    
    switch (currentView) {
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView theme={theme} setTheme={setTheme} />;
      case 'dashboard':
        return <Dashboard onSelectRelease={handleSelectRelease} onNewRelease={() => setIsModalOpen(true)} showStats={true} />;
      case 'releases':
        return <Dashboard onSelectRelease={handleSelectRelease} onNewRelease={() => setIsModalOpen(true)} showStats={false} />;
      default:
        return <Dashboard onSelectRelease={handleSelectRelease} onNewRelease={() => setIsModalOpen(true)} showStats={true} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col relative overflow-hidden lg:overflow-visible pt-16 lg:pt-0`}>
      <Navbar 
        onNewRelease={() => setIsModalOpen(true)} 
        selectedReleaseId={selectedReleaseId}
        onBack={() => {
          setSelectedReleaseId(null);
          setCurrentView('dashboard');
        }}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
        userProfile={userProfile}
      />
      
      <div className="flex flex-1 pt-0 lg:pt-16 h-full">
        <Sidebar 
          selectedReleaseId={selectedReleaseId} 
          onBack={() => {
            setSelectedReleaseId(null);
            setCurrentView('dashboard');
          }}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          currentView={currentView}
          setCurrentView={setCurrentView}
          userProfile={userProfile}
          setUserProfile={setUserProfile}
        />

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 w-full pb-20 lg:pb-0 h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden relative">
          {renderContent()}
        </main>
      </div>

      {!selectedReleaseId && <BottomNav currentView={currentView} setCurrentView={setCurrentView} />}

      {isModalOpen && (
        <CreateReleaseModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={(id) => {
            setIsModalOpen(false);
            setSelectedReleaseId(id);
            setCurrentView('releases');
          }} 
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
