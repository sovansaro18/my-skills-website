import React, { useState, useEffect, useMemo } from "react";
import { BeatLoader } from "react-spinners";
import Layout from "./components/Layout";
import CourseCard from "./components/CourseCard";
import ShortcutGuide from "./components/ShortcutGuide";
import ExerciseLibrary from "./components/ExerciseLibrary";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import { COURSES } from "./constants";
import { Course, Module, Lesson, AppView } from "./types";
import {
  PlayCircle,
  ArrowLeft,
  Bookmark,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Menu,
  Home,
  X,
} from "lucide-react";
import { useAuth } from "./components/contexts/AuthContext";
import UserProfile from "./components/UserProfile";
import FeedbackList from "./components/FeedbackList";
import AboutUs from "./components/AboutUs";
import SavedLessons from "./components/SavedLessons";
import HomeworkSubmission from './components/HomeworkSubmission';

import { motion, AnimatePresence, Variants } from "framer-motion";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    return (
      (localStorage.getItem("currentView") as AppView) || AppView.DASHBOARD
    );
  });

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(() => {
    const courseId = localStorage.getItem("courseId");
    return COURSES.find((c) => c.id === courseId) || null;
  });

  const [selectedModule, setSelectedModule] = useState<Module | null>(() => {
    const courseId = localStorage.getItem("courseId");
    const moduleId = localStorage.getItem("moduleId");
    const course = COURSES.find((c) => c.id === courseId);
    return course?.modules.find((m) => m.id === moduleId) || null;
  });

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(() => {
    const courseId = localStorage.getItem("courseId");
    const moduleId = localStorage.getItem("moduleId");
    const lessonId = localStorage.getItem("lessonId");

    const course = COURSES.find((c) => c.id === courseId);
    const module = course?.modules.find((m) => m.id === moduleId);
    return module?.lessons.find((l) => l.id === lessonId) || null;
  });

  const [lessonContent, setLessonContent] = useState<string>(() => {
    return selectedLesson ? selectedLesson.content : "";
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [minLoading, setMinLoading] = useState(true);

  useEffect(() => {
    if (currentView) localStorage.setItem("currentView", currentView);

    if (selectedCourse) {
      localStorage.setItem("courseId", selectedCourse.id);
    } else {
      localStorage.removeItem("courseId");
    }

    if (selectedModule) {
      localStorage.setItem("moduleId", selectedModule.id);
    } else {
      localStorage.removeItem("moduleId");
    }

    if (selectedLesson) {
      localStorage.setItem("lessonId", selectedLesson.id);
    } else {
      localStorage.removeItem("lessonId");
    }
  }, [currentView, selectedCourse, selectedModule, selectedLesson]);

  const [showLessonSidebar, setShowLessonSidebar] = useState(false);
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
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [heroImages.length]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);


  const flatLessons = useMemo(() => {
    if (!selectedCourse) return [];
    return selectedCourse.modules.flatMap((m) => m.lessons);
  }, [selectedCourse]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50 }
    }
  };

  const pageTransition: Variants = {
    initial: { opacity: 0, x: 20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { opacity: 0, x: -20 },
  };

  // --- Handlers ---
  const handleLogout = () => {
    logout();
    localStorage.removeItem("currentView");
    localStorage.removeItem("courseId");
    localStorage.removeItem("moduleId");
    localStorage.removeItem("lessonId");
    setSelectedCourse(null);
    setSelectedModule(null);
    setSelectedLesson(null);
    setLessonContent("");
    setCurrentView(AppView.DASHBOARD);
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setCurrentView(AppView.COURSE_DETAIL);
    setSelectedModule(null);
    setSelectedLesson(null);
  };

  const handleLessonClick = async (module: Module, lesson: Lesson) => {
    if (!user) {
      setCurrentView(AppView.LOGIN);
      return;
    }

    const targetModule =
      module ||
      selectedCourse?.modules.find((m) =>
        m.lessons.some((l) => l.id === lesson.id)
      );

    setSelectedModule(targetModule || null);
    setSelectedLesson(lesson);
    setCurrentView(AppView.LESSON);
    setLessonContent(lesson.content);
    setShowLessonSidebar(false);
  };

  const navigateLesson = (direction: "next" | "prev") => {
    if (!selectedLesson || !selectedCourse) return;
    const currentIndex = flatLessons.findIndex(
      (l) => l.id === selectedLesson.id
    );

    if (direction === "next" && currentIndex < flatLessons.length - 1) {
      const nextLesson = flatLessons[currentIndex + 1];
      handleLessonClick(null as any, nextLesson);
    } else if (direction === "prev" && currentIndex > 0) {
      const prevLesson = flatLessons[currentIndex - 1];
      handleLessonClick(null as any, prevLesson);
    }
  };

  const handlePlaySavedLesson = (
    courseId: string,
    moduleId: string,
    lessonId: string
  ) => {
    if (!user) {
      setCurrentView(AppView.LOGIN);
      return;
    }

    const course = COURSES.find((c) => c.id === courseId);
    if (!course) return;

    const module = course.modules.find((m) => m.id === moduleId);
    if (!module) return;

    const lesson = module.lessons.find((l) => l.id === lessonId);
    if (!lesson) return;

    setSelectedCourse(course);
    setSelectedModule(module);
    setSelectedLesson(lesson);
    setLessonContent(lesson.content);
    setCurrentView(AppView.LESSON);
  };

  const toggleSaveLesson = async () => {
    if (!selectedCourse || !selectedModule || !selectedLesson || !user) return;

    try {
      const token = localStorage.getItem("token");
     const res = await fetch(
        "https://my-skills-api.onrender.com/api/auth/toggle-save-lesson",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            courseId: selectedCourse.id,
            moduleId: selectedModule.id,
            lessonId: selectedLesson.id,
            title: selectedLesson.title,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        await refreshUser();
      }
    } catch (error) {
      console.error("Error saving lesson:", error);
    }
  };

  const goBack = () => {
    if (currentView === AppView.LESSON) {
      setCurrentView(AppView.COURSE_DETAIL);
      setSelectedLesson(null);
      localStorage.removeItem("lessonId");
    } else if (
      currentView === AppView.LOGIN ||
      currentView === AppView.REGISTER
    ) {
      setCurrentView(AppView.DASHBOARD);
    } else {
      setCurrentView(AppView.DASHBOARD);
      setSelectedCourse(null);
      localStorage.removeItem("courseId");
    }
  };

if (authLoading || minLoading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-50 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center">
      <div className="text-center flex flex-col items-center">
        <BeatLoader 
          color="#16a34a" 
          size={15} 
          margin={4} 
        />
        <p className="mt-4 text-slate-600 dark:text-slate-400 font-khmer font-medium animate-pulse">
          កំពុងដំណើរការ...
        </p>
      </div>
    </div>
  );
}

  const renderDashboard = () => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="relative rounded-2xl overflow-hidden shadow-lg h-48 sm:h-64 md:h-96 group">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        ))}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide
                  ? "w-6 bg-white"
                  : "bg-white/50 hover:bg-white/80"
                }`}
            />
          ))}
        </div>
      </motion.div>

      {user && (
        <motion.div variants={itemVariants} className="bg-slate-50 text-slate-800 dark:bg-slate-800 dark:text-slate-100 rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-khmer">
                សួស្តី, {user.name}!
              </h2>
              <p className=" font-khmer mt-1 text-slate-500 dark:text-slate-200">
                សូមស្វាគមន៍មកកាន់វគ្គសិក្សារបស់អ្នក។
              </p>
            </div>
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <img
                src={user.avatar || DEFAULT_AVATAR}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
            </div>
          </div>
          {user.progress && user.progress.completedLessons.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-khmer">ដំណើរការរបស់អ្នក</span>
                <span>{user.progress.completedLessons.length} មេរៀន</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((user.progress.completedLessons.length / 36) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-white h-2 rounded-full"
                ></motion.div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="flex border-b-2 pb-3 border-slate-300/50 dark:border-slate-400 flex-col md:flex-row justify-between items-end gap-4 mb-2">

      </motion.div>

      <motion.div variants={containerVariants}>
        <div className="flex items-center gap-3 mb-6 mt-8">
          <div className="bg-white dark:bg-slate-800 p-2 rounded-xl text-brand-600 dark:text-brand-400 shadow-sm border border-slate-100 dark:border-slate-700">
            <BookOpen size={20} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-khmer">
            វគ្គសិក្សាដែលមាន
          </h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {COURSES.map((course) => (
            <motion.div key={course.id} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
              <CourseCard
                course={course}
                onClick={() => handleCourseClick(course)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 👇 បានដក PortfolioSection ចេញពីទីនេះ */}
      <motion.div variants={itemVariants}>
        <FeedbackList />
      </motion.div>
    </motion.div>
  );

  const renderCourseDetail = () => {
    if (!selectedCourse) return null;
    return (
      <motion.div
        initial="initial" animate="animate" exit="exit" variants={pageTransition}
        className="space-y-8"
      >
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={goBack}
            className="group flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 rounded-lg mr-2 group-hover:border-brand-200 dark:group-hover:border-brand-600 shadow-sm">
              <ArrowLeft size={16} />
            </div>
            ត្រឡប់ទៅផ្ទាំងគ្រប់គ្រង
          </motion.button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <motion.div
              whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
              className={`p-3 rounded-2xl ${selectedCourse.color} text-white shadow-lg`}
            >
              <img
                src={selectedCourse.imageUrl}
                alt={selectedCourse.title}
                className="w-12 h-12 object-contain"
              />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white font-khmer mb-2">
                {selectedCourse.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 font-khmer max-w-2xl text-sm md:text-lg">
                {selectedCourse.description}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto space-y-6">
          {selectedCourse.modules.map((module, mIdx) => (
            <motion.div
              key={module.id}
              variants={itemVariants}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-sm ring-4 ring-white dark:ring-slate-800">
                  {mIdx + 1}
                </span>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg font-khmer">
                  {module.title}
                </h3>
              </div>
              <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {module.lessons.map((lesson) => (
                  <motion.button
                    key={lesson.id}
                    whileHover={{ x: 10, backgroundColor: "rgba(0,0,0,0.02)" }}
                    onClick={() => handleLessonClick(module, lesson)}
                    className="w-full flex items-center justify-between p-5 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-brand-500 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 p-1.5 rounded-full group-hover:bg-brand-600 group-hover:text-white transition-colors">
                        <PlayCircle size={18} />
                      </div>
                      <span className="font-khmer font-medium text-sm md:text-base text-slate-700 dark:text-slate-200 group-hover:text-brand-700 dark:group-hover:text-brand-300">
                        {lesson.title}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    );
  };

  const renderLesson = () => {
    if (!selectedLesson || !selectedModule || !selectedCourse) return null;
    const currentIndex = flatLessons.findIndex(
      (l) => l.id === selectedLesson.id
    );
    const hasNext = currentIndex < flatLessons.length - 1;
    const hasPrev = currentIndex > 0;

    const isSaved = user?.savedLessons?.some(
      (l: any) => l.lessonId === selectedLesson.id
    );
    const isExercise = selectedLesson.title.includes('លំហាត់') || selectedLesson.id.includes('exercise') || selectedModule.id === 'word-module-4';
    const renderFormattedContent = (text: string) => {
      const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
      return parts.map((part, index) => {
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          return (
            <a
              key={index}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 dark:text-brand-400 hover:underline font-bold"
            >
              {linkMatch[1]}
            </a>
          );
        }
        const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
        if (boldMatch) {
          return (
            <strong
              key={index}
              className="font-bold text-slate-900 dark:text-white"
            >
              {boldMatch[1]}
            </strong>
          );
        }
        return part;
      });
    };

    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="h-[calc(100vh-64px)] flex bg-white dark:bg-slate-900 -m-4 sm:-m-6 lg:-m-8 font-sans overflow-hidden transition-colors"
      >
        <div
          className={`
            fixed inset-y-0 left-0 z-40 w-80 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 flex flex-col shadow-xl md:shadow-none
            md:relative md:translate-x-0
            ${showLessonSidebar ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white font-khmer text-base line-clamp-1">
                {selectedCourse.title}
              </h3>
              <button
                onClick={() => setShowLessonSidebar(false)}
                className="md:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <ArrowLeft size={20} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {selectedCourse.modules.map((module, mIdx) => (
              <div key={module.id} className="mb-2">
                <div className="px-4 py-1 text-base font-bold uppercase bg-slate-300/50 tracking-wider text-gray-800 dark:text-slate-200 font-khmer mt-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px]">
                    {mIdx + 1}
                  </span>
                  {module.title}
                </div>
                <div className="space-y-0.5">
                  {module.lessons.map((lesson) => {
                    const isLessonActive = lesson.id === selectedLesson.id;
                    return (
                      <motion.button
                        key={lesson.id}
                        whileHover={{ x: 5 }}
                        onClick={() => handleLessonClick(module, lesson)}
                        className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-all relative
                                            ${isLessonActive
                            ? "bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-300 shadow-sm z-10"
                            : "hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                          }
                                        `}
                      >
                        {isLessonActive && (
                          <motion.div layoutId="activeLessonIndicator" className="absolute left-0 top-0 bottom-0 w-1 bg-brand-600"></motion.div>
                        )}
                        <div className="mt-0.5 shrink-0">
                          <PlayCircle
                            size={16}
                            className={
                              isLessonActive
                                ? "text-green-600 fill-green-400 dark:fill-green-700"
                                : "text-slate-400 dark:text-slate-500"
                            }
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium font-khmer line-clamp-2 leading-relaxed ${isLessonActive
                                ? "text-slate-900 dark:text-white"
                                : ""
                              }`}
                          >
                            {lesson.title}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950 relative transition-colors">
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
            <button
              onClick={() => setShowLessonSidebar(true)}
              className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-khmer text-sm font-bold bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <Menu size={18} />
              មាតិកា
            </button>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {currentIndex + 1} / {flatLessons.length}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto  scroll-smooth">
            <div className="max-w-4xl mx-auto w-full pb-24">
              <div className="px-6 md:px-10 pt-8 md:pt-10 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap pb-1">
                    <span
                      className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer"
                      onClick={() => setCurrentView(AppView.DASHBOARD)}
                    >
                      <Home size={12} /> Home
                    </span>
                    <ChevronRight size={12} />
                    <span
                      className="hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer"
                      onClick={() => setCurrentView(AppView.COURSE_DETAIL)}
                    >
                      {selectedCourse.title}
                    </span>
                    <ChevronRight size={12} />
                    <span className="text-slate-800 dark:text-slate-200 font-bold">
                      {selectedModule.title}
                    </span>
                  </div>

                  {user && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleSaveLesson}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold transition-all shrink-0 ml-2
                                        ${isSaved
                          ? "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800"
                          : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                        }
                                    `}
                    >
                      <Bookmark
                        size={16}
                        className={
                          isSaved ? "fill-orange-600 dark:fill-orange-400" : ""
                        }
                      />
                      <span className="font-khmer hidden sm:inline">
                        {isSaved ? "បានរក្សាទុក" : "រក្សាទុក"}
                      </span>
                    </motion.button>
                  )}
                </div>
              </div>
              <div className="px-6">
                <motion.h1
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  key={selectedLesson.title}
                  className="text-xl md:text-2xl text-center underline font-bold text-blue-900 dark:text-white font-khmer leading-tight mt-6"
                >
                  {selectedLesson.title}
                </motion.h1>
                <div className="prose prose-slate dark:prose-invert text-justify max-w-3xl mx-auto font-khmer text-slate-700 dark:text-slate-300">
                  {lessonContent.split("\n").map((para, i) => {
                    if (!para.trim())
                      return <br key={i} className="leading-none" />;

                    const imageMatch = para.match(/^!\[(.*?)\]\((.*?)\)/);
                    if (imageMatch) {
                      const altText = imageMatch[1];
                      const imageUrl = imageMatch[2];
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="my-6 flex flex-col items-center"
                        >
                          <img
                            src={imageUrl}
                            alt={altText}
                            onClick={() => setSelectedImage(imageUrl)}
                            className="max-w-full h-auto rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer hover:opacity-90 hover:scale-[1.02] transition-all"
                          />
                          {altText && (
                            <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic font-khmer">
                              {altText}
                            </span>
                          )}
                        </motion.div>
                      );
                    }

                    if (para.startsWith("# "))
                      return (
                        <h1 key={i} className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                          {renderFormattedContent(para.replace(/^#+\s/, ""))}
                        </h1>
                      );
                    if (para.startsWith("## "))
                      return (
                        <h2 key={i} className="text-base text-slate-900 dark:text-slate-100 mt-2 mb-1">
                          {renderFormattedContent(para.replace(/^#+\s/, ""))}
                        </h2>
                      );
                    if (/^([IVX]+)\.\s/.test(para)) {
                      return (
                        <h3 key={i} className="text-slate-700 pl-1 bg-slate-300/50 dark:text-slate-100 font-bold text-base md:text-lg mt-2 mb-3 font-khmer">
                          {renderFormattedContent(para)}
                        </h3>
                      );
                    }
                    if (para.startsWith(">")) {
                      return (
                        <div key={i} className="flex items-center gap-2 justify-start mb-2">
                          <span className="text-blue-700 dark:text-white text-base font-bold shrink-0">❖</span>
                          <p className="font-bold text-blue-800 dark:text-blue-200 text-base m-0 leading-snug">
                            {renderFormattedContent(para.replace(">", ""))}
                          </p>
                        </div>
                      );
                    }
                    if (/^\d+\.\s/.test(para)) {
                      const number = para.match(/^\d+\./)?.[0];
                      const text = para.replace(/^\d+\.\s/, "");
                      return (
                        <div key={i} className="flex items-start justify-start gap-2 mb-1">
                          <span className="font-bold text-sm text-slate-700 dark:text-slate-300 shrink-0 mt-[2px]">{number}</span>
                          <p className="text-sm font-bold md:text-base m-0 text-slate-700 dark:text-slate-300 leading-snug">
                            {renderFormattedContent(text)}
                          </p>
                        </div>
                      );
                    }
                    if (para.startsWith(".")) {
                      return (
                        <div key={i} className="flex items-start gap-2 mb-1 ml-4">
                          <span className="text-brand-600 dark:text-brand-400 font-bold text-sm shrink-0 mt-[2px]">•</span>
                          <p className="text-sm md:text-base m-0 text-slate-600 dark:text-slate-400 leading-snug">
                            {renderFormattedContent(para.replace(".", ""))}
                          </p>
                        </div>
                      );
                    }
                    return (
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        key={i} className="mb-2 text-sm md:text-base leading-relaxed"
                      >
                        {renderFormattedContent(para)}
                      </motion.p>
                    );
                  })}
                </div>
                
                {isExercise && (
                   <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.3 }}
                   >
                     <HomeworkSubmission 
                        lessonTitle={selectedLesson.title} 
                        studentName={user?.name || "Anonymous Student"}
                     />
                   </motion.div>
                )}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ y: 50 }} animate={{ y: 0 }}
            className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 md:px-8 shrink-0 sticky bottom-0 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigateLesson("prev")}
                disabled={!hasPrev}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition font-khmer text-sm ${!hasPrev
                    ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:white"
                  }`}
              >
                <ChevronLeft size={18} />
                <span className="hidden sm:inline">មេរៀនមុន</span>
              </motion.button>
              <div className="flex items-center gap-3">
                {hasNext ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => navigateLesson("next")}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition shadow-lg shadow-brand-200 dark:shadow-brand-900/40 text-sm font-khmer bg-brand-600 text-white hover:bg-brand-700 hover:scale-105 active:scale-95"
                  >
                    <span>មេរៀនបន្ទាប់</span>
                    <ChevronRight size={18} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={goBack}
                    className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold font-khmer shadow-lg shadow-green-200 dark:shadow-green-900/40 hover:bg-green-700 transition"
                  >
                    បញ្ចប់វគ្គសិក្សា
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {currentView === AppView.LOGIN ? (
        <LoginPage
          onExit={() => setCurrentView(AppView.DASHBOARD)}
          onSwitchToRegister={() => setCurrentView(AppView.REGISTER)}
        />
      ) : currentView === AppView.REGISTER ? (
        <RegisterPage
          onExit={() => setCurrentView(AppView.DASHBOARD)}
          onSwitchToLogin={() => setCurrentView(AppView.LOGIN)}
        />
      ) : (
        <Layout currentView={currentView} onNavigate={setCurrentView}>
          <AnimatePresence mode="wait">
            {currentView === AppView.DASHBOARD && (
              <motion.div key="dashboard" exit={{ opacity: 0 }}>{renderDashboard()}</motion.div>
            )}
            {currentView === AppView.COURSE_DETAIL && (
              <motion.div key="courseDetail" exit={{ opacity: 0 }}>{renderCourseDetail()}</motion.div>
            )}
            {currentView === AppView.LESSON && (
              <motion.div key="lesson" exit={{ opacity: 0 }}>{renderLesson()}</motion.div>
            )}
            {currentView === AppView.SHORTCUTS && (
              <ShortcutGuide onExit={goBack} />
            )}
            {currentView === AppView.EXERCISES && (
              <ExerciseLibrary onExit={goBack} />
            )}
            {currentView === AppView.PROFILE && <UserProfile onExit={goBack} />}
            {currentView === AppView.ABOUT && <AboutUs />}
            {currentView === AppView.SAVED && (
              <SavedLessons
                onNavigate={setCurrentView}
                onPlayLesson={handlePlaySavedLesson}
              />
            )}
          </AnimatePresence>
        </Layout>
      )}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              alt="Full Screen"
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
            />

            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default App;