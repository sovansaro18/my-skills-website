import React, { useState, useEffect, useMemo } from 'react';
import { Star, Send, MessageSquare, Heart, Quote, User, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Feedback {
  _id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

const FeedbackList: React.FC = () => {
  const { user } = useAuth();
  
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [rating, setRating] = useState(0); 
  const [hoverRating, setHoverRating] = useState(0); 
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  });

  const API_URL = "https://my-skills-api.onrender.com";

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/feedback`);
      const data = await res.json();
      if (data.success) {
        setFeedbacks(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showToast('សូមចូលគណនីជាមុនសិន!', 'error');
      return;
    }
    if (rating === 0) {
      showToast('សូមមេត្តាដាក់ពិន្ទុផ្កាយជាមុនសិន!', 'error');
      return;
    }
    if (!comment.trim()) {
      showToast('សូមសរសេរមតិរបស់អ្នក!', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });
      
      const data = await res.json();

      if (data.success) {
        setFeedbacks([data.data, ...feedbacks]);
        setComment('');
        setRating(0);
        showToast('អ្នកបានបញ្ចេញមតិ!', 'success');
      } else {
        showToast(data.message || 'មានបញ្ហាក្នុងការបញ្ជូនមតិ', 'error'); 
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showToast('បរាជ័យក្នុងការភ្ជាប់ទៅកាន់ Server', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = useMemo(() => {
    if (feedbacks.length === 0) return 0;
    const total = feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
    return (total / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  const renderStars = (currentRating: number, interactive = false, size = 16) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? 'cursor-pointer transition-transform hover:scale-110 focus:outline-none' : 'cursor-default'}`}
          >
            <Star
              size={size}
              className={`transition-colors duration-200 ${
                star <= (interactive ? (hoverRating || rating) : currentRating)
                  ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8 mb-16 space-y-8 animate-fade-in pb-20 relative">
      
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            
            className={`fixed top-24 left-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md min-w-[300px]
              ${toast.type === 'success' 
                ? 'bg-green-50/90 dark:bg-green-900/90 border-green-200 dark:border-green-700 text-green-800 dark:text-green-100' 
                : 'bg-red-50/90 dark:bg-red-900/90 border-red-200 dark:border-red-700 text-red-800 dark:text-red-100'
              }`}
          >
            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="font-khmer text-sm flex-1">{toast.message}</span>
            <button 
              onClick={() => setToast(prev => ({ ...prev, show: false }))}
              className="p-1 hover:bg-black/5 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-gradient-to-br from-green-600 to-emerald-700 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Heart size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold font-khmer mb-1 flex items-center justify-center md:justify-start gap-2">
                    <MessageSquare size={24} className="text-green-100 dark:text-brand-200" /> មតិយោបល់ពីអ្នកប្រើប្រាស់
                </h2>
                <p className="text-green-50 dark:text-slate-300 font-khmer opacity-90 text-sm">
                  ចែករំលែកបទពិសោធន៍របស់អ្នកជាមួយយើង
                </p>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
                <div className="text-center">
                    <div className="text-2xl font-bold">{averageRating}</div>
                    <div className="flex text-yellow-300">
                        <Star size={12} className="fill-current" />
                    </div>
                </div>
                <div className="h-8 w-px bg-white/20"></div>
                <div className="text-left">
                    <div className="text-lg font-bold">{feedbacks.length}</div>
                    <div className="text-xs text-green-50 dark:text-slate-300 font-khmer">មតិសរុប</div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="lg:col-span-4 lg:sticky lg:top-24 order-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-base text-slate-800 dark:text-white font-khmer flex items-center gap-2">
                        <Sparkles size={16} className="text-yellow-500" /> មតិ និងការវាយតម្លៃ
                    </h3>
                </div>
                
                <div className="p-4">
                    {user ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5 text-center">
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 font-khmer">
                                  ដាក់ពិន្ទុផ្កាយ
                                </label>
                                <div className="flex justify-center p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                                    {renderStars(rating, true, 28)}
                                </div>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 font-khmer">
                                  មតិ
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="សរសេរមតិរបស់អ្នក..."
                                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent outline-none resize-none h-28 font-khmer text-sm"
                                    required
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full py-2.5 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-lg font-bold font-khmer text-sm shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                            >
                                {isSubmitting ? 'កំពុងបញ្ជូន...' : <><Send size={16} /> បញ្ជូនមតិ</>}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                                <User size={24} />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-khmer text-xs">
                              សូមចូលគណនីជាមុនសិន
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="lg:col-span-8 order-2">
            <h3 className="font-bold text-base text-slate-800 dark:text-white font-khmer mb-4 px-1">
               មតិថ្មីៗ ({feedbacks.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    [1, 2, 3, 4].map((n) => (
                        <div key={n} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse h-32">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : feedbacks.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                        <MessageSquare size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-slate-400 text-sm font-khmer">មិនទាន់មានមតិយោបល់នៅឡើយទេ</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {feedbacks.map((fb) => (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                key={fb._id} 
                                className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col h-full"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="shrink-0 relative">
                                        <img 
                                            src={fb.user?.avatar || '/assets/Avatar.png'} 
                                            alt={fb.user?.name} 
                                            className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-slate-600"
                                            onError={(e) => { e.currentTarget.src = "/assets/Avatar.png"; }}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-white font-khmer text-sm line-clamp-1">
                                            {fb.user?.name || 'Unknown User'}
                                        </h4>
                                        <div className="flex items-center gap-1.5">
                                            {renderStars(fb.rating, false, 12)}
                                            <span className="text-[10px] text-slate-400 font-mono">
                                                • {new Date(fb.createdAt).toLocaleDateString('km-KH')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg rounded-tl-none grow">
                                    <p className="text-slate-600 dark:text-slate-300 text-sm font-khmer leading-relaxed whitespace-pre-wrap break-words">
                                        {fb.comment}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackList;