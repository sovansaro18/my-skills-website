import React, { useState, useEffect, useRef } from 'react';
import { FileText, Table, Presentation, CheckCircle2, ExternalLink, UploadCloud, User, Calendar, Loader2, Send, AlertCircle, X } from 'lucide-react';
import { BsFiletypeExe } from "react-icons/bs";
import { useAuth } from '../components/contexts/AuthContext';

type Tab = 'Word' | 'Excel' | 'PowerPoint' | 'Upload';
type Difficulty = 'Basic' | 'Intermediate' | 'Advanced';

interface Exercise {
  title: string;
  desc: string;
  level: Difficulty;
}

const EXERCISE_DATA: Record<string, Exercise[]> = {
  Word: [
    { title: 'Exercise 1: ការវាយអត្ថបទ និងការប្រើប្រាស់ Font', desc: 'រៀនកំណត់ពុម្ពអក្សរខ្មែរ និងអង់គ្លេស', level: 'Basic' },
    { title: 'Exercise 2: ការប្រើប្រាស់ Columns និង Drop Cap', desc: 'រចនាអត្ថបទបែបកាសែត និងអក្សរធំដើមអត្ថបទ', level: 'Basic' },
    { title: 'Exercise 3: ការបង្កើតតារាង (Table Design)', desc: 'បង្កើតតារាងវាយតម្លៃការសម្ភាសន៍ការងារ', level: 'Intermediate' },
    { title: 'Exercise 4: លិខិតរដ្ឋបាល (ពាក្យសុំច្បាប់)', desc: 'រចនាលិខិតរដ្ឋបាលផ្លូវការ និង Tab Stops', level: 'Intermediate' },
    { title: 'Exercise 5: វិក្កយបត្រ (Invoice)', desc: 'បង្កើតវិក្កយបត្រដោយប្រើតារាង និងរូបភាព', level: 'Intermediate' },
    { title: 'Exercise 6: គំនូសបំព្រួញ (SmartArt)', desc: 'ប្រើ SmartArt ដើម្បីបង្កើតរចនាសម្ព័ន្ធក្រុមហ៊ុន', level: 'Intermediate' },
    { title: 'Exercise 7: ប្រវត្តិរូបសង្ខេប (CV/Resume)', desc: 'ប្រើ Shapes និង Textbox ដើម្បីបង្កើត CV អាជីព', level: 'Advanced' },
    { title: 'Exercise 8: លិខិតសរសើរ (Certificate)', desc: 'បង្កើតប័ណ្ណសរសើរដោយប្រើស៊ុម និងពណ៌', level: 'Intermediate' },
    { title: 'Exercise 9: លេខទំព័រ (Header & Footer)', desc: 'កំណត់ក្បាលនិងបាតទំព័រសម្រាប់ឯកសារវែង', level: 'Basic' },
    { title: 'Exercise 10: តារាងមាតិកា (Table of Contents)', desc: 'បង្កើតមាតិកាស្វ័យប្រវត្តិ (Automatic TOC)', level: 'Advanced' }
  ],
  Excel: [
    { title: 'Exercise 1: តារាងកាលវិភាគ', desc: 'ប្រើប្រាស់ Week, Date និង Merge Cells', level: 'Basic' },
    { title: 'Exercise 2: តារាងពិន្ទុ (Midterm Exam)', desc: 'ប្រើរូបមន្ត Sum, Average, Rank, Max/Min', level: 'Basic' },
    { title: 'Exercise 3: តារាងបុគ្គលិក', desc: 'អនុវត្ត Data Validation និង COUNTIF/SUMIF', level: 'Intermediate' },
    { title: 'Exercise 4: តារាងប្រាក់បៀវត្សរ៍ (Payroll)', desc: 'អនុវត្ត IF, XLOOKUP និងការគណនាប្រាក់ម៉ោង', level: 'Advanced' },
    { title: 'Exercise 5: គណនាការបញ្ចុះតម្លៃ (Discount)', desc: 'ប្រើប្រាស់រូបមន្ត IFS ដើម្បីគណនា %', level: 'Intermediate' },
    { title: 'Exercise 6: តាមដានផលិតផល (Product Tracking)', desc: 'គណនាថ្ងៃផុតកំណត់ដោយប្រើ IFS & EDATE', level: 'Advanced' },
    { title: 'Exercise 7: Conditional Formatting', desc: 'ដាក់ពណ៌លើផលិតផលជិតផុតកំណត់', level: 'Intermediate' },
    { title: 'Exercise 8: FILTER Function', desc: 'ស្រង់ទិន្នន័យផលិតផល Expired ឬ Nearly Expired', level: 'Advanced' },
    { title: 'Exercise 9: តារាងសិស្ស (VLOOKUP)', desc: 'ប្រើប្រាស់ VLOOKUP ទាញយកទិន្នន័យ Course និង Price', level: 'Intermediate' },
    { title: 'Exercise 10: លំហាត់បញ្ចប់វគ្គ (Comprehensive)', desc: 'គណនាប្រាក់ខែ Commission និងសរុបគ្រប់មុខងារ', level: 'Advanced' }
  ],
  PowerPoint: [
    { title: 'Exercise 1: បង្កើតស្លាយស្វាគមន៍', desc: 'រចនាស្លាយដើមឱ្យមានភាពទាក់ទាញ', level: 'Basic' },
    { title: 'Exercise 2: Slide Master & Themes', desc: 'កំណត់ Background និង Font Styles សម្រាប់គ្រប់ស្លាយ', level: 'Intermediate' },
    { title: 'Exercise 3: Transitions & Animations', desc: 'ដាក់ចលនាឱ្យស្លាយនិងវត្ថុ', level: 'Basic' },
    { title: 'Exercise 4: Morph Transition', desc: 'បង្កើតចលនាបំបែកវត្ថុដោយរលូន', level: 'Advanced' },
    { title: 'Exercise 5: Export Video', desc: 'ការដាក់ Media និង Export ជាវីដេអូ 4K', level: 'Intermediate' }
  ]
};

const TELEGRAM_BOT_TOKEN = '8182910549:AAEpukzpY-HFIDlrCRR5CdaQ2Te_ckq2g40';
const TELEGRAM_CHAT_ID = '8399209514';

interface ExerciseLibraryProps {
  onExit: () => void;
}

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Word');
  const { user } = useAuth(); 

  // Upload Form State
  const [targetCourse, setTargetCourse] = useState('Word');
  const [selectedExerciseTitle, setSelectedExerciseTitle] = useState('');
  const [studentName, setStudentName] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fileError, setFileError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setStudentName(user.name);
    }
  }, [user]);

  const tabs = [
    { id: 'Word', label: 'Microsoft Word', icon: FileText, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
    { id: 'Excel', label: 'Microsoft Excel', icon: Table, color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
    { id: 'PowerPoint', label: 'Microsoft PowerPoint', icon: Presentation, color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
    { id: 'Upload', label: 'ផ្ញើលំហាត់ (Upload)', icon: Send, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' },
  ];

  const getLevelColor = (level: Difficulty) => {
    switch (level) {
      case 'Basic': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermediate': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Advanced': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setFileError('ឯកសារធំពេក! សូមបញ្ចូលឯកសារដែលមានទំហំក្រោម 5MB');
        return;
      }
      setUploadFile(file);
    }
  };

  const removeFile = () => {
    setUploadFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSubmitExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !uploadFile) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const caption = `
📝 *ការបញ្ជូនលំហាត់ថ្មី (New Submission)*
👤 *ឈ្មោះសិស្ស:* ${studentName}
📚 *វគ្គសិក្សា:* ${targetCourse}
📌 *លំហាត់:* ${selectedExerciseTitle || 'General Upload'}
📅 *កាលបរិច្ឆេទ:* ${new Date().toLocaleDateString('km-KH')}
      `;

      const formData = new FormData();
      formData.append('chat_id', TELEGRAM_CHAT_ID);
      formData.append('document', uploadFile);
      formData.append('caption', caption);
      formData.append('parse_mode', 'Markdown');

      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          if (!user) setStudentName('');
          setUploadFile(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
          setSelectedExerciseTitle('');
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderUploadForm = () => (
    <div className="p-4 md:p-8 max-w-2xl mx-auto w-full animate-fade-in pb-20">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-indigo-600 p-6 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-30 pattern-grid"></div>
                <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-white/10">
                        <UploadCloud size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold font-khmer">ទម្រង់ផ្ញើលំហាត់ទៅកាន់គ្រូ</h3>
                    <p className="text-indigo-100 text-sm font-khmer mt-2 opacity-90">ដាក់ពិន្ទុ និងទទួលបានការកែតម្រូវពីគ្រូ</p>
                </div>
            </div>

            <form onSubmit={handleSubmitExercise} className="p-6 md:p-8 space-y-6">
                {/* Info Banner */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex gap-3 border border-blue-100 dark:border-blue-800/50">
                    <div className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0"><AlertCircle size={20}/></div>
                    <div className="text-sm text-blue-700 dark:text-blue-300 font-khmer leading-relaxed">
                        ឯកសាររបស់អ្នកនឹងត្រូវផ្ញើផ្ទាល់ទៅកាន់ Admin Bot តាមរយៈ Telegram។ លទ្ធផលនឹងត្រូវបានជូនដំណឹងត្រឡប់មកវិញ។
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-600 dark:text-slate-300 font-khmer flex items-center gap-2">
                            <BsFiletypeExe  size={16}/> វគ្គសិក្សា (Course)
                        </label>
                        <select 
                            value={targetCourse}
                            onChange={(e) => setTargetCourse(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-khmer text-sm dark:text-white appearance-none cursor-pointer"
                        >
                            <option value="Word">Microsoft Word</option>
                            <option value="Excel">Microsoft Excel</option>
                            <option value="PowerPoint">Microsoft PowerPoint</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-600 dark:text-slate-300 font-khmer flex items-center gap-2">
                            <Calendar size={16}/> កាលបរិច្ឆេទ
                        </label>
                        <div className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-50 dark:text-slate-400">
                            {new Date().toLocaleDateString('km-KH')}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600 dark:text-slate-300 font-khmer">
                         ចំណងជើងលំហាត់ (Exercise Title)
                      </label>
                      <input 
                        type="text"
                        value={selectedExerciseTitle}
                        onChange={(e) => setSelectedExerciseTitle(e.target.value)}
                        placeholder="ឧ. Exercise 1..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-khmer text-sm dark:text-white"
                      />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 dark:text-slate-300 font-khmer flex items-center gap-2">
                        <User size={16}/> ឈ្មោះសិស្ស (Student Name) <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="បញ្ចូលឈ្មោះរបស់អ្នក..."
                        readOnly={!!user}
                        className={`w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-khmer text-sm dark:text-white ${user ? 'opacity-80 cursor-not-allowed' : ''}`}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 dark:text-slate-300 font-khmer">
                        ឯកសារលំហាត់ (Attach File) <span className="text-red-500">*</span>
                    </label>
                    <div className={`
                        relative border-2 border-dashed rounded-xl p-6 text-center transition-all group
                        ${uploadFile 
                            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer'}
                    `}>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            id="full-upload" 
                            className="hidden" 
                            onChange={handleFileChange}
                            accept=".docx,.xlsx,.pptx,.pdf,.jpg,.png"
                        />
                        
                        {uploadFile ? (
                             <div className="flex items-center justify-between gap-3 animate-fade-in">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-lg text-indigo-600 dark:text-indigo-400 shrink-0">
                                        <FileText size={24} />
                                    </div>
                                    <div className="text-left min-w-0">
                                        <div className="text-sm font-bold text-indigo-700 dark:text-indigo-300 truncate">
                                            {uploadFile.name}
                                        </div>
                                        <span className="text-xs text-indigo-500 block">
                                            {(uploadFile.size / 1024).toFixed(2)} KB
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    type="button"
                                    onClick={removeFile}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition"
                                >
                                    <X size={20} />
                                </button>
                             </div>
                        ) : (
                            <label htmlFor="full-upload" className="cursor-pointer block">
                                <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors">
                                    <UploadCloud size={32} />
                                    <div className="text-sm">
                                        <span className="font-bold font-khmer">ចុចជ្រើសរើសឯកសារ</span>
                                        <span className="opacity-70 mx-1">ឬអូសដាក់ចូល</span>
                                    </div>
                                    <div className="text-[10px] opacity-60 uppercase tracking-wide">DOCX, XLSX, PPTX, PDF (Max 5MB)</div>
                                </div>
                            </label>
                        )}
                    </div>
                    {fileError && <p className="text-red-500 text-xs font-khmer mt-1">{fileError}</p>}
                </div>

                <button 
                    type="submit"
                    disabled={isSubmitting || !studentName || !uploadFile}
                    className={`
                        w-full py-3.5 rounded-xl font-bold text-white shadow-lg font-khmer flex items-center justify-center gap-2 text-sm md:text-base transition-all
                        ${isSubmitting 
                            ? 'bg-slate-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] hover:shadow-indigo-200 dark:shadow-indigo-900/40 active:scale-[0.98]'}
                    `}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>កំពុងបញ្ជូន...</span>
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            <span>បញ្ជូនលំហាត់ឥឡូវនេះ</span>
                        </>
                    )}
                </button>

                {submitStatus === 'success' && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl text-center font-khmer animate-slide-up border border-green-200 dark:border-green-800">
                        <div className="flex justify-center mb-2"><CheckCircle2 size={32} /></div>
                        <p className="font-bold text-lg">ទទួលបានជោគជ័យ!</p>
                        <p className="text-sm">លំហាត់របស់អ្នកត្រូវបានផ្ញើទៅកាន់ Admin រួចរាល់។</p>
                    </div>
                )}
                {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl text-center font-khmer animate-slide-up border border-red-200 dark:border-red-800">
                        <div className="flex justify-center mb-2"><AlertCircle size={32} /></div>
                        <p className="font-bold">បរាជ័យក្នុងការផ្ញើ!</p>
                        <p className="text-sm">សូមពិនិត្យអ៊ីនធឺណិត ហើយព្យាយាមម្តងទៀត។</p>
                    </div>
                )}
            </form>
        </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10 h-full flex flex-col relative">
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
         <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-khmer">
               <span className="bg-brand-100 dark:bg-brand-900/30 p-2 rounded-xl text-brand-600 dark:text-brand-400"><BsFiletypeExe  size={24} /></span>
               បណ្ណាល័យលំហាត់អនុវត្ត
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-khmer text-sm mt-1 ml-12">
                ជ្រើសរើសប្រភេទលំហាត់ និងកម្រិតដើម្បីពង្រឹងសមត្ថភាពរបស់អ្នក។
            </p>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`
                    flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-t-xl transition-all font-bold border-b-2 relative top-[1px] whitespace-nowrap text-sm sm:text-base
                    ${activeTab === tab.id 
                        ? 'bg-white dark:bg-slate-800 border-brand-500 text-slate-800 dark:text-white shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                `}
            >
                <div className={`p-1.5 rounded-lg ${tab.color}`}>
                    <tab.icon size={18} />
                </div>
                <span className="font-khmer">{tab.label}</span>
            </button>
        ))}
      </div>

      {/* Content Area */}
      {activeTab === 'Upload' ? (
          renderUploadForm()
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-b-xl rounded-tr-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex-1 transition-colors">
            <div className="p-6 grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                {(EXERCISE_DATA[activeTab] || []).map((ex: Exercise, idx: number) => (
                    <div 
                        key={idx} 
                        className="group relative border border-slate-100 dark:border-slate-700 rounded-2xl p-5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-600 cursor-pointer flex flex-col h-full"
                    >
                        {/* Difficulty Badge */}
                        <div className="absolute top-4 right-4">
                             <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${getLevelColor(ex.level)}`}>
                                {ex.level}
                             </span>
                        </div>

                        <div className="flex items-start gap-4 mb-3 pr-16">
                             <div className={`
                                w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 shadow-sm
                                ${activeTab === 'Word' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300' :
                                activeTab === 'Excel' ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300' :
                                'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300'}
                            `}>
                                {idx + 1}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white font-khmer text-base md:text-lg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                    {ex.title.split(':')[0]}
                                </h3>
                                <h4 className="font-bold text-slate-600 dark:text-slate-300 font-khmer text-sm mt-0.5">
                                    {ex.title.split(':')[1] || ex.title}
                                </h4>
                            </div>
                        </div>
                        
                        <div className="pl-14 flex-1">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-khmer leading-relaxed mb-4">
                                {ex.desc}
                            </p>
                            
                            {/* 👉 បានលុបប៊ូតុងចេញតាមការស្នើសុំ */}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-center pb-8">
                <a 
                    href="https://t.me/sovansaro" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-khmer font-medium transition"
                >
                    <ExternalLink size={16} />
                    <span>ត្រូវការជំនួយបន្ថែម ឬស្នើសុំចម្លើយ? ទាក់ទង Admin</span>
                </a>
            </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;