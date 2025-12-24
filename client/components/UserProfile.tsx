import React, { useState, useCallback } from 'react';
import { User, Mail, Lock, Save, Camera, CheckCircle, AlertCircle, X } from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { useAuth } from './contexts/AuthContext';

interface UserProfileProps {
  onExit: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onExit }) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState<Blob | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: string, message: string }>({ type: '', message: '' });

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result as string));
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
          setAvatarFile(croppedImageBlob);
          setPreviewUrl(URL.createObjectURL(croppedImageBlob));
          setImageSrc(null); 
      }
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (formData.password && formData.password !== formData.confirmPassword) {
        setStatus({ type: 'error', message: 'ពាក្យសម្ងាត់មិនដូចគ្នាទេ' });
        return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      if (formData.password) data.append('password', formData.password);
      if (avatarFile) data.append('avatar', avatarFile, 'avatar.jpg');

      const token = localStorage.getItem('token');
      const API_URL = "https://my-skills-api.onrender.com";
      const response = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });
      
      const result = await response.json();
      
      if (result.success) {
          setStatus({ type: 'success', message: 'រក្សាទុកជោគជ័យ!' });
          localStorage.setItem('token', result.token);
          setTimeout(() => window.location.reload(), 1000);
      } else {
          setStatus({ type: 'error', message: result.message });
      }

    } catch (error) {
       setStatus({ type: 'error', message: 'បរាជ័យក្នុងការតភ្ជាប់ទៅ Server' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in relative pb-10">
      
      {imageSrc && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center p-4">
           <div className="relative w-full max-w-lg h-[400px] bg-slate-800 rounded-xl overflow-hidden shadow-2xl mb-6">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
           </div>
           
           <div className="flex flex-col items-center gap-4 w-full max-w-xs">
             <input
               type="range"
               value={zoom}
               min={1}
               max={3}
               step={0.1}
               onChange={(e) => setZoom(Number(e.target.value))}
               className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
             />
             <div className="flex gap-4 w-full">
                <button onClick={() => setImageSrc(null)} className="flex-1 px-4 py-2 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-100 transition">បោះបង់</button>
                <button onClick={showCroppedImage} className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition">យល់ព្រម</button>
             </div>
           </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white font-khmer">គណនីរបស់ខ្ញុំ</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            {status.message && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span className="font-khmer text-sm">{status.message}</span>
                </div>
            )}

            <div className="flex flex-col items-center gap-4">
                <div className="relative group cursor-pointer">
                    <img 
                        src={previewUrl || "/assets/default-avatar.png"} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-xl"
                    />
                    <label className="absolute bottom-1 right-1 p-2.5 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition shadow-lg cursor-pointer transform hover:scale-110">
                        <Camera size={18} />
                        <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                    </label>
                </div>
                <p className="text-sm text-slate-500 font-khmer">ចុចលើកាមេរ៉ាដើម្បីប្តូររូប</p>
            </div>

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-khmer">ឈ្មោះ</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><User size={18} /></div>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="block w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-khmer">អ៊ីមែល</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Mail size={18} /></div>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="block w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                            required
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-khmer mb-4">ប្តូរពាក្យសម្ងាត់ (ទុកទំនេរប្រសិនបើមិនចង់ប្តូរ)</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-khmer">ពាក្យសម្ងាត់ថ្មី</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="block w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-brand-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-khmer">បញ្ជាក់ពាក្យសម្ងាត់ថ្មី</label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                className="block w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-brand-500 transition"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
                 <button type="button" onClick={onExit} className="px-6 py-3 rounded-xl border border-slate-300 text-black dark:text-white font-medium hover:bg-slate-50 font-khmer">បោះបង់</button>
                 <button type="submit" disabled={isLoading} className="flex-1 bg-brand-600 text-white py-3 px-6 rounded-xl hover:bg-brand-700 font-bold font-khmer flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30">
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <> <Save size={20} /> <span>រក្សាទុក</span> </>}
                 </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;