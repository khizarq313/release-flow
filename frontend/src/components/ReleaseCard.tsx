import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';
import { useMutation } from '@apollo/client';
import { DELETE_RELEASE } from '../graphql/mutations';
import { GET_RELEASES } from '../graphql/queries';
import { useToast } from './Toast';

interface Release {
  id: string;
  name: string;
  date: string;
  status: string;
  steps: boolean[];
}

interface ReleaseCardProps {
  release: Release;
  onClick: (id: string) => void;
}

const ReleaseCard: React.FC<ReleaseCardProps> = ({ release, onClick }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { showToast } = useToast();
  
  const [deleteRelease] = useMutation(DELETE_RELEASE, {
    variables: { id: release.id },
    refetchQueries: [{ query: GET_RELEASES }],
    onCompleted: () => showToast({ message: 'Release deleted' }),
    onError: () => showToast({ message: 'Error deleting', type: 'error' })
  });
  
  const completedCount = release.steps ? release.steps.filter(Boolean).length : 0;
  
  const handleDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteRelease();
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(false);
  };

  return (
    <div 
      onClick={() => onClick(release.id)}
      className="relative bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer shadow-sm group"
    >
      <div className="absolute top-4 right-4" onMouseLeave={() => setShowConfirm(false)}>
        {showConfirm ? (
          <div className="flex items-center gap-2 text-xs bg-white dark:bg-slate-800 rounded px-2 py-1 shadow border border-slate-200 dark:border-slate-700 mt-[-4px]">
            <span className="text-slate-500 dark:text-slate-400">Delete?</span>
            <button onClick={handleConfirmDelete} className="text-red-500 dark:text-red-400 hover:underline">Yes</button>
            <button onClick={handleCancelDelete} className="text-slate-500 dark:text-slate-400 hover:underline">Cancel</button>
          </div>
        ) : (
          <button onClick={handleDeleteClick} className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        )}
      </div>

      <div className="mb-2">
        <StatusBadge status={release.status} />
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{release.name}</h3>
      <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-widest">
        {handleDate(release.date)}
      </p>

      <div className="mt-6">
        <ProgressBar completed={completedCount} total={9} />
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 group-hover:underline cursor-pointer">
          View Details
        </span>
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 border-2 border-white dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-100">
            <span className="text-[10px] font-bold">DO</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 border-2 border-white dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-100">
            <span className="text-[10px] font-bold">QE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReleaseCard;
