import React from 'react';
import { Info, Code, Heart, Globe, Database, Server } from 'lucide-react';
import Snowfall from 'react-snowfall';


const AboutUs: React.FC = () => {
  return (
    
    <div className="max-w-4xl mx-auto animate-fade-in space-y-8 pb-10">
      <Snowfall color="#82C3D9" />
      <div className="text-center space-y-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-khmer">
          អំពីគម្រោង <span className="text-brand-600 dark:text-brand-400">MY SkillS</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-khmer text-justify text-lg leading-relaxed">
          វេបសាយនេះបង្កើតឡើយដោយមានគោលបំណងអនុវត្តន៍ចំណេះដឹងផ្នែកកុំព្យូទ័រជាពិសេសក្នុងការប្រើប្រាស់កម្មវិធី Microsoft Office ដូចជា Word, Excel និង PowerPoint។ គម្រោងនេះមានគោលបំណងជួយឱ្យអ្នកសិក្សាអាចទទួលបានចំណេះដឹងដែលមានគុណភាព និងអាចយកទៅប្រើប្រាស់បានពិតប្រាកដក្នុងជីវិតប្រចាំថ្ងៃ និងការងារ។
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className=" border-orange-500/50 bg-orange-400/10   p-8 md:p-12 dark:text-white text-slate-500 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
            <Info size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white font-khmer mb-3">គោលបំណង</h3>
          <p className="text-slate-600 dark:text-slate-400 font-khmer leading-relaxed">
            ផ្តល់នូវមេរៀនដែលមានគុណភាព ងាយស្រួលយល់ និងអនុវត្តតាម រួមជាមួយប្រព័ន្ធធ្វើតេស្ត និងលំហាត់អនុវត្តជាក់ស្តែង ដើម្បីធានាថាអ្នកសិក្សាអាចយកទៅប្រើប្រាស់ក្នុងការងារបានពិតប្រាកដ។
          </p>
        </div>

        <div className=" border-orange-500/50 bg-orange-400/10  p-8 md:p-12 dark:text-white text-slate-500 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6">
            <Heart size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white font-khmer mb-3">គុណតម្លៃ</h3>
          <p className="text-slate-600 dark:text-slate-400 font-khmer leading-relaxed">
            យើងជឿជាក់ថា ការចែករំលែកចំណេះដឹងគឺជាការចូលរួមចំណែកអភិវឌ្ឍន៍សង្គមជាតិ។ រាល់មេរៀនត្រូវបានរៀបចំឡើងដោយយកចិត្តទុកដាក់ និងឥតគិតថ្លៃសម្រាប់អ្នកសិក្សាទូទៅ។
          </p>
        </div>
      </div>

      <div className="border border-orange-500/50 bg-orange-400/10  rounded-3xl p-8 md:p-12 dark:text-white text-slate-500 shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-10">
            <Code size={200} />
        </div>
        
        <div className="relative z-10">
            <h3 className="text-2xl font-bold font-khmer mb-6">បច្ចេកវិទ្យាដែលបានប្រើប្រាស់លើវេបសាយនេះ</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-orange-300/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                    <Globe className="mb-3 text-blue-300" />
                    <div className="font-bold">React + Vite</div>
                    <div className="text-xs text-blue-100 opacity-80">Frontend</div>
                </div>
                <div className="bg-orange-300/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                    <Server className="mb-3 text-green-300" />
                    <div className="font-bold">Node.js + Express</div>
                    <div className="text-xs text-blue-100 opacity-80">Backend API</div>
                </div>
                <div className="bg-orange-300/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                    <Database className="mb-3 text-yellow-300" />
                    <div className="font-bold">MongoDB</div>
                    <div className="text-xs text-blue-100 opacity-80">Database</div>
                </div>
                <div className="bg-orange-300/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                    <Code className="mb-3 text-purple-300" />
                    <div className="font-bold">Tailwind CSS</div>
                    <div className="text-xs text-blue-100 opacity-80">Styling</div>
                </div>
            </div>
        </div>
      </div>

      {/* Developer Section */}
      <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400 font-khmer text-sm">
            បង្កើតឡើងដោយ <span className="font-bold text-slate-800 dark:text-white">ភិក្ខុ សុវណ្ណសរោ រីម រ៉ាវី</span>
        </p>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">
            © 2025 MY SkillS. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;