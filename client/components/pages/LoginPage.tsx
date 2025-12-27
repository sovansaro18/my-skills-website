import React, { useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { Mail, Lock, LogIn, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
  onExit: () => void;
  onSwitchToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onExit, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('សូមបំពេញរាល់ព័ត៌មាន');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      onExit();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <img src="/assets/MS.png" alt="Logo" className="w-12 h-12" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-khmer">MY SkillS</h1>
                  <p className="text-brand-100 text-sm font-khmer">សូមចូលគណនីរបស់អ្នក</p>
                </div>
              </div>
              <button
                onClick={onExit}
                className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
                title="បិទ"
              >
                <ArrowLeft size={20} />
              </button>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 animate-slide-up">
                <AlertCircle size={18} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-300 text-sm font-khmer">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 font-khmer">
                  អ៊ីមែល
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:text-white font-khmer placeholder:text-slate-400"
                    placeholder="អ៊ីមែលរបស់អ្នក"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 font-khmer">
                  ពាក្យសម្ងាត់
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-12 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:text-white font-khmer placeholder:text-slate-400"
                    placeholder="ពាក្យសម្ងាត់របស់អ្នក"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-khmer">
                  យ៉ាងហោច ៦ តួអក្សរ
                </p>
              </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-3 shadow-lg ${
                      isLoading
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 hover:shadow-xl active:scale-[0.98]'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <BeatLoader color="#ffffff" size={10} margin={2} />
                        <span className="font-khmer ml-1">កំពុងផ្ទៀងផ្ទាត់...</span>
                      </>
                    ) : (
                      <>
                        <LogIn size={18} />
                        <span className="font-khmer">ចូលគណនី</span>
                      </>
                    )}
                  </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
              <p className="text-slate-600 dark:text-slate-400 text-sm font-khmer mb-2">
                មិនទាន់មានគណនីទេ?
              </p>
              <button
                onClick={onSwitchToRegister}
                disabled={isLoading}
                className="text-brand-600 dark:text-brand-400 font-bold hover:underline text-sm font-khmer px-4 py-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition"
              >
                ចុះឈ្មោះឥឡូវនេះ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;