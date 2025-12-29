import React, { useState } from 'react';
import { 
  Users, BookOpen, Bell, LayoutDashboard, 
  Search, Plus, MoreVertical, Trash2, Edit 
} from 'lucide-react';

import AdminNotificationSender from './AdminNotificationSender'; 
import CourseCreateForm from './CourseCreateForm';
import AdminCourseList from './AdminCourseList';

const OverviewTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 font-khmer">អ្នកប្រើប្រាស់សរុប</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">1,234</h3>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
          <Users size={24} />
        </div>
      </div>
    </div>

    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 font-khmer">វគ្គសិក្សាសរុប</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">12</h3>
        </div>
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
          <BookOpen size={24} />
        </div>
      </div>
    </div>

    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 font-khmer">ការជូនដំណឹងថ្មី</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">5</h3>
        </div>
        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
          <Bell size={24} />
        </div>
      </div>
    </div>
  </div>
);

const UsersTab = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
      <Users size={32} className="text-blue-600 dark:text-blue-400" />
    </div>
    <h3 className="text-lg font-bold text-slate-800 dark:text-white font-khmer mb-2">គ្រប់គ្រងអ្នកប្រើប្រាស់</h3>
    <p className="text-slate-500 dark:text-slate-400 font-khmer">មុខងារនេះនឹងមកដល់ឆាប់ៗ...</p>
  </div>
);

const CoursesTab = () => (
  <div className="max-w-3xl mx-auto">
    <CourseCreateForm />
    <AdminCourseList />
  </div>
);

const NotificationsTab = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
    <AdminNotificationSender />
  </div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'notifications'>('overview');

  const menuItems = [
    { id: 'overview', label: 'ទិដ្ឋភាពទូទៅ', icon: LayoutDashboard },
    { id: 'users', label: 'អ្នកប្រើប្រាស់', icon: Users },
    { id: 'courses', label: 'វគ្គសិក្សា', icon: BookOpen },
    { id: 'notifications', label: 'ការជូនដំណឹង', icon: Bell },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950">
      
      <div className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0">
        <div className="p-4">
          <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 font-khmer px-2">
            Admin Menu
          </h2>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm font-khmer
                  ${activeTab === item.id 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}
                `}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-khmer">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-khmer mt-1">
              គ្រប់គ្រងប្រព័ន្ធរៀន MY SKILLS
            </p>
          </div>

          <div className="animate-fade-in">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'courses' && <CoursesTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;