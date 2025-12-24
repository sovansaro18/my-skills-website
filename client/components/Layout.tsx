import React, { useState, useEffect } from 'react';
import { 
  Menu, Keyboard, Github, Bookmark, Mail, Info, Facebook, 
  ShieldCheck, MessageCircle, Moon, Sun, LayoutDashboard, 
  User, LogOut, LogIn, UserPlus 
} from 'lucide-react';
import { AppView } from '../types';
import { BsFiletypeExe } from 'react-icons/bs';
import { useAuth } from '../components/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth();

  const LOGO_URL = "/assets/MS.png";
  const FALLBACK_AVATAR = "/Avatar.png";
  const userAvatar = user?.avatar || FALLBACK_AVATAR;

  const navItems = [
    { view: AppView.DASHBOARD, label: 'វគ្គសិក្សាទាំងអស់', icon: LayoutDashboard },
    { view: AppView.SAVED, label: 'មេរៀនដែលបានរក្សាទុក', icon: Bookmark, requireAuth: true },
    { view: AppView.EXERCISES, label: 'លំហាត់អនុវត្ត', icon: BsFiletypeExe },
    { view: AppView.SHORTCUTS, label: 'Shortcut Keys', icon: Keyboard },
    { view: AppView.ABOUT, label: 'អំពីយើងខ្ញុំ', icon: Info },
  ];

  const contactLinks = [
    { icon: Github, label: 'GitHub', href: 'https://github.com/sovansaro18', color: 'text-slate-400 hover:text-slate-600 dark:hover:text-white' },
    { icon: MessageCircle, label: 'Telegram', href: 'https://t.me/sovansaro', color: 'text-blue-400 hover:text-blue-500' },
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/sovansaro.v', color: 'text-blue-600 hover:text-blue-700' },
    { icon: Mail, label: 'Email', href: 'mailto:sovansaro.rimravi818@gmail.com', color: 'text-red-400 hover:text-red-500' },
  ];

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false);
    onNavigate(AppView.DASHBOARD);
  };

  const NavItem = ({ icon: Icon, label, isActive, onClick, className = "" }: any) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group font-medium text-sm
        ${isActive 
          ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
        ${className}
      `}
    >
      <Icon size={18} className={`${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-brand-600 dark:group-hover:text-white transition-colors'}`} />
      <span className="font-khmer">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden transition-colors duration-300">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside className={`
          fixed md:static inset-y-0 left-0 z-50 w-[280px] bg-white dark:bg-slate-900 flex flex-col shadow-2xl md:shadow-none border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
      `}>
        <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={LOGO_URL} alt="Logo" className="w-9 h-9 object-contain" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white font-khmer leading-none">MY SKILLS</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-khmer mt-1">សុវណ្ណសរោ រីម រ៉ាវី </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 custom-scrollbar">
          
          <div>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2 font-khmer">ម៉ឺនុយទូទៅ</div>
            <div className="space-y-1">
              {navItems.map((item) => {
                if (item.requireAuth && !user) return null;
                
                return (
                  <NavItem 
                    key={item.label}
                    icon={item.icon} 
                    label={item.label} 
                    isActive={currentView === item.view} 
                    onClick={() => { onNavigate(item.view); setIsSidebarOpen(false); }} 
                  />
                );
              })}

              {user && (
                <NavItem 
                  icon={User} 
                  label="គណនីរបស់ខ្ញុំ" 
                  isActive={currentView === AppView.PROFILE}
                  onClick={() => { onNavigate(AppView.PROFILE); setIsSidebarOpen(false); }} 
                />
              )}
            </div>
          </div>

          {!user && (
            <div>
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2 font-khmer">គណនី</div>
              <div className="space-y-2 p-2">
                <button
                  onClick={() => { onNavigate(AppView.LOGIN); setIsSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200 group font-medium text-sm"
                >
                  <LogIn size={18} className="text-slate-500 dark:text-slate-400" />
                  <span className="font-khmer">ចូលគណនី</span>
                </button>
                <button
                  onClick={() => { onNavigate(AppView.REGISTER); setIsSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition-all duration-200 group font-medium text-sm shadow-md shadow-brand-500/20"
                >
                  <UserPlus size={18} />
                  <span className="font-khmer">ចុះឈ្មោះ</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer (User Info & Theme) */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          {user && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-3 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <img 
                  src={userAvatar} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600 object-cover"
                  onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-white font-khmer truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-khmer text-sm"
              >
                <LogOut size={16} />
                <span>ចាកចេញ</span>
              </button>
            </div>
          )}

          <div className={`${user ? 'mt-3 pt-3 border-t border-slate-200 dark:border-slate-700' : ''}`}>
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-brand-400 transition-colors w-full justify-center font-khmer text-sm"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span>{isDarkMode ? 'ប្តូរទៅភ្លឺ' : 'ប្តូរទៅងងឹត'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white font-khmer tracking-wide">
              {
               currentView === AppView.SHORTCUTS ? 'ឧបករណ៍ជំនួយ' : 
               currentView === AppView.EXERCISES ? 'លំហាត់អនុវត្ត' :
               currentView === AppView.QUIZ ? 'ការប្រឡង' : 
               currentView === AppView.COURSE_DETAIL ? 'ព័ត៌មានវគ្គសិក្សា' : 
               currentView === AppView.LOGIN ? 'ចូលគណនី' :
               currentView === AppView.REGISTER ? 'ចុះឈ្មោះ' : 
               currentView === AppView.SAVED ? 'មេរៀនដែលបានរក្សាទុក' :
               currentView === AppView.ABOUT ? 'អំពីយើងខ្ញុំ' : 
               currentView === AppView.PROFILE ? 'គណនីរបស់ខ្ញុំ' : 'កំពុងសិក្សា'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <a
                href="https://t.me/sovansaro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all border border-blue-200 dark:border-blue-800 shadow-sm"
              >
                <ShieldCheck size={18} />
                <span className="text-sm font-bold font-khmer">Admin</span>
              </a>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onNavigate(AppView.LOGIN)}
                  className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 font-khmer flex items-center gap-1"
                >
                  <LogIn size={14} />
                  <span>ចូលគណនី</span>
                </button>
                <button 
                  onClick={() => onNavigate(AppView.REGISTER)}
                  className="text-sm px-3 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 font-khmer flex items-center gap-1"
                >
                  <UserPlus size={14} />
                  <span>ចុះឈ្មោះ</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto flex flex-col scroll-smooth">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>

          {/* Footer  */}
          {currentView === AppView.DASHBOARD && (
            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 px-6 mt-auto transition-colors">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                      <img src={LOGO_URL} alt="Logo" className="w-6 h-6 object-contain" />
                      <span className="font-bold text-slate-800 dark:text-white text-lg">MY SkillS</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-khmer">រៀនជំនាញកុំព្យូទ័រ សម្រាប់បំពេញការងារទូទៅ។</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">© 2024 Sovansaro. All rights reserved.</p>
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-3">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 font-khmer">ទំនាក់ទំនងពួកយើង</span>
                    <div className="flex items-center gap-3">
                      {contactLinks.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:shadow-md transition-all duration-300 ${link.color}`}
                          title={link.label}
                        >
                          <link.icon size={18} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          )}
        </div>
      </main>
    </div>
  );
};

export default Layout;