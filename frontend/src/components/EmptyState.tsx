import React from 'react';

interface EmptyStateProps {
  onNewRelease: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onNewRelease }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center w-full">
      <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">rocket_launch</span>
      <h2 className="text-xl font-bold text-slate-700 dark:text-slate-400">No releases yet</h2>
      <p className="text-sm text-slate-500 mt-2">Create your first release to get started.</p>
      
      <button 
        onClick={onNewRelease}
        className="mt-6 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md hover:scale-[0.98] active:scale-[0.95] transition-all"
      >
        + New Release
      </button>
    </div>
  );
};

export default EmptyState;
