import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminNotificationSender from '../AdminNotificationSender'; // ផ្លាស់ប្តូរតាមទីតាំងជាក់ស្តែងរបស់បង
import { ArrowLeft } from 'lucide-react';

interface AdminPageProps {
  onExit: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onExit }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* ប៊ូតុងត្រឡប់ក្រោយ */}
        <button 
          onClick={onExit}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors font-khmer"
        >
          <ArrowLeft size={20} />
          ត្រឡប់ក្រោយ
        </button>

        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white font-khmer mb-2">
                កន្លែងគ្រប់គ្រង (Admin Dashboard)
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-khmer">
                សួស្តី {user?.name}!
            </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6">
                <AdminNotificationSender />
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;