import React, { useState, useEffect } from 'react';
import { Star, Send, MessageSquare, User } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

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

const FeedbackList: React.FC = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/feedback');
      const data = await res.json();
      if (data.success) {
        setFeedbacks(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        alert('សូមចូលគណនីដើម្បីបញ្ចេញមតិ!'); 
        return;
    }
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/feedback', {
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
        setRating(1);
      } else {
        alert('មានបញ្ហាក្នុងការបញ្ជូនមតិ');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (count: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star
              size={interactive ? 24 : 16}
              className={`${
                star <= count 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 mt-12 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-white dark:bg-slate-800 p-2 rounded-xl text-yellow-500 shadow-sm border border-slate-100 dark:border-slate-700">
            <MessageSquare size={20} />
        </div>
        <h2 className="text-xl text-slate-800 dark:text-white font-khmer">សូមបញ្ចេញមតិយោបល់!</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 sticky top-24">
                <h3 className=" text-slate-800 dark:text-white font-khmer mb-4">តើអ្នកយល់យ៉ាងណាដែរចំពោះវេបសាយនេះ?</h3>
                
                {user ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex justify-center mb-4">
                            {renderStars(rating, true)}
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="សរសេរមតិរបស់អ្នកនៅទីនេះ..."
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none h-32 font-khmer"
                            required
                        />
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full py-2.5 bg-brand-600 text-white rounded-xl font-bold font-khmer hover:bg-brand-700 transition flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? 'កំពុងផ្ញើ...' : <><Send size={16} /> បញ្ជូនមតិ</>}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        <p className="text-slate-500 dark:text-slate-400 font-khmer text-sm mb-2">សូមចូលគណនីដើម្បីវាយតម្លៃ</p>
                    </div>
                )}
            </div>
        </div>

        <div className="md:col-span-2 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            {loading ? (
                <div className="text-center py-10 text-slate-400 font-khmer">កំពុងទាញយកទិន្នន័យ...</div>
            ) : feedbacks.length === 0 ? (
                <div className="text-center py-10 text-slate-400 font-khmer bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">មិនទាន់មានមតិយោបល់នៅឡើយទេ</div>
            ) : (
                feedbacks.map((fb) => (
                    <div key={fb._id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <img 
                                src={fb.user?.avatar || '/assets/default-avatar.png'} 
                                alt={fb.user?.name} 
                                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-600"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white font-khmer text-sm">{fb.user?.name || 'Unknown User'}</h4>
                                        <div className="mt-0.5">{renderStars(fb.rating)}</div>
                                    </div>
                                    <span className="text-xs text-slate-400 font-mono">
                                        {new Date(fb.createdAt).toLocaleDateString('km-KH')}
                                    </span>
                                </div>
                                <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm font-khmer leading-relaxed">
                                    {fb.comment}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackList;