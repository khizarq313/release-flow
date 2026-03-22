import React from 'react';

export interface StepDef {
  title: string;
  description: string;
}

export const FIXED_STEPS: StepDef[] = [
  { title: "Code Freeze", description: "Lock the repository for new features." },
  { title: "Run Full Test Suite", description: "Execute unit, integration, and E2E tests." },
  { title: "QA Sign-Off", description: "Manual approval from the Quality Engineering lead." },
  { title: "Security Scan", description: "Static analysis and dependency vulnerability audit." },
  { title: "Performance Validation", description: "Verify response times under peak load simulation." },
  { title: "Deploy to Staging", description: "Push build artifacts to the staging environment." },
  { title: "Stakeholder Approval", description: "Executive and product sign-off for production." },
  { title: "Release Notes Published", description: "Draft and publish changelog for this version." },
  { title: "Production Deployment", description: "Execute final pipeline to all global regions." }
];

interface StepItemProps {
  step: StepDef;
  index: number;
  isCompleted: boolean;
  isActive: boolean;
  isLocked: boolean;
  onToggle: () => void;
  loading: boolean;
}

const StepItem: React.FC<StepItemProps> = ({ step, index, isCompleted, isActive, isLocked, onToggle, loading }) => {
  if (isCompleted) {
    return (
      <div 
        onClick={() => !loading && onToggle()}
        className="bg-white dark:bg-surface-container-lowest border border-slate-200 dark:border-outline-variant/10 rounded-xl p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-surface-container-low transition-all duration-200 shadow-sm flex items-center gap-4 sm:gap-6 cursor-pointer"
      >
        <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-surface-container text-indigo-600 dark:text-primary flex items-center justify-center border-2 border-indigo-200 dark:border-outline-variant">
          <span className="material-symbols-outlined filled text-sm">check</span>
        </div>
        <div className="flex-grow min-w-0">
          <h4 className="text-base sm:text-lg font-bold text-slate-400 dark:text-on-surface/40 line-through decoration-indigo-600/40 dark:decoration-primary/40 truncate">{index + 1}. {step.title}</h4>
          <p className="text-xs text-slate-400 dark:text-on-surface-variant/60 truncate">{step.description}</p>
        </div>
        <div className="hidden md:flex flex-col items-center gap-1 shrink-0">
          <span className="material-symbols-outlined text-sm text-indigo-600 dark:text-indigo-400">check_circle</span>
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">COMPLETED</span>
        </div>
      </div>
    );
  }

  if (isActive) {
    return (
      <div 
        onClick={() => !loading && onToggle()}
        className="relative bg-white dark:bg-surface-container border-2 border-indigo-600 rounded-xl p-4 sm:p-6 hover:scale-[1.01] transition-transform duration-200 shadow-lg shadow-indigo-600/5 dark:shadow-indigo-500/10 flex items-center gap-4 sm:gap-6 cursor-pointer overflow-hidden"
      >
        <div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600" />
        <div className="w-7 h-7 rounded-lg border-2 border-slate-300 dark:border-outline-variant flex items-center justify-center relative z-10 bg-white dark:bg-transparent">
          {/* Unchecked */}
        </div>
        <div className="flex-grow relative z-10 min-w-0">
          <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-on-surface truncate">{index + 1}. {step.title}</h4>
          <p className="text-xs text-slate-500 dark:text-on-surface-variant/60 truncate">{step.description}</p>
        </div>
        <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-200 dark:border-indigo-500/30 relative z-10 shrink-0">
          Pending
        </div>
      </div>
    );
  }

  // LOCKED
  return (
    <div className="bg-slate-50 dark:bg-surface-container-lowest border border-slate-200 dark:border-outline-variant/10 rounded-xl p-4 sm:p-6 opacity-60 dark:opacity-50 flex items-center gap-4 sm:gap-6">
      <div className="w-7 h-7 rounded-lg border-2 border-slate-200 dark:border-outline-variant bg-slate-100 dark:bg-surface-container-high cursor-not-allowed shrink-0" />
      <div className="flex-grow min-w-0">
        <h4 className="text-base sm:text-lg font-bold text-slate-400 dark:text-on-surface/40 truncate">{index + 1}. {step.title}</h4>
        <p className="text-xs text-slate-400 dark:text-on-surface-variant/60 truncate">{step.description}</p>
      </div>
      <div className="hidden md:block shrink-0">
        <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">lock</span>
      </div>
    </div>
  );
};

export default StepItem;
