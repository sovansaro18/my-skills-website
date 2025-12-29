import React, { useState, useEffect, useMemo } from "react";
import { BeatLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X } from "lucide-react";

import Layout from "./components/layout/Layout";
import CourseCard from "./components/course/CourseCard";
import ShortcutGuide from "./pages/ShortcutGuide";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfile from "./pages/UserProfile";
import AboutUs from "./pages/AboutUs";
import FeedbackList from "./components/common/FeedbackList"; 
import SavedLessons from "./components/course/SavedLessons";
import LessonView from "./components/course/LessonView";
import AdminDashboard from "./components/admin/AdminDashboard";
import { useAuth } from "./components/contexts/AuthContext"; 
import { COURSES } from "./constants";
import { Course, Module, Lesson, AppView } from "./types";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(() => (localStorage.getItem("currentView") as AppView) || AppView.DASHBOARD);
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(() => {
    const id = localStorage.getItem("courseId");
    return COURSES.find((c) => c.id === id) || null;
  });
  const [selectedModule, setSelectedModule] = useState<Module | null>(() => {
    const id = localStorage.getItem("moduleId");
    const course = COURSES.find((c) => c.id === localStorage.getItem("courseId"));
    return course?.modules.find((m) => m.id === id) || null;
  });
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(() => {
    const id = localStorage.getItem("lessonId");
    const course = COURSES.find((c) => c.id === localStorage.getItem("courseId"));
    const module = course?.modules.find((m) => m.id === localStorage.getItem("moduleId"));
    return module?.lessons.find((l) => l.id === id) || null;
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [minLoading, setMinLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { user, isLoading: authLoading, refreshUser, logout } = useAuth();
  const DEFAULT_AVATAR = "/assets/Avatar.png";

  const heroImages = [
    "https://res.cloudinary.com/dzivaqghe/image/upload/v1766850777/slide1_fhpjlp.jpg",
    "https://res.cloudinary.com/dzivaqghe/image/upload/v1766850793/slide2_gzx3d5.png",
    "https://res.cloudinary.com/dzivaqghe/image/upload/v1766850778/slide3_aokb7t.jpg",
    "https://res.cloudinary.com/dzivaqghe/image/upload/v1766850791/slide4_eju0e6.png",
  ];

  useEffect(() => {
    if (currentView) localStorage.setItem("currentView", currentView);
    if (selectedCourse) localStorage.setItem("courseId", selectedCourse.id); else localStorage.removeItem("courseId");
    if (selectedModule) localStorage.setItem("moduleId", selectedModule.id); else localStorage.removeItem("moduleId");
    if (selectedLesson) localStorage.setItem("lessonId", selectedLesson.id); else localStorage.removeItem("lessonId");
  }, [currentView, selectedCourse, selectedModule, selectedLesson]);

  useEffect(() => {
    const timer = setTimeout(() => setMinLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroImages.length), 5000);
    return () => clearInterval(slideInterval);
  }, [heroImages.length]);

  const flatLessons = useMemo(() => {
    if (!selectedCourse) return [];
    return selectedCourse.modules.flatMap((m) => m.lessons);
  }, [selectedCourse]);

  const handleLogout = () => {
    logout();
    localStorage.clear();
    setSelectedCourse(null);
    setSelectedModule(null);
    setSelectedLesson(null);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleCourseClick = (course: Course) => {
    if (!user) { setCurrentView(AppView.LOGIN); return; }
    const firstModule = course.modules[0];
    const firstLesson = firstModule?.lessons[0];
    if (firstModule && firstLesson) {
        setSelectedCourse(course);
        setSelectedModule(firstModule);
        setSelectedLesson(firstLesson);
        setCurrentView(AppView.LESSON);
    } else {
        alert("មិនទាន់មានមេរៀននៅឡើយទេ!");
    }
  };

  const handleLessonClick = (module: Module, lesson: Lesson) => {
    if (!user) { setCurrentView(AppView.LOGIN); return; }
    const targetModule = module || selectedCourse?.modules.find((m) => m.lessons.some((l) => l.id === lesson.id));
    setSelectedModule(targetModule || null);
    setSelectedLesson(lesson);
    setCurrentView(AppView.LESSON);
  };

  const navigateLesson = (direction: "next" | "prev") => {
    if (!selectedLesson || !selectedCourse) return;
    const currentIndex = flatLessons.findIndex((l) => l.id === selectedLesson.id);
    if (direction === "next" && currentIndex < flatLessons.length - 1) {
      handleLessonClick(null as any, flatLessons[currentIndex + 1]);
    } else if (direction === "prev" && currentIndex > 0) {
      handleLessonClick(null as any, flatLessons[currentIndex - 1]);
    }
  };

  const handlePlaySavedLesson = (courseId: string, moduleId: string, lessonId: string) => {
    if (!user) { setCurrentView(AppView.LOGIN); return; }
    const course = COURSES.find((c) => c.id === courseId);
    const module = course?.modules.find((m) => m.id === moduleId);
    const lesson = module?.lessons.find((l) => l.id === lessonId);
    if (course && module && lesson) {
      setSelectedCourse(course); setSelectedModule(module); setSelectedLesson(lesson);
      setCurrentView(AppView.LESSON);
    }
  };

const toggleSaveLesson = async () => {
    if (!selectedCourse || !selectedModule || !selectedLesson || !user) return;
    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch("https://my-skills-api.onrender.com/api/auth/toggle-save-lesson", { 
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          courseId: selectedCourse.id, moduleId: selectedModule.id, lessonId: selectedLesson.id, title: selectedLesson.title,
        }),
      });
      const data = await res.json();
      if (data.success) await refreshUser();
    } catch (error) { console.error("Error saving lesson:", error); }
  };

  const goBack = () => {
    setCurrentView(AppView.DASHBOARD);
    setSelectedCourse(null);
    localStorage.removeItem("courseId");
  };

  if (authLoading || minLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-khmer">
        <div className="relative z-10 flex flex-col items-center">
          <BeatLoader color="#87e8d5" size={15} margin={4} />
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-500 dark:text-slate-400 text-sm mt-4 animate-pulse"
          >
            កំពុងដំណើរការ...
          </motion.p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="relative rounded-2xl overflow-hidden shadow-lg h-48 sm:h-64 md:h-96 group">
        {heroImages.map((img, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}>
            <img src={img} alt="Slide" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        ))}
      </div>

      {user && (
        <div 
          onClick={() => setCurrentView(AppView.PROFILE)}
          className="bg-slate-50 text-slate-800 dark:bg-slate-800 dark:text-slate-100 rounded-2xl p-6 shadow-md flex justify-between items-center cursor-pointer hover:shadow-lg transition-all" // 👈 ២. ដាក់ cursor-pointer និង effect ពេលដាក់ Mouse ពីលើ
        >
          <div>
            <h2 className="text-xl font-bold font-khmer">សួស្តី, {user.name}!</h2>
            <p className="font-khmer mt-1 text-slate-500 dark:text-slate-200">
                ចុចទីនេះ ដើម្បីមើលឬកែប្រែគណនីរបស់អ្នក។ 
            </p>
          </div>
          <div className="bg-white/20 p-2 rounded-full">
            <img 
                src={user.avatar || DEFAULT_AVATAR} 
                className="w-10 h-10 rounded-full border-2 border-white/50 object-cover" 
                alt="User Avatar"
            />
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-3 mb-6 mt-8">
          <div className="bg-white dark:bg-slate-800 p-2 rounded-xl text-brand-600 dark:text-brand-400 shadow-sm border border-slate-100 dark:border-slate-700"><BookOpen size={20} /></div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-khmer">វគ្គសិក្សាដែលមាន</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {COURSES.map((course) => (
            <motion.div key={course.id} whileHover={{ y: -5 }}>
              <CourseCard course={course} onClick={() => handleCourseClick(course)} />
            </motion.div>
          ))}
        </div>
      </div>

      <FeedbackList />
    </motion.div>
  );

  if (currentView === AppView.LOGIN) {
    return <LoginPage onExit={() => setCurrentView(AppView.DASHBOARD)} onSwitchToRegister={() => setCurrentView(AppView.REGISTER)} />;
  }

  if (currentView === AppView.REGISTER) {
    return <RegisterPage onExit={() => setCurrentView(AppView.DASHBOARD)} onSwitchToLogin={() => setCurrentView(AppView.LOGIN)} />;
  }

  if (currentView === AppView.LESSON && selectedLesson && selectedCourse && selectedModule) {
    return (
      <>
        <div className="bg-white dark:bg-slate-950 min-h-screen">
            <LessonView
                course={selectedCourse}
                module={selectedModule}
                lesson={selectedLesson}
                user={user}
                flatLessons={flatLessons}
                onNavigate={navigateLesson}
                onLessonSelect={handleLessonClick}
                onToggleSave={toggleSaveLesson}
                onExit={goBack}
                onDashboard={() => setCurrentView(AppView.DASHBOARD)}
                onCourseDetail={() => {}} 
                setSelectedImage={setSelectedImage}
            />
        </div>
        <AnimatePresence>
            {selectedImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedImage(null)} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                <motion.img initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} src={selectedImage} className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain" />
                <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full"><X size={32} /></button>
            </motion.div>
            )}
        </AnimatePresence>
      </>
    );
  }

  return (
      <>
        <Layout currentView={currentView} onNavigate={setCurrentView}>
          <AnimatePresence mode="wait">
            {currentView === AppView.DASHBOARD && renderDashboard()}
            {currentView === AppView.SHORTCUTS && <ShortcutGuide onExit={goBack} />}
            {currentView === AppView.PROFILE && <UserProfile onExit={goBack} />}
            {currentView === AppView.ABOUT && <AboutUs />}
            {currentView === AppView.SAVED && <SavedLessons onNavigate={setCurrentView} onPlayLesson={handlePlaySavedLesson} />}
            {currentView === AppView.ADMIN && <AdminDashboard />}
          </AnimatePresence>
        </Layout>

        <AnimatePresence>
          {selectedImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedImage(null)} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
              <motion.img initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} src={selectedImage} className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain" />
              <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full"><X size={32} /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </>
  );
};

export default App;