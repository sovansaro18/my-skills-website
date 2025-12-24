import React from 'react';
import { Code, Layout, Database, Github, ExternalLink, Smartphone, Globe, Layers, Cpu, Server } from 'lucide-react';

const PortfolioSection: React.FC = () => {
  const skills = [
    { name: 'HTML5 & CSS3', icon: <Layout size={24} />, level: 'Advanced', color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
    { name: 'JavaScript (ES6+)', icon: <Code size={24} />, level: 'Advanced', color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' },
    { name: 'React.js & TypeScript', icon: <Cpu size={24} />, level: 'Intermediate', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { name: 'Tailwind CSS', icon: <Layers size={24} />, level: 'Advanced', color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' },
    { name: 'Git & GitHub', icon: <Github size={24} />, level: 'Intermediate', color: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800' },
    { name: 'Responsive Design', icon: <Smartphone size={24} />, level: 'Advanced', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
  ];

  const projects = [
    {
      id: 1,
      title: 'E-Learning Platform (MY SkillS)',
      description: 'គេហទំព័រសិក្សាជំនាញកុំព្យូទ័រតាមអនឡាញ មានមុខងាររៀនមេរៀន ធ្វើ Quiz និងប្រព័ន្ធ AI Tutor ។',
      tech: ['React', 'TypeScript', 'Tailwind', 'Node.js'],
      image: '/assets/slide1.jpg',
      link: '#',
      github: '#'
    },
    {
      id: 2,
      title: 'Personal Portfolio Website',
      description: 'គេហទំព័រផ្ទាល់ខ្លួនសម្រាប់បង្ហាញប្រវត្តិរូប និងស្នាដៃ ដែលមានការរចនាបែប Modern និង Dark Mode។',
      tech: ['HTML', 'CSS', 'JavaScript'],
      image: '/assets/slide2.jpg',
      link: '#',
      github: '#'
    },
    {
      id: 3,
      title: 'Task Management App',
      description: 'កម្មវិធីគ្រប់គ្រងការងារប្រចាំថ្ងៃ (To-Do List) អាចបន្ថែម លុប និងកែប្រែបានយ៉ាងងាយស្រួល។',
      tech: ['React', 'Local Storage'],
      image: '/assets/slide3.jpg',
      link: '#',
      github: '#'
    }
  ];

  return (
    <div className="mt-16 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-white dark:bg-slate-800 p-2 rounded-xl text-blue-600 dark:text-blue-400 shadow-sm border border-slate-100 dark:border-slate-700">
            <Code size={24} />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-khmer">Frontend Developer</h1>
            <p className="text-slate-500 dark:text-slate-400 font-khmer text-sm">ជំនាញបច្ចេកទេស និងគម្រោងខ្លះៗដែលខ្ញុំបានអនុវត្ត</p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white font-khmer mb-6 flex items-center gap-2">
            <Server size={20} className="text-brand-600" /> ជំនាញបច្ចេកទេស
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {skills.map((skill, index) => (
                <div key={index} className="bg-none p-4 rounded-xl border border-orange-600/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center">
                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${skill.color}`}>
                        {skill.icon}
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm">{skill.name}</h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">{skill.level}</span>
                </div>
            ))}
        </div>
      </div>

      {/* ផ្នែកគម្រោង (Projects Grid) */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white font-khmer mb-6 flex items-center gap-2">
            <Globe size={20} className="text-brand-600" /> គម្រោងដែលបានអនុវត្ត
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <div key={project.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all group">
                    {/* រូបភាពគម្រោង */}
                    <div className="h-48 overflow-hidden relative">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button className="p-2 bg-white rounded-full text-slate-900 hover:bg-brand-500 hover:text-white transition-colors"><ExternalLink size={20} /></button>
                            <button className="p-2 bg-white rounded-full text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"><Github size={20} /></button>
                        </div>
                    </div>
                    
                    {/* ព័ត៌មានគម្រោង */}
                    <div className="p-5">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{project.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2 font-khmer leading-relaxed">
                            {project.description}
                        </p>
                        
                        {/* Tech Stack Tags */}
                        <div className="flex flex-wrap gap-2">
                            {project.tech.map((t, i) => (
                                <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSection;