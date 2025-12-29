import React, { useState, useEffect } from 'react';
import { X, Plus, Video, Trash2, ChevronDown, ChevronRight, PlayCircle, Clock, DollarSign } from 'lucide-react';
import { Course, Module, Lesson } from '../../types';

interface CurriculumManagerProps {
  courseId: string;
  onClose: () => void;
}

const CourseCurriculumManager: React.FC<CurriculumManagerProps> = ({ courseId, onClose }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State សម្រាប់ Form បន្ថែម Module
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [isAddingModule, setIsAddingModule] = useState(false);

  // State សម្រាប់ Form បន្ថែម Lesson (ទុកដឹងថាកំពុងបន្ថែមចូល Module មួយណា)
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    videoUrl: '',
    duration: '',
    isFree: false
  });

  // State សម្រាប់បើក/បិទ Accordion (មើលមេរៀនក្នុងជំពូក)
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // ១. ទាញទិន្នន័យវគ្គសិក្សាមកបង្ហាញ
  const fetchCourseDetails = async () => {
    try {
      const res = await fetch(`https://my-skills-api.onrender.com/api/courses`); // ទាញទាំងអស់សិន (អាចកែទៅ getById បើ backend មាន)
      const data = await res.json();
      if (data.success) {
        const foundCourse = data.data.find((c: any) => c._id === courseId);
        if (foundCourse) {
          setCourse({
            ...foundCourse,
            id: foundCourse._id,
            modules: foundCourse.modules || []
          });
          
          // បើក Module ទាំងអស់ឱ្យស្រាប់
          const expanded: Record<string, boolean> = {};
          foundCourse.modules?.forEach((m: any) => expanded[m._id] = true);
          setExpandedModules(expanded);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  // ២. មុខងារបន្ថែម Module
  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://my-skills-api.onrender.com/api/courses/${courseId}/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: newModuleTitle })
      });
      const data = await res.json();
      if (data.success) {
        setNewModuleTitle('');
        setIsAddingModule(false);
        fetchCourseDetails(); // Refresh ទិន្នន័យ
      }
    } catch (error) {
      alert('បរាជ័យក្នុងការបន្ថែមជំពូក');
    }
  };

  // ៣. មុខងារបន្ថែម Lesson
  const handleAddLesson = async (moduleId: string) => {
    if (!lessonForm.title.trim() || !lessonForm.videoUrl.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://my-skills-api.onrender.com/api/courses/${courseId}/modules/${moduleId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(lessonForm)
      });
      const data = await res.json();
      if (data.success) {
        setLessonForm({ title: '', videoUrl: '', duration: '', isFree: false });
        setActiveModuleId(null); // បិទ Form
        fetchCourseDetails(); // Refresh
      }
    } catch (error) {
      alert('បរាជ័យក្នុងការបន្ថែមមេរៀន');
    }
  };

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return <div className="fixed inset-0 bg-black/50 flex items-center justify-center text-white z-50">Loading...</div>;
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white font-khmer">គ្រប់គ្រងមេរៀន</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-khmer mt-1">វគ្គសិក្សា៖ {course.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500">
            <X size={24} />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* List Modules */}
          <div className="space-y-4">
            {course.modules?.map((module: any) => (
              <div key={module._id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
                
                {/* Module Header */}
                <div 
                  className="p-4 bg-slate-50 dark:bg-slate-700/50 flex justify-between items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  onClick={() => toggleModule(module._id)}
                >
                  <div className="flex items-center gap-3">
                    {expandedModules[module._id] ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
                    <h3 className="font-bold text-slate-800 dark:text-white font-khmer">{module.title}</h3>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                      {module.lessons.length} មេរៀន
                    </span>
                  </div>
                </div>

                {/* Lessons List */}
                {expandedModules[module._id] && (
                  <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 space-y-3">
                    {module.lessons.map((lesson: any) => (
                      <div key={lesson._id} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${lesson.isFree ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                             <PlayCircle size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 font-khmer">{lesson.title}</p>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10} /> {lesson.duration || '00:00'}</span>
                                {lesson.isFree && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded font-bold">Free</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Lesson Form */}
                    {activeModuleId === module._id ? (
                      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-blue-200 dark:border-blue-900">
                        <h4 className="text-sm font-bold text-blue-600 mb-3 font-khmer">បន្ថែមមេរៀនថ្មី</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <input 
                            placeholder="ចំណងជើងមេរៀន" 
                            className="p-2 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900 font-khmer text-sm"
                            value={lessonForm.title}
                            onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})}
                          />
                          <input 
                            placeholder="Link វីដេអូ (Youtube/Cloudinary)" 
                            className="p-2 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-sm"
                            value={lessonForm.videoUrl}
                            onChange={(e) => setLessonForm({...lessonForm, videoUrl: e.target.value})}
                          />
                          <input 
                            placeholder="រយៈពេល (ឧ. 10:00)" 
                            className="p-2 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-sm"
                            value={lessonForm.duration}
                            onChange={(e) => setLessonForm({...lessonForm, duration: e.target.value})}
                          />
                          <div className="flex items-center gap-2">
                             <input 
                                type="checkbox" 
                                id="isFree"
                                checked={lessonForm.isFree}
                                onChange={(e) => setLessonForm({...lessonForm, isFree: e.target.checked})}
                             />
                             <label htmlFor="isFree" className="text-sm text-slate-600 dark:text-slate-400 font-khmer">មេរៀនឥតគិតថ្លៃ (Free Preview)</label>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setActiveModuleId(null)} className="px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-200 rounded">Cancel</button>
                            <button onClick={() => handleAddLesson(module._id)} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 font-khmer">រក្សាទុក</button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setActiveModuleId(module._id)}
                        className="w-full py-2 flex items-center justify-center gap-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-khmer text-sm"
                      >
                        <Plus size={16} /> បន្ថែមមេរៀនក្នុងជំពូកនេះ
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Empty State */}
            {(!course.modules || course.modules.length === 0) && (
              <div className="text-center py-10 text-slate-400">
                <Video size={40} className="mx-auto mb-2 opacity-20" />
                <p className="font-khmer">មិនទាន់មានមេរៀននៅឡើយ</p>
              </div>
            )}
          </div>

        </div>

        {/* Footer: Add Module Button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            {isAddingModule ? (
                <div className="flex gap-2">
                    <input 
                        className="flex-1 p-2 border border-slate-300 rounded-lg dark:bg-slate-800 dark:border-slate-600 font-khmer outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="ឈ្មោះជំពូកថ្មី (ឧ. ជំពូកទី ១: ការណែនាំ)"
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                        autoFocus
                    />
                    <button onClick={() => setIsAddingModule(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-200 rounded-lg">Cancel</button>
                    <button onClick={handleAddModule} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-khmer">បន្ថែម</button>
                </div>
            ) : (
                <button 
                    onClick={() => setIsAddingModule(true)}
                    className="w-full py-3 bg-white dark:bg-slate-800 border-2 border-dashed border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 rounded-xl font-bold font-khmer hover:bg-blue-50 dark:hover:bg-slate-800/50 transition flex items-center justify-center gap-2"
                >
                    <Plus size={20} /> បង្កើតជំពូកថ្មី (Add Module)
                </button>
            )}
        </div>

      </div>
    </div>
  );
};

export default CourseCurriculumManager;