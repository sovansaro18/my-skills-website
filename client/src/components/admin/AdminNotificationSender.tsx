import React, { useState } from 'react';
import { Send, Bell, CheckCircle, AlertCircle } from 'lucide-react';

const AdminNotificationSender: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('lesson');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type, title, message })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', text: `ជោគជ័យ! ${data.message}` });
        setTitle('');
        setMessage('');
      } else {
        setStatus({ type: 'error', text: data.message || 'មានបញ្ហាក្នុងការផ្ញើ' });
      }
    } catch (error) {
      setStatus({ type: 'error', text: 'បរាជ័យក្នុងការភ្ជាប់ទៅ Server' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 mt-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
            <Bell className="text-blue-600 dark:text-blue-400" size={24} />
        </div>
        <h2 className="text-xl font-bold font-khmer text-slate-800 dark:text-white">បង្កើតការជូនដំណឹង</h2>
      </div>

      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 font-khmer mb-1">ប្រភេទ</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-khmer focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="lesson">មេរៀនថ្មី (Lesson)</option>
            <option value="homework">កិច្ចការផ្ទះ (Homework)</option>
            <option value="system">ដំណឹងទូទៅ (System)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 font-khmer mb-1">ចំណងជើង</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ឧ. មេរៀន Word ថ្មីបានដាក់បញ្ចូលហើយ!"
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-khmer focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 font-khmer mb-1">ខ្លឹមសារ</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="សរសេរខ្លឹមសារលម្អិតនៅទីនេះ..."
            rows={4}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-khmer focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            required
          />
        </div>

        {status && (
          <div className={`p-3 rounded-lg flex items-center gap-2 font-khmer text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {status.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold font-khmer flex items-center justify-center gap-2 transition-all disabled:opacity-70"
        >
          {loading ? 'កំពុងផ្ញើ...' : <><Send size={18} /> ផ្ញើជូនដំណឹង</>}
        </button>
      </form>
    </div>
  );
};

export default AdminNotificationSender;