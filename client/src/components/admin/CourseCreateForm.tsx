import React, { useState, useEffect } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Course } from '../../types';

interface CourseFormProps {
  courseToEdit?: Course | null; // ទទួលវគ្គសិក្សាមកកែ (បើមាន)
  onCancel?: () => void;        // សម្រាប់ចុច Cancel
  onSuccess?: () => void;       // ប្រាប់ទៅក្រៅថាជោគជ័យហើយ (ដើម្បី Refresh តារាង)
}

const CourseCreateForm: React.FC<CourseFormProps> = ({ courseToEdit, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    level: 'Beginner'
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // 🔥 ពេលមាន courseToEdit មកដល់ ត្រូវបំពេញទិន្នន័យចូល Form វិញ
  useEffect(() => {
    if (courseToEdit) {
      setFormData({
        title: courseToEdit.title,
        description: courseToEdit.description,
        price: courseToEdit.price,
        level: courseToEdit.level
      });
      setPreviewUrl(courseToEdit.imageUrl || null); // បង្ហាញរូបចាស់
    } else {
      // បើអត់មាន (គឺបង្កើតថ្មី) Reset Form
      setFormData({ title: '', description: '', price: 0, level: 'Beginner' });
      setPreviewUrl(null);
    }
  }, [courseToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price.toString());
      data.append('level', formData.level);
      
      // ផ្ញើរូបតែពេលមានការប្តូររូបថ្មីប៉ុណ្ណោះ
      if (thumbnail) {
        data.append('thumbnail', thumbnail);
      }

      // 🔥 ពិនិត្យមើល៖ បើមាន ID គឺ Update (PUT), បើអត់មានគឺ Create (POST)
      const url = courseToEdit 
        ? `https://my-skills-api.onrender.com/api/courses/${courseToEdit.id}`
        : 'https://my-skills-api.onrender.com/api/courses';
      
      const method = courseToEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const result = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', text: courseToEdit ? 'កែប្រែជោគជ័យ!' : 'បង្កើតជោគជ័យ!' });
        
        if (!courseToEdit) {
          // បើបង្កើតថ្មី Reset Form
          setFormData({ title: '', description: '', price: 0, level: 'Beginner' });
          setThumbnail(null);
          setPreviewUrl(null);
        }

        // ហៅ function ខាងក្រៅឱ្យ Refresh List
        if (onSuccess) onSuccess();
      } else {
        setStatus({ type: 'error', text: result.message || 'មានបញ្ហា' });
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', text: 'បរាជ័យក្នុងការភ្ជាប់ទៅ Server' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white font-khmer">
          {courseToEdit ? 'កែប្រែវគ្គសិក្សា' : 'បង្កើតវគ្គសិក្សាថ្មី'}
        </h3>
        {courseToEdit && onCancel && (
          <button onClick={onCancel} className="text-sm text-red-500 hover:text-red-700 font-khmer">
            បោះបង់ (Cancel)
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 font-khmer mb-2">ចំណងជើងវគ្គសិក្សា</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border text-slate-700 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-khmer focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
            placeholder="សរសេរចំណងជើងវគ្គសិក្សានេះ..."
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 font-khmer mb-2">ការពិពណ៌នា</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 rounded-xl border text-slate-700 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-khmer focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
            placeholder="សរសេរលម្អិតអំពីវគ្គសិក្សានេះ..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Price */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 font-khmer mb-2">តម្លៃ ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              className="w-full p-3 rounded-xl text-slate-700 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-khmer focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
            />
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 font-khmer mb-2">កម្រិត</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border text-slate-700 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-khmer focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
            >
              <option value="Beginner">Beginner (ដំបូង)</option>
              <option value="Intermediate">Intermediate (មធ្យម)</option>
              <option value="Advanced">Advanced (កម្រិតខ្ពស់)</option>
            </select>
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 font-khmer mb-2">រូបភាពតំណាង (Thumbnail)</label>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer relative">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {previewUrl ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={(e) => { e.preventDefault(); setThumbnail(null); setPreviewUrl(null); }}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-lg hover:bg-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <Upload className="mx-auto h-10 w-10 text-slate-400 mb-2" />
                <p className="text-sm text-slate-500 font-khmer">ចុចដើម្បីជ្រើសរើសរូបភាពថ្មី</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, GIF up to 5MB</p>
              </div>
            )}
          </div>
        </div>

        {status && (
          <div className={`p-4 rounded-xl flex items-center gap-3 font-khmer ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {status.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 text-white rounded-xl font-bold font-khmer flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed
            ${courseToEdit ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}
          `}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              កំពុង{courseToEdit ? 'កែប្រែ' : 'បង្កើត'}...
            </>
          ) : (
             courseToEdit ? 'រក្សាទុកការកែប្រែ' : 'បង្កើតវគ្គសិក្សា'
          )}
        </button>
      </form>
    </div>
  );
};

export default CourseCreateForm;