import React, { useState, useCallback } from 'react';
import { BeatLoader } from "react-spinners";
import Cropper from 'react-easy-crop'; 
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle, Camera, X, Check } from 'lucide-react';
import { useAuth } from '../components/contexts/AuthContext';
import getCroppedImg from '../utils/cropImage'; 

interface RegisterPageProps {
  onExit: () => void;
  onSwitchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onExit, onSwitchToLogin }) => {
  const { setAuth } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '' 
  });

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
          setError('រូបភាពធំពេក (ត្រូវក្រោម 5MB)');
          return;
      }

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string);
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) return;
      
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      if (croppedImageBlob) {
        const reader = new FileReader();
        reader.readAsDataURL(croppedImageBlob); 
        reader.onloadend = () => {
            const base64data = reader.result as string;
            setFormData(prev => ({ ...prev, avatar: base64data }));
            setIsCropping(false);
            setImageSrc(null); 
        };
      }
    } catch (e) {
      console.error(e);
      setError('មានបញ្ហាក្នុងការកាត់រូបភាព');
    }
  }, [imageSrc, croppedAreaPixels]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
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
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    
    try {
    const res = await fetch('https://my-skills-api.onrender.com/api/auth/register', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          avatar: formData.avatar
      }),
    });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'ការចុះឈ្មោះបរាជ័យ');
      }
      
      const token = data.token || data.data?.token;
      const user = data.user || data.data?.user;

      if (token && user) {
        setAuth(token, user);

        setSuccess('ចុះឈ្មោះជោគជ័យ! កំពុងចូលគណនី...');
        
        setTimeout(() => {
            onExit(); 
        }, 1500);

      } else {
        setError('មិនទទួលបានទិន្នន័យបញ្ជាក់ការចុះឈ្មោះទេ។');
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ Server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 overflow-y-auto">
      
      {isCropping && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-lg font-khmer text-slate-800 dark:text-white">កាត់តរូបភាព</h3>
              <button onClick={() => setIsCropping(false)} className="text-slate-500 hover:text-red-500">
                <X size={24} />
              </button>
            </div>
            
            <div className="relative flex-1 bg-slate-900">
              <Cropper
                image={imageSrc || ''}
                crop={crop}
                zoom={zoom}
                aspect={1} 
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round" 
                showGrid={false}
              />
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 space-y-4">
               <div className="flex items-center gap-2">
                 <span className="text-xs font-khmer text-slate-500">Zoom:</span>
                 <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                 />
               </div>
               <button
                  onClick={showCroppedImage}
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold font-khmer flex justify-center items-center gap-2"
               >
                 <Check size={18} />
                 យល់ព្រម
               </button>
            </div>
          </div>
        </div>
      )}
      
      {/* ============ REGISTER FORM ============ */}
      <div className="min-h-screen flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md animate-slide-up relative">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-4 md:p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div><img src="/assets/logo/MS.png" alt="Logo" className="w-12 h-12" /></div>
                  <div>
                    <h1 className="text-lg md:text-xl font-bold font-khmer">MY SKILLS</h1>
                    <p className="text-emerald-100 text-xs md:text-sm font-khmer">ចុះឈ្មោះគណនីថ្មី</p>
                  </div>
                </div>
                <button onClick={onExit} className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition"><ArrowLeft size={20} /></button>
              </div>
            </div>

            <div className="p-4 md:p-6 sm:p-8">
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-600 dark:text-red-400 mt-0.5" />
                  <p className="text-red-700 dark:text-red-300 text-sm font-khmer">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
                  <CheckCircle size={18} className="text-green-600 dark:text-green-400 mt-0.5" />
                  <p className="text-green-700 dark:text-green-300 text-sm font-khmer">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Profile Upload UI */}
                <div className="flex justify-center mb-6">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full border-4 border-slate-100 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                            {formData.avatar ? (
                                <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-slate-400" />
                            )}
                        </div>
                        <label 
                            className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-110 active:scale-95"
                        >
                            <Camera size={16} />
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                                className="hidden" 
                            />
                        </label>
                    </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-khmer">ឈ្មោះពេញ</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white font-khmer focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="ឈ្មោះរបស់អ្នក" disabled={isLoading} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-khmer">អ៊ីមែល</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white font-khmer focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="អ៊ីមែលរបស់អ្នក" disabled={isLoading} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-khmer">ពាក្យសម្ងាត់</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required minLength={6} className="w-full text-slate-700 pl-10 pr-12 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white font-khmer focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="យ៉ាងហោច ៦ តួអក្សរ" disabled={isLoading} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 p-1" disabled={isLoading}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-khmer">បញ្ជាក់ពាក្យសម្ងាត់</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength={6} className="w-full pl-10 pr-12 py-3 rounded-lg border text-slate-700 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white font-khmer focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="វាយពាក្យសម្ងាត់ម្តងទៀត" disabled={isLoading} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 p-1" disabled={isLoading}>
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-3 shadow-lg mt-2 ${
                    isLoading ? 'bg-slate-400' : 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800'
                  }`}
                >
                  {isLoading ? <BeatLoader color="#ffffff" size={10} /> : <span className="font-khmer">ចុះឈ្មោះ</span>}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700 text-center">
                <p className="text-slate-600 dark:text-slate-400 text-sm font-khmer mb-2">មានគណនីរួចហើយ?</p>
                <button onClick={onSwitchToLogin} disabled={isLoading} className="text-green-600 dark:text-green-400 font-bold hover:underline text-sm font-khmer">ចូលគណនី</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;