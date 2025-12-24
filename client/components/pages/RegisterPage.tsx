import React, { useState } from 'react';
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
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <img src="/assets/web2.png" alt="Logo" className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-khmer">MY SkillS</h1>
                  <p className="text-emerald-100 text-sm font-khmer">ចុះឈ្មោះគណនីថ្មី</p>
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

            {success && (
              <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3 animate-slide-up">
                <CheckCircle size={18} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-green-700 dark:text-green-300 text-sm font-khmer">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white font-khmer placeholder:text-slate-400"
                    placeholder="ឈ្មោះរបស់អ្នក"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white font-khmer placeholder:text-slate-400"
                    placeholder="អ៊ីមែលរបស់អ្នក"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-12 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white font-khmer placeholder:text-slate-400"
                    placeholder="យ៉ាងហោច ៦ តួអក្សរ"
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
              </div>

              <div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-12 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white font-khmer placeholder:text-slate-400"
                    placeholder="វាយពាក្យសម្ងាត់ម្តងទៀត"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
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
                className={`w-full py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-3 shadow-lg ${
                  isLoading
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 hover:shadow-xl active:scale-[0.98]'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-khmer">កំពុងចុះឈ្មោះ...</span>
                  </>
                ) : (
                  <>
                    <User size={18} />
                    <span className="font-khmer">ចុះឈ្មោះ</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
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

            <p className="text-center text-xs text-slate-500 dark:text-slate-500 mt-6 font-khmer leading-relaxed">
              ដោយចុះឈ្មោះ អ្នកយល់ព្រមជាមួយ
              <button className="text-green-600 dark:text-green-400 hover:underline mx-1">
                លក្ខខណ្ឌសេវាកម្ម
              </button>
              និង
              <button className="text-green-600 dark:text-green-400 hover:underline ml-1">
                គោលការណ៍ភាពឯកជន
              </button>
              របស់យើង។
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;