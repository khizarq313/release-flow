import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_RELEASE } from '../graphql/mutations';
import { GET_RELEASES } from '../graphql/queries';
import { useToast } from './Toast';

interface CreateReleaseModalProps {
  onClose: () => void;
  onSuccess: (id: string) => void;
}

const CreateReleaseModal: React.FC<CreateReleaseModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [info, setInfo] = useState('');
  const [errors, setErrors] = useState<{name?: string, date?: string}>({});
  const { showToast } = useToast();

  const [createRelease, { loading }] = useMutation(CREATE_RELEASE, {
    refetchQueries: [{ query: GET_RELEASES }],
    onCompleted: (data) => {
      showToast({ message: 'Release created' });
      onSuccess(data.createRelease.id);
    },
    onError: () => {
      showToast({ message: 'Error creating', type: 'error' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrs: {name?: string, date?: string} = {};
    if (!name.trim()) newErrs.name = 'Release name is required.';
    if (!date) newErrs.date = 'Release date is required.';
    
    if (Object.keys(newErrs).length > 0) {
      setErrors(newErrs);
      return;
    }

    createRelease({
      variables: {
        name,
        date: new Date(date).toISOString(),
        additionalInfo: info || null
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-xl shadow-2xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.70)] overflow-hidden animate-[fade-in_0.3s_ease-out] flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-none">
        <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-3 sm:pb-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Create New Release</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="overflow-y-auto overflow-x-hidden flex-1">
          <form onSubmit={handleSubmit} className="px-5 sm:px-8 py-5 sm:py-6 space-y-5 sm:space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">RELEASE NAME</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base"
                placeholder="e.g. Q4 Performance Update"
              />
              {errors.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1 font-medium">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">RELEASE DATE</label>
              <input 
                type="date" 
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-sm sm:text-base [color-scheme:light] dark:[color-scheme:dark]"
              />
              {errors.date && <p className="text-red-500 dark:text-red-400 text-xs mt-1 font-medium">{errors.date}</p>}
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">ADDITIONAL INFORMATION</label>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest italic">Optional</span>
              </div>
              <textarea 
                rows={3}
                value={info}
                onChange={e => setInfo(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base"
                placeholder="Provide deployment context or risk assessment..."
              />
            </div>

            <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors active:scale-95 duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Release'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateReleaseModal;
