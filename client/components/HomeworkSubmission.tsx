import React, { useState } from 'react';
import { Send, UploadCloud, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface HomeworkSubmissionProps {
  lessonTitle: string;
  studentName?: string;
}

const HomeworkSubmission: React.FC<HomeworkSubmissionProps> = ({ lessonTitle, studentName }) => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const BOT_TOKEN = '8182910549:AAEpukzpY-HFIDlrCRR5CdaQ2Te_ckq2g40';
  const CHAT_ID = '8399209514';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus('sending');

    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    const captionText = `
🆕 *បានទទួលកិច្ចការថ្មី!*
👤 សិស្ស: ${studentName || 'Unknown User'}
🗁 មេរៀន: ${lessonTitle}
💬 សារ: ${message || 'គ្មាន'}
    `;
    formData.append('caption', captionText);
    formData.append('document', file);

    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.ok) {
        setStatus('success');
        setFile(null);
        setMessage('');
      } else {
        console.error('Telegram Error:', data);
        setStatus('error');
      }
    } catch (error) {
      console.error('Network Error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm">
      <h3 className="text-lg font-bold font-khmer text-blue-900 dark:text-white mb-4 flex items-center gap-2">
        <UploadCloud className="text-blue-600" />
        បញ្ជូនលំហាត់អនុវត្ត (Submit Excercise)
      </h3>

      {status === 'success' ? (
        <div className="text-center py-8 text-green-600 animate-fade-in">
          <CheckCircle size={48} className="mx-auto mb-3" />
          <p className="font-bold font-khmer">កិច្ចការរបស់អ្នកត្រូវបានបញ្ជូនទៅកាន់គ្រូដោយជោគជ័យ!</p>
          <button 
            onClick={() => setStatus('idle')}
            className="mt-4 text-sm underline text-slate-500 hover:text-slate-700"
          >
            ផ្ញើម្ដងទៀត
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              accept=".docx,.doc,.pdf,.xlsx,.pptx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            {file ? (
              <div className="flex items-center justify-center gap-2 text-blue-600 font-medium">
                <FileText size={20} />
                {file.name}
              </div>
            ) : (
              <div className="text-slate-500 dark:text-slate-400">
                <p className="font-khmer font-bold mb-1">ចុចទីនេះដើម្បីជ្រើសរើសឯកសារ</p>
                <p className="text-xs">Word, Excel, PowerPoint, ឬ PDF</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 font-khmer">ពណ៌នា</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="និយាយ........."
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={2}
            />
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              <XCircle size={16} />
              <span>មានបញ្ហាក្នុងការផ្ញើ សូមព្យាយាមម្តងទៀត ឬឆែកអ៊ីនធឺណិត។</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!file || status === 'sending'}
            className={`w-full py-3 rounded-xl font-bold font-khmer flex items-center justify-center gap-2 transition-all
              ${!file || status === 'sending' 
                ? 'bg-slate-300 cursor-not-allowed text-slate-500' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20'
              }
            `}
          >
            {status === 'sending' ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                កំពុងផ្ញើ...
              </>
            ) : (
              <>
                <Send size={20} />
                ផ្ញើកិច្ចការ
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default HomeworkSubmission;