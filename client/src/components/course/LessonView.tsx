import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bookmark, ChevronRight, ChevronLeft, PlayCircle,
  ArrowLeft
} from "lucide-react";
import { Course, Module, Lesson } from "../../types";
import HomeworkSubmission from './HomeworkSubmission';

// 🔥 ១. កែសម្រួល function នេះឱ្យមានសុវត្ថិភាពជាងមុន
const getEmbedUrl = (url: string | undefined | null) => {
  if (!url) return null; // បើអត់មាន URL ឈប់ធ្វើការភ្លាម (ការពារ Error)

  // ករណី YouTube
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
  }

  // ករណី Vimeo
  if (url.includes("vimeo.com")) {
    const regExp = /vimeo.*\/(\d+)/i;
    const match = url.match(regExp);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}`;
    }
  }

  return null;
};

interface LessonViewProps {
  course: Course;
  module: Module;
  lesson: Lesson;
  user: any;
  flatLessons: Lesson[];
  onNavigate: (direction: "next" | "prev") => void;
  onLessonSelect: (module: Module, lesson: Lesson) => void;
  onToggleSave: () => void;
  onExit: () => void;
  onDashboard: () => void;
  onCourseDetail: () => void;
  setSelectedImage: (url: string | null) => void;
}

const LessonView: React.FC<LessonViewProps> = ({
  course,
  module,
  lesson,
  user,
  flatLessons,
  onNavigate,
  onLessonSelect,
  onToggleSave,
  onExit,
  setSelectedImage
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'outline'>('content');

  // ការពារករណី lesson អត់ទាន់មកដល់
  if (!lesson || !module) return null;

  const currentIndex = flatLessons.findIndex((l) => l.id === lesson.id);
  const hasNext = currentIndex < flatLessons.length - 1;
  const hasPrev = currentIndex > 0;
  const isSaved = user?.savedLessons?.some((l: any) => l.lessonId === lesson.id);
  
  // 🔥 ២. ប្រើ ?. ដើម្បីការពារ Error (នេះហើយកន្លែងដែល Error មុននេះ!)
  const isExercise = lesson?.title?.includes('លំហាត់') || lesson?.id?.includes('exercise');

  // ទាញយក URL វីដេអូ (ការពារ undefined)
  const videoUrl = (lesson as any).videoUrl || '';
  const embedUrl = getEmbedUrl(videoUrl);

  const renderFormattedContent = (text: string) => {
    if (!text) return null; // ការពារអត់មានអក្សរ
    const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return <a key={index} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">{linkMatch[1]}</a>;
      }
      const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
      if (boldMatch) {
        return <strong key={index} className="font-bold text-slate-900 dark:text-white">{boldMatch[1]}</strong>;
      }
      return part;
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen flex flex-col bg-white dark:bg-slate-950 font-sans overflow-hidden transition-colors">
      
      {/* 1. Header ពណ៌ក្រហម */}
      <div className="h-16 bg-red-900 text-white flex items-center px-4 justify-between shrink-0 shadow-md z-20">
        <div className="flex items-center gap-2">
          <button 
            onClick={onExit} 
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden border border-white/20">
            <span className="text-red-900 font-bold text-xs">MS</span>
          </div>
          <h1 className="text-lg font-bold font-khmer tracking-wide line-clamp-1">{course?.title}</h1>
        </div>

        {user && (
            <button 
                onClick={onToggleSave}
                className={`p-2 rounded-full transition-all ${isSaved ? 'text-yellow-400' : 'text-white hover:bg-white/20'}`}
            >
                <Bookmark size={24} className={isSaved ? "fill-current" : ""} />
            </button>
        )}
      </div>

      {/* 2. Video Player Section */}
      <div className="w-full bg-white dark:bg-slate-950 shrink-0 relative z-10 flex justify-center py-0 md:py-6">
        <div className="w-full md:max-w-3xl lg:max-w-4xl aspect-video bg-black relative shadow-xl md:rounded-xl overflow-hidden md:border border-slate-200">
            {videoUrl ? (
                embedUrl ? (
                    // សម្រាប់ YouTube/Vimeo
                    <iframe 
                        src={embedUrl} 
                        title="Lesson Video" 
                        className="w-full h-full" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                ) : (
                    // សម្រាប់ Video ផ្ទាល់ (Cloudinary, mp4...)
                    <video controls className="w-full h-full object-contain bg-black">
                        <source src={videoUrl} type="video/mp4" />
                        Browser របស់អ្នកមិនគាំទ្រវីដេអូនេះទេ។
                    </video>
                )
            ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm bg-slate-100 dark:bg-slate-800">
                    <span className="font-khmer">វីដេអូមិនទាន់ដាក់បញ្ចូល</span>
                </div>
            )}
        </div>
      </div>

      {/* 3. Content & Outline Section */}
      <div className="flex-1 overflow-y-auto scroll-smooth bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto w-full pb-20">
          
            {/* Title */}
            <div className="p-4 md:p-6 bg-white dark:bg-slate-900 shadow-sm mb-2">
                <h1 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white font-khmer leading-relaxed">
                    {lesson?.title}
                </h1>
                <p className="text-xs text-slate-500 mt-1 font-khmer">
                    {module?.title} • មេរៀនទី {currentIndex + 1}
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-red-900 dark:bg-slate-900 sticky top-0 z-10 shadow-sm">
                <button onClick={() => setActiveTab('content')} className={`flex-1 py-3 font-khmer font-bold text-sm border-b-2 transition-colors ${activeTab === 'content' ? 'border-red-600 text-white bg-white/10' : 'border-transparent text-white/70 hover:text-white hover:bg-white/5'}`}>
                    ខ្លឹមសារមេរៀន
                </button>
                <button onClick={() => setActiveTab('outline')} className={`flex-1 py-3 font-khmer font-bold text-sm border-b-2 transition-colors ${activeTab === 'outline' ? 'border-red-600 text-white bg-white/10' : 'border-transparent text-white/70 hover:text-white hover:bg-white/5'}`}>
                    មាតិកាវគ្គសិក្សា
                </button>
            </div>

            {/* Tab Content */}
            <div className="p-4 md:p-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'content' ? (
                    <motion.div key="content" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="prose prose-lg prose-slate dark:prose-invert max-w-none font-khmer text-slate-700 dark:text-slate-300 leading-loose">
                        {/* បង្ហាញ Description */}
                        {lesson.content ? (
                             lesson.content.split("\n").map((para, i) => {
                                if (!para.trim()) return <br key={i} className="leading-none" />;
                                
                                const imageMatch = para.match(/^!\[(.*?)\]\((.*?)\)/);
                                if (imageMatch) {
                                    return (
                                    <div key={i} className="my-4 flex flex-col items-center">
                                        <img src={imageMatch[2]} alt={imageMatch[1]} onClick={() => setSelectedImage(imageMatch[2])} className="max-w-full rounded-lg shadow-sm cursor-pointer" />
                                        {imageMatch[1] && <span className="text-xs text-slate-500 mt-2">{imageMatch[1]}</span>}
                                    </div>
                                    );
                                }
                                if (para.startsWith("# ")) return <h1 key={i} className="text-xl font-bold mt-4 mb-2 pb-2 border-b">{renderFormattedContent(para.replace(/^#+\s/, ""))}</h1>;
                                if (para.startsWith("## ")) return <h2 key={i} className="text-lg font-bold mt-3 mb-2">{renderFormattedContent(para.replace(/^#+\s/, ""))}</h2>;
                                if (para.startsWith(">")) return <div key={i} className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg my-3 border-l-4 border-red-500 italic text-sm">{renderFormattedContent(para.replace(">", ""))}</div>;
                                
                                return <p key={i} className="mb-3 text-sm md:text-base">{renderFormattedContent(para)}</p>;
                            })
                        ) : (
                            <p className="text-slate-500 italic">គ្មានខ្លឹមសារបន្ថែមសម្រាប់មេរៀននេះទេ។</p>
                        )}

                        {isExercise && (
                        <div className="mt-6 border-t pt-6">
                            <HomeworkSubmission lessonTitle={lesson.title} studentName={user?.name || "Student"} />
                        </div>
                        )}
                    </motion.div>
                    ) : (
                    <motion.div key="outline" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-3">
                        {course.modules?.map((mod, idx) => (
                        <div key={mod.id} className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 font-bold text-slate-800 dark:text-white font-khmer flex items-center gap-3 text-sm">
                            <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs">{idx + 1}</span>
                            {mod.title}
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {mod.lessons?.map(l => {
                                const isActive = l.id === lesson.id;
                                return (
                                <button key={l.id} onClick={() => onLessonSelect(mod, l)} className={`w-full p-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left ${isActive ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
                                    <div className={`shrink-0 ${isActive ? 'text-red-600' : 'text-slate-300'}`}>
                                        <PlayCircle size={20} className={isActive ? "fill-red-100" : ""} />
                                    </div>
                                    <div className={`font-khmer text-sm ${isActive ? 'text-red-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                                        {l.title}
                                    </div>
                                </button>
                                )
                            })}
                            </div>
                        </div>
                        ))}
                    </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>

      {/* 4. Footer Navigation */}
      <div className="h-14 md:h-16 bg-red-900 text-white flex items-center justify-between px-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
        <button 
            onClick={() => onNavigate("prev")} 
            disabled={!hasPrev}
            className={`flex items-center gap-2 font-bold font-khmer transition-opacity ${!hasPrev ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:opacity-80'}`}
        >
            <ChevronLeft size={24} />
            <span className="hidden md:inline">មេរៀនមុន</span>
        </button>

        <div className="h-8 w-[1px] bg-white/20"></div>

        <button 
            onClick={() => onNavigate("next")} 
            disabled={!hasNext}
            className={`flex items-center gap-2 font-bold font-khmer transition-opacity ${!hasNext ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:opacity-80'}`}
        >
            <span className="hidden md:inline">មេរៀនបន្ទាប់</span>
            <ChevronRight size={24} />
        </button>
      </div>

    </motion.div>
  );
};

export default LessonView;