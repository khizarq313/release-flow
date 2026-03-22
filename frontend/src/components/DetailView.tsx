import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_RELEASE_DETAIL } from '../graphql/queries';
import { UPDATE_STEPS, UPDATE_ADDITIONAL_INFO } from '../graphql/mutations';
import StepItem, { FIXED_STEPS } from './StepItem';
import { useToast } from './Toast';

interface DetailViewProps {
  id: string;
  onBack: () => void;
}

const DetailView: React.FC<DetailViewProps> = ({ id, onBack }) => {
  const { data, loading, error } = useQuery(GET_RELEASE_DETAIL, { variables: { id }, pollInterval: 5000 });
  const [updateSteps, { loading: updatingSteps }] = useMutation(UPDATE_STEPS);
  const [updateInfo, { loading: updatingInfo }] = useMutation(UPDATE_ADDITIONAL_INFO);
  const { showToast } = useToast();

  const [localInfo, setLocalInfo] = useState('');

  useEffect(() => {
    if (data?.release) {
      setLocalInfo(data.release.additionalInfo || '');
    }
  }, [data]);

  if (loading && !data) return <div className="flex justify-center mt-20"><span className="material-symbols-outlined animate-spin text-4xl text-indigo-500">progress_activity</span></div>;
  if (error || !data?.release) return <div className="text-red-400 m-10">Error loading release details.</div>;

  const release = data.release;
  const completedCount = release.steps.filter(Boolean).length;
  const percentage = Math.round((completedCount / 9) * 100);
  const allComplete = completedCount === 9;

  const handleToggleStep = async (index: number) => {
    const newSteps = [...release.steps];
    newSteps[index] = !newSteps[index];

    try {
      await updateSteps({
        variables: { id, steps: newSteps },
        optimisticResponse: {
          updateSteps: {
            ...release,
            steps: newSteps,
            status: newSteps.filter(Boolean).length === 9 ? 'done' : 
                   newSteps.filter(Boolean).length === 0 ? 'planned' : 'ongoing'
          }
        }
      });
    } catch (e) {
      showToast({ message: 'Error updating step', type: 'error' });
    }
  };

  const handleInfoSave = async () => {
    try {
      await updateInfo({ variables: { id, additionalInfo: localInfo } });
      showToast({ message: 'Saved ✓' });
    } catch (e) {
      showToast({ message: 'Error saving', type: 'error' });
    }
  };  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full animate-[fade-in_0.3s_ease-out]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-8 lg:order-1 order-2">
          
          {/* Release Health Card */}
          <div className="bg-white dark:bg-surface-container-lowest border border-slate-200 dark:border-outline-variant/20 rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="flex justify-between mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Release Health</span>
              <span className="material-symbols-outlined text-indigo-500 dark:text-indigo-400">monitoring</span>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600 dark:text-slate-400">Progress</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{percentage}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-surface-container-high h-3 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-indigo-400 dark:from-indigo-600 dark:to-indigo-500 h-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 dark:bg-surface-container-low p-4 rounded-xl border border-slate-200 dark:border-outline-variant/10">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Created</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{new Date(release.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="bg-slate-50 dark:bg-surface-container-low p-4 rounded-xl border border-slate-200 dark:border-outline-variant/10">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Target</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{new Date(release.date).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="bg-white dark:bg-surface-container-lowest border border-slate-200 dark:border-outline-variant/20 rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="flex justify-between mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Additional Info</span>
              <span className="material-symbols-outlined text-slate-400">edit_note</span>
            </div>
            <textarea
              value={localInfo}
              onChange={(e) => setLocalInfo(e.target.value)}
              onBlur={handleInfoSave}
              className="w-full min-h-[180px] p-4 text-sm bg-slate-50 dark:bg-surface-container-low border border-slate-200 dark:border-outline-variant/20 rounded-xl focus:ring-2 focus:ring-indigo-500/50 text-slate-900 dark:text-on-surface resize-none placeholder:text-slate-400 dark:placeholder:text-on-surface-variant/40 outline-none"
              placeholder="Enter release specific notes, environment details..."
            />
            <button 
              onClick={handleInfoSave}
              disabled={updatingInfo}
              className="mt-4 w-full bg-slate-900 dark:bg-on-surface text-white dark:text-slate-950 py-3 rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all"
            >
              {updatingInfo ? 'Saving...' : 'Save Updates'}
            </button>
          </div>

          {/* Context Metadata Card */}
          <div className="bg-slate-50 dark:bg-surface-container-low/50 p-6 rounded-xl border border-slate-200 dark:border-outline-variant/10">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">Repository Context</div>
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-slate-400 text-sm">commit</span>
              <span className="font-mono text-xs bg-white dark:bg-surface-container-highest px-2 py-1 rounded border border-slate-200 dark:border-outline-variant/20 text-slate-600 dark:text-slate-300">
                HEAD: abc1234
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-400 text-sm">segment</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">main</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 lg:order-2 order-1">
          <div className="flex justify-between items-center mb-6 sm:mb-8 px-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-on-surface tracking-tight">Milestone Checklist</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Complete all mandatory steps to authorize production deployment.</p>
            </div>
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/20 rounded-full border border-indigo-200 dark:border-indigo-500/30 whitespace-nowrap hidden sm:block">
              9 STEPS TOTAL
            </div>
          </div>

          <div className="space-y-4">
            {FIXED_STEPS.map((step, index) => {
              const isCompleted = release.steps[index];
              const isActive = !isCompleted && (index === 0 || release.steps[index - 1]);
              const isLocked = !isCompleted && !isActive;

              return (
                <StepItem
                  key={index}
                  index={index}
                  step={step}
                  isCompleted={isCompleted}
                  isActive={isActive}
                  isLocked={isLocked}
                  onToggle={() => handleToggleStep(index)}
                  loading={updatingSteps}
                />
              );
            })}
          </div>

          {/* Deploy Footer */}
          <div className="mt-8 sm:mt-12 p-6 sm:p-8 bg-indigo-50 dark:bg-gradient-to-br dark:from-indigo-900/20 dark:to-slate-950/40 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.1)_0%,transparent_70%)] pointer-events-none" />
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Ready to Launch?</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                {allComplete 
                  ? "All steps completed. Production deployment is authorized." 
                  : "Please complete remaining steps to enable the 'Deploy' button."}
              </p>
            </div>
            <button 
              disabled={!allComplete}
              className={`relative z-10 px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all whitespace-nowrap ${
                allComplete 
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-400 dark:from-indigo-600 dark:to-indigo-500 text-white shadow-lg shadow-indigo-500/40 dark:shadow-indigo-900/40 hover:scale-[1.02] active:scale-95' 
                  : 'bg-slate-200 dark:bg-on-surface/5 text-slate-400 dark:text-on-surface/30 border border-slate-300 dark:border-on-surface/10 cursor-not-allowed'
              }`}
            >
              Deploy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
