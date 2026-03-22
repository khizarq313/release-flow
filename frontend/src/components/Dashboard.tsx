import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_RELEASES } from '../graphql/queries';
import ReleaseCard from './ReleaseCard';
import EmptyState from './EmptyState';

interface DashboardProps {
  onSelectRelease: (id: string) => void;
  onNewRelease: () => void;
  showStats?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectRelease, onNewRelease, showStats = true }) => {
  const { data, loading, error } = useQuery(GET_RELEASES, { pollInterval: 5000 });

  if (loading) return <div className="flex justify-center items-center h-[60vh]"><span className="material-symbols-outlined animate-spin text-4xl text-indigo-500">progress_activity</span></div>;
  if (error) return <div className="text-red-500 dark:text-red-400 text-center m-10">Error loading releases</div>;

  const releases = data?.releases || [];

  return (
    <div className="pt-6 pb-20 lg:pb-12 px-4 sm:px-6 lg:px-12 max-w-[1100px] mx-auto w-full animate-[fade-in_0.3s_ease-out]">
      {releases.length === 0 ? (
        <EmptyState onNewRelease={onNewRelease} />
      ) : (
        <>
          {showStats && (
            <>
              <div className="mb-8 font-sans">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">Dashboard Overview</h1>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium mt-2">Manage your deployment lifecycles and track release health.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">Total Releases</span>
                    <span className="material-symbols-outlined text-indigo-500 text-xl">rocket_launch</span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mt-2 sm:mt-3 group-hover:scale-105 transition-transform origin-left">{releases.length + 120}</span>
                  <span className="text-[10px] sm:text-xs text-green-500 font-medium mt-1 sm:mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">trending_up</span>+12%</span>
                </div>
                
                <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">Success Rate</span>
                    <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mt-2 sm:mt-3 group-hover:scale-105 transition-transform origin-left">98.5%</span>
                  <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 sm:mt-2">Last 30 days</span>
                </div>

                <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors sm:col-span-2 lg:col-span-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">Avg Lead Time</span>
                    <span className="material-symbols-outlined text-orange-500 text-xl">timer</span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mt-2 sm:mt-3 group-hover:scale-105 transition-transform origin-left">4.2d</span>
                  <span className="text-[10px] sm:text-xs text-green-500 font-medium mt-1 sm:mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">trending_down</span>-1.1d</span>
                </div>
              </div>
            </>
          )}

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{showStats ? 'Active Deployments' : 'All Releases'}</h2>
              {!showStats && <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">View and manage all historical and planned releases.</p>}
            </div>
            {!showStats && (
              <button 
                onClick={onNewRelease}
                className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md shadow-indigo-600/20"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                New
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {releases.map((release: any) => (
              <ReleaseCard key={release.id} release={release} onClick={onSelectRelease} />
            ))}
          </div>
        </>
      )}
      
      <button 
        onClick={onNewRelease}
        className="lg:hidden fixed bottom-20 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-2xl shadow-indigo-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
    </div>
  );
};

export default Dashboard;
