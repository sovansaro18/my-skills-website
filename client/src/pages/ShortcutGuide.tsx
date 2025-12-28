import React, { useState } from 'react';
import { Command, Keyboard, X, Search, FileText, Table, Presentation, Monitor } from 'lucide-react';

const SHORTCUTS = [
  // General Shortcuts
  { keys: 'Ctrl + C', desc: 'ចម្លង (Copy)', app: 'General' },
  { keys: 'Ctrl + V', desc: 'បិទភ្ជាប់ (Paste)', app: 'General' },
  { keys: 'Ctrl + X', desc: 'កាត់ (Cut)', app: 'General' },
  { keys: 'Ctrl + Z', desc: 'ត្រឡប់ក្រោយ (Undo)', app: 'General' },
  { keys: 'Ctrl + Y', desc: 'ទៅមុខវិញ (Redo)', app: 'General' },
  { keys: 'Ctrl + S', desc: 'រក្សាទុក (Save)', app: 'General' },
  { keys: 'Ctrl + P', desc: 'បោះពុម្ព (Print)', app: 'General' },
  { keys: 'Ctrl + N', desc: 'បង្កើតថ្មី (New)', app: 'General' },
  { keys: 'Ctrl + O', desc: 'បើកឯកសារ (Open)', app: 'General' },
  { keys: 'Ctrl + A', desc: 'ជ្រើសរើសទាំងអស់ (Select All)', app: 'General' },
  { keys: 'Ctrl + F', desc: 'ស្វែងរក (Find)', app: 'General' },
  { keys: 'Ctrl + H', desc: 'ជំនួស (Replace)', app: 'General' },
  { keys: 'Ctrl + W', desc: 'បិទបង្អួច (Close Window)', app: 'General' },
  { keys: 'Alt + F4', desc: 'បិទកម្មវិធី (Close Program)', app: 'General' },
  { keys: 'F1', desc: 'ជំនួយ (Help)', app: 'General' },
  { keys: 'F2', desc: 'ប្តូរឈ្មោះ (Rename)', app: 'General' },
  { keys: 'Windows + D', desc: 'បង្ហាញ Desktop', app: 'General' },
  { keys: 'Alt + Tab', desc: 'ប្តូរកម្មវិធី (Switch Apps)', app: 'General' },
  { keys: 'Ctrl + Shift + Esc', desc: 'បើក Task Manager', app: 'General' },
  { keys: 'Windows + L', desc: 'ចាក់សោអេក្រង់ (Lock Screen)', app: 'General' },

  // Microsoft Word Shortcuts
  { keys: 'Ctrl + B', desc: 'ធ្វើឱ្យអក្សរដិត (Bold)', app: 'Word' },
  { keys: 'Ctrl + I', desc: 'ធ្វើឱ្យអក្សរទ្រេត (Italic)', app: 'Word' },
  { keys: 'Ctrl + U', desc: 'គូសបន្ទាត់ក្រោម (Underline)', app: 'Word' },
  { keys: 'Ctrl + E', desc: 'តម្រឹមកណ្តាល (Center)', app: 'Word' },
  { keys: 'Ctrl + L', desc: 'តម្រឹមឆ្វេង (Align Left)', app: 'Word' },
  { keys: 'Ctrl + R', desc: 'តម្រឹមស្តាំ (Align Right)', app: 'Word' },
  { keys: 'Ctrl + J', desc: 'តម្រឹមពេញ (Justify)', app: 'Word' },
  { keys: 'F12', desc: 'រក្សាទុកជា (Save As)', app: 'Word' },
  { keys: 'Ctrl + K', desc: 'បញ្ចូល Link (Hyperlink)', app: 'Word' },
  { keys: 'Ctrl + 1', desc: 'គម្លាតបន្ទាត់ 1.0 (Single)', app: 'Word' },
  { keys: 'Ctrl + 2', desc: 'គម្លាតបន្ទាត់ 2.0 (Double)', app: 'Word' },
  { keys: 'Ctrl + 5', desc: 'គម្លាតបន្ទាត់ 1.5 (1.5 Lines)', app: 'Word' },
  { keys: 'Ctrl + Shift + >', desc: 'ពង្រីកទំហំអក្សរ (Increase Font Size)', app: 'Word' },
  { keys: 'Ctrl + Shift + <', desc: 'បង្រួមទំហំអក្សរ (Decrease Font Size)', app: 'Word' },
  { keys: 'Ctrl + Enter', desc: 'បំបែកទំព័រ (Page Break)', app: 'Word' },

  // Microsoft Excel Shortcuts
  { keys: 'Alt + =', desc: 'បូកសរុបស្វ័យប្រវត្តិ (AutoSum)', app: 'Excel' },
  { keys: 'Ctrl + ;', desc: 'បញ្ចូលកាលបរិច្ឆេទបច្ចុប្បន្ន', app: 'Excel' },
  { keys: 'Ctrl + Shift + :', desc: 'បញ្ចូលម៉ោងបច្ចុប្បន្ន', app: 'Excel' },
  { keys: 'F2', desc: 'កែសម្រួលក្រឡា (Edit Cell)', app: 'Excel' },
  { keys: 'F4', desc: 'ធ្វើម្តងទៀត (Repeat Last Action)', app: 'Excel' },
  { keys: 'Ctrl + 1', desc: 'បើក Format Cells', app: 'Excel' },
  { keys: 'Ctrl + G', desc: 'ទៅកាន់ (Go To)', app: 'Excel' },
  { keys: 'Ctrl + Shift + L', desc: 'បើក/បិទ Filter', app: 'Excel' },
  { keys: 'Ctrl + Space', desc: 'ជ្រើសរើសជួរឈរ (Select Column)', app: 'Excel' },
  { keys: 'Shift + Space', desc: 'ជ្រើសរើសជួរដេក (Select Row)', app: 'Excel' },
  { keys: 'Ctrl + D', desc: 'ចម្លងពីលើ (Fill Down)', app: 'Excel' },
  { keys: 'Ctrl + R', desc: 'ចម្លងពីឆ្វេង (Fill Right)', app: 'Excel' },
  { keys: 'Ctrl + Z', desc: 'ត្រឡប់ក្រោយ (Undo)', app: 'Excel' },
  { keys: 'Ctrl + Y', desc: 'ទៅមុខវិញ (Redo)', app: 'Excel' },

  // Microsoft PowerPoint Shortcuts
  { keys: 'F5', desc: 'ចាប់ផ្តើម Slide Show', app: 'PowerPoint' },
  { keys: 'Shift + F5', desc: 'Slide Show ពីទំព័របច្ចុប្បន្ន', app: 'PowerPoint' },
  { keys: 'Ctrl + M', desc: 'បង្កើត Slide ថ្មី (New Slide)', app: 'PowerPoint' },
  { keys: 'Ctrl + D', desc: 'ចម្លង Slide/វត្ថុ (Duplicate)', app: 'PowerPoint' },
  { keys: 'Esc', desc: 'បញ្ចប់ Slide Show', app: 'PowerPoint' },
  { keys: 'Ctrl + G', desc: 'ដាក់ជាក្រុម (Group Objects)', app: 'PowerPoint' },
  { keys: 'Ctrl + Shift + G', desc: 'បំបែកក្រុម (Ungroup Objects)', app: 'PowerPoint' },
  { keys: 'Ctrl + T', desc: 'បើក Font Dialog', app: 'PowerPoint' },
  { keys: 'Ctrl + B', desc: 'ធ្វើឱ្យអក្សរដិត (Bold)', app: 'PowerPoint' },
  { keys: 'Ctrl + I', desc: 'ធ្វើឱ្យអក្សរទ្រេត (Italic)', app: 'PowerPoint' },
  { keys: 'Ctrl + U', desc: 'គូសបន្ទាត់ក្រោម (Underline)', app: 'PowerPoint' },
];

interface ShortcutGuideProps {
  onExit: () => void;
}

const ShortcutGuide: React.FC<ShortcutGuideProps> = ({ onExit }) => {
  const [filter, setFilter] = useState<'All' | 'General' | 'Word' | 'Excel' | 'PowerPoint'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShortcuts = SHORTCUTS.filter(s => {
    const matchesFilter = filter === 'All' || s.app === filter;
    const matchesSearch = s.desc.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.keys.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Revert to simple text style badge
  const renderKeys = (keyString: string) => {
    return (
      <span className="font-mono font-bold text-slate-700 dark:text-slate-200 text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm whitespace-nowrap">
        {keyString}
      </span>
    );
  };

  const getAppIcon = (app: string) => {
    switch(app) {
      case 'Word': return <FileText size={14} className="text-blue-600 dark:text-blue-400" />;
      case 'Excel': return <Table size={14} className="text-green-600 dark:text-green-400" />;
      case 'PowerPoint': return <Presentation size={14} className="text-orange-600 dark:text-orange-400" />;
      default: return <Monitor size={14} className="text-slate-600 dark:text-slate-400" />;
    }
  };

  const tabs = [
    { id: 'All', label: 'ទាំងអស់', icon: Command },
    { id: 'General', label: 'ទូទៅ', icon: Monitor },
    { id: 'Word', label: 'Word', icon: FileText },
    { id: 'Excel', label: 'Excel', icon: Table },
    { id: 'PowerPoint', label: 'PowerPoint', icon: Presentation },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10 h-full flex flex-col">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
         <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-khmer">
               <span className="bg-brand-100 dark:bg-brand-900/30 p-2 rounded-xl text-brand-600 dark:text-brand-400"><Keyboard size={24} /></span>
                Shortcut Keys ដែលនិយមប្រើ៖
            </h2>
         </div>
         
         <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="ស្វែងរក (ឧ. Copy, Save...)" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-khmer text-sm bg-white dark:bg-slate-800 dark:text-white shadow-sm"
                />
            </div>
            <button onClick={onExit} className="p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors bg-white dark:bg-slate-800 shadow-sm">
                <X size={20} />
            </button>
         </div>
      </div>

      {/* Modern Tab Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex gap-6 overflow-x-auto pb-1 scrollbar-hide">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id as any)}
                    className={`flex items-center gap-2 pb-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 px-1
                        ${filter === tab.id 
                            ? 'border-brand-600 dark:border-brand-400 text-brand-600 dark:text-brand-400' 
                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'}
                    `}
                >
                    <tab.icon size={16} />
                    <span className="font-khmer">{tab.label}</span>
                </button>
            ))}
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex-1 flex flex-col transition-colors">
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-sm">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-khmer w-[35%] border-b border-slate-200 dark:border-slate-700">
                    គ្រាប់ចុច (Command)
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-khmer border-b border-slate-200 dark:border-slate-700">
                    បរិយាយ (Description)
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-khmer text-right border-b border-slate-200 dark:border-slate-700">
                    កម្មវិធី (App)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredShortcuts.map((shortcut, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                  <td className="px-6 py-4">
                     {renderKeys(shortcut.keys)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-700 dark:text-slate-300 font-khmer font-medium text-sm leading-relaxed block group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                        {shortcut.desc}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 group-hover:border-brand-200 dark:group-hover:border-brand-600 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 transition-colors">
                        {getAppIcon(shortcut.app)}
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-brand-700 dark:group-hover:text-brand-300">{shortcut.app}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredShortcuts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-500">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full mb-3 shadow-inner">
                    <Search size={32} className="opacity-40" />
                </div>
                <p className="font-khmer text-sm">រកមិនឃើញ Shortcut នេះទេ។</p>
                <button 
                    onClick={() => {setSearchQuery(''); setFilter('All');}}
                    className="mt-4 text-brand-600 dark:text-brand-400 text-sm font-bold hover:underline font-khmer"
                >
                    បង្ហាញទាំងអស់វិញ
                </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center text-xs text-slate-400 font-khmer mt-2 shrink-0">
         គន្លឹះ៖ ប្រើប្រាស់ <span className="font-bold border px-1 rounded bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm text-slate-600 dark:text-slate-300">Ctrl</span> + <span className="font-bold border px-1 rounded bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm text-slate-600 dark:text-slate-300">F</span> ដើម្បីស្វែងរកក្នុងតារាងនេះ
      </div>
    </div>
  );
};

export default ShortcutGuide;