import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const CourseCreateForm: React.FC = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      setPreviewUrl(URL.createObjectURL(file)); // បង្ហាញរូប Preview
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const token = localStorage.getItem('token');
      
      // ប្រើ FormData ព្រោះយើងត្រូវផ្ញើ File (រូបភាព)
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price.toString());
      data.append('level', formData.level);
      if (thumbnail) {
        data.append('thumbnail', thumbnail);
      }

      // សូមប្តូរ URL ទៅតាម Server របស់បង (Render ឬ Localhost)
      const res = await fetch('https://my-skills-api.onrender.com/api/courses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // ចំណាំ: មិនបាច់ដាក់ 'Content-Type': 'application/json' ទេពេលប្រើ FormData
        },
        body: data
      });

      const result = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', text: 'បង្កើតវគ្គសិក្សាជោគជ័យ!' });
        // Reset Form
        setFormData({ title: '', description: '', price: 0, level: 'Beginner' });
        setThumbnail(null);
        setPreviewUrl(null);
      } else {
        setStatus({ type: 'error', text: result.message || 'មានបញ្ហាក្នុងការបង្កើត' });
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
      <h3 className="text-xl font-bold text-slate-800 dark:text-white font-khmer mb-6">បង្កើតវគ្គសិក្សាថ្មី</h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 font-khmer mb-2">ចំណងជើងវគ្គសិក្សា</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-khmer focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
            placeholder="ឧ. រៀនសរសេរកូដ React បឋម"
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
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-khmer focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
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
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-khmer focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
            />
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 font-khmer mb-2">កម្រិត</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-khmer focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
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
              required
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
                <p className="text-sm text-slate-500 font-khmer">ចុចដើម្បីជ្រើសរើសរូបភាព</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, GIF up to 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Status Message */}
        {status && (
          <div className={`p-4 rounded-xl flex items-center gap-3 font-khmer ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {status.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold font-khmer flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              កំពុងបង្កើត...
            </>
          ) : (
            'បង្កើតវគ្គសិក្សា'
          )}
        </button>
      </form>
    </div>
  );
};

export default CourseCreateForm;