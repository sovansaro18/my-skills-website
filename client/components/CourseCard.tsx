import React from 'react';
import { Course } from '../types';
import { BookOpen, BarChart } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {

  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);

  return (
    <div 
      onClick={onClick}
      className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col h-full relative"
    >
      <div className={`h-32 md:h-48 ${course.color} relative p-2 md:p-4 flex items-center justify-center overflow-hidden`}>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
         
         <img 
          src={course.imageUrl} 
          alt={course.title}
          className="w-20 h-20 md:w-32 md:h-32 object-contain relative z-10 drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20">
            <span className="text-[9px] md:text-[10px] font-bold text-slate-900 bg-white/90 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-sm uppercase tracking-wide">
                {course.level}
            </span>
        </div>
      </div>
      
      <div className="p-2 md:p-4 flex-1 flex flex-col">
        <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white mb-1.5 md:mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors font-khmer line-clamp-1">
            {course.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm mb-4 md:mb-6 line-clamp-2 leading-relaxed font-khmer flex-1">
          {course.description}
        </p>
        
        <div className="flex items-start md:items-center gap-2 md:gap-4 text-[10px] md:text-xs font-medium text-slate-500 dark:text-slate-400 pt-3 md:pt-4 border-t border-slate-300/70 dark:border-slate-700/50">
          
        <div className="flex justify-between items-center gap-1.5 w-full md:w-auto">
              {/* ផ្នែកចំនួន Module */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md">
                <BarChart size={10} className="text-slate-600 dark:text-slate-400 md:w-3 md:h-3" />
                <span className="text-[9px] md:text-[10px] font-medium font-khmer">{course.modules.length} ផ្នែក</span>
              </div>
              
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md">
                <BookOpen size={10} className="text-slate-600 dark:text-slate-400 md:w-3 md:h-3" />
                <span className="text-[9px] md:text-[10px] font-medium font-khmer">{totalLessons} មេរៀន</span>
              </div>
          </div>
          
        </div>
      </div>

    </div>
  );
};

export default CourseCard;