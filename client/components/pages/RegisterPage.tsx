import React, { useState } from 'react';
import { BeatLoader } from "react-spinners";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface RegisterPageProps {
  onExit: () => void;
  onSwitchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onExit, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const validateForm = (): boolean => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('សូមបំពេញរាល់ព័ត៌មាន');
      return false;
    }
    if (formData.password.length < 6) {
      setError('ពាក្យសម្ងាត់ត្រូវតែយ៉ាងហោច ៦ តួអក្សរ');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('ពាក្យសម្ងាត់មិនដូចគ្នា');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('អ៊ីមែលមិនត្រឹមត្រូវ');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validateForm()) {
        setIsLoading(false); // កុំភ្លេចបិទ Loading បើ Form ខុស
        return;
    }

    setError('');
    setSuccess('');

    try {
      // ពន្យារពេល 3 វិនាទី (Artificial Delay)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await register(formData.name, formData.email, formData.password);
      setSuccess('ចុះឈ្មោះជោគជ័យ! កំពុងចូលគណនី...');
      
      setTimeout(() => {
        onExit();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 overflow-y-auto">
      
      <div className="min-h-screen flex items-center justify-center p-4 py-8">
        
        <div className="w-full max-w-md animate-slide-up relative">
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-4 md:p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                <div>
                  <img src="/assets/MS.png" alt="Logo" className="w-12 h-12" />
                  </div>
                  <div>
                    <h1 className="text-lg md:text-xl font-bold font-khmer">MY SKILLS</h1>
                    <p className="text-emerald-100 text-xs md:text-sm font-khmer">ចុះឈ្មោះគណនីថ្មី</p>
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

            <div className="p-4 md:p-6 sm:p-8">
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 animate-slide-up">
                  <AlertCircle size={18} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 dark:text-red-300 text-sm font-khmer">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3 animate-slide-up">
                  <CheckCircle size={18} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-green-700 dark:text-green-300 text-sm font-khmer">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-khmer">
                    ឈ្មោះពេញ
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white font-khmer placeholder:text-slate-400 text-sm md:text-base"
                      placeholder="ឈ្មោះរបស់អ្នក"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-khmer">
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
                      className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white font-khmer placeholder:text-slate-400 text-sm md:text-base"
                      placeholder="អ៊ីមែលរបស់អ្នក"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-khmer">
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
                      className="w-full pl-10 pr-12 py-2.5 md:py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white font-khmer placeholder:text-slate-400 text-sm md:text-base"
                      placeholder="យ៉ាងហោច ៦ តួអក្សរ"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-khmer">
                    បញ្ជាក់ពាក្យសម្ងាត់
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-12 py-2.5 md:py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white font-khmer placeholder:text-slate-400 text-sm md:text-base"
                      placeholder="វាយពាក្យសម្ងាត់ម្តងទៀត"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 font-khmer">ពាក្យសម្ងាត់មិនដូចគ្នា</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-3 shadow-lg mt-2 ${
                    isLoading
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <BeatLoader color="#ffffff" size={10} margin={2} />
                      {/* 👇 បានកែត្រង់នេះ */}
                      <span className="font-khmer ml-1">កំពុងផ្ទៀងផ្ទាត់...</span>
                    </>
                  ) : (
                    <>
                      <User size={18} />
                      <span className="font-khmer">ចុះឈ្មោះ</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700 text-center">
                <p className="text-slate-600 dark:text-slate-400 text-sm font-khmer mb-2">
                  មានគណនីរួចហើយ?
                </p>
                <button
                  onClick={onSwitchToLogin}
                  disabled={isLoading}
                  className="text-green-600 dark:text-green-400 font-bold hover:underline text-sm font-khmer px-4 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition"
                >
                  ចូលគណនី
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;