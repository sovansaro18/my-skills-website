import React from 'react';
import { Bookmark, PlayCircle, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { AppView } from '../types';

interface SavedLessonsProps {
  onNavigate: (view: AppView) => void;
  onPlayLesson: (courseId: string, moduleId: string, lessonId: string) => void;
}

const SavedLessons: React.FC<SavedLessonsProps> = ({ onNavigate, onPlayLesson }) => {
  const { user } = useAuth();
  const savedList = user?.savedLessons || [];

  if (savedList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <Bookmark size={40} className="text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white font-khmer mb-2">
          មិនទាន់មានមេរៀនរក្សាទុក
        </h2>
        <p className="text-slate-500 font-khmer max-w-sm">
          អ្នកអាចចុចលើសញ្ញា "Save" ឬ "Bookmark" នៅលើមេរៀនដែលអ្នកពេញចិត្ត ដើម្បីមើលនៅពេលក្រោយ។
        </p>
        <button 
          onClick={() => onNavigate(AppView.DASHBOARD)}
          className="mt-6 px-6 py-2.5 bg-brand-600 text-white rounded-xl font-khmer font-medium hover:bg-brand-700 transition"
        >
          ស្វែងរកមេរៀន
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in space-y-6 pb-10">
      <div className="flex items-center gap-3 py-4 border-b border-slate-200 dark:border-slate-800">
        <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 dark:text-orange-400">
            <Bookmark size={24} />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-khmer">មេរៀនដែលបានរក្សាទុក</h1>
            <p className="text-slate-500 text-sm font-khmer">{savedList.length} មេរៀន</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {savedList.map((item: any, index: number) => (
          <div 
            key={index}
            className="group bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md transition-all cursor-pointer flex items-center gap-4"
            onClick={() => onPlayLesson(item.courseId, item.moduleId, item.lessonId)}
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 transition-colors">
                <PlayCircle size={24} className="text-slate-500 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400" />
            </div>
            
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 dark:text-white font-khmer truncate group-hover:text-brand-600 transition-colors">
                    {item.title || 'មេរៀនមិនស្គាល់ឈ្មោះ'}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-mono">
                   <Clock size={12} />
                   <span>Saved: {new Date(item.savedAt).toLocaleDateString('km-KH')}</span>
                </div>
            </div>

            <div className="text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all">
                <ArrowRight size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedLessons;