import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Video, Loader2, AlertCircle } from 'lucide-react';
import { Course } from '../../types';

// 👇 ថែម Props សម្រាប់ទទួលបញ្ជា
interface AdminCourseListProps {
  onEdit: (course: Course) => void;
  refreshKey: number; // សម្រាប់បង្ខំឱ្យ Refresh តារាង
}

const AdminCourseList: React.FC<AdminCourseListProps> = ({ onEdit, refreshKey }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    setLoading(true); // បង្ហាញ Loading ពេល Refresh
    try {
      const res = await fetch('https://my-skills-api.onrender.com/api/courses');
      const data = await res.json();
      if (data.success) {
        const formattedCourses = data.data.map((c: any) => ({
          ...c,
          id: c._id,
          imageUrl: c.thumbnail
        }));
        setCourses(formattedCourses);
      } else {
        setError('មិនអាចទាញយកទិន្នន័យបាន');
      }
    } catch (err) {
      setError('មានបញ្ហាក្នុងការភ្ជាប់ទៅ Server');
    } finally {
      setLoading(false);
    }
  };

  // ពេល refreshKey ប្តូរ (មានន័យថាគេ Create ឬ Edit ចប់) យើងទាញទិន្នន័យម្តងទៀត
  useEffect(() => {
    fetchCourses();
  }, [refreshKey]);

  // Function លុប (រក្សាទុកដដែល)
  const handleDelete = async (id: string) => {
    if (!window.confirm('តើបងពិតជាចង់លុបវគ្គសិក្សានេះមែនទេ?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://my-skills-api.onrender.com/api/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCourses(courses.filter(course => course.id !== id));
        alert('បានលុបវគ្គសិក្សាជោគជ័យ!');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('មានបញ្ហាក្នុងការភ្ជាប់ទៅ Server');
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-600" /></div>;
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-lg flex gap-2"><AlertCircle /> {error}</div>;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mt-8">
      {/* ... Header (រក្សាទុកដដែល) ... */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white font-khmer">វគ្គសិក្សាទាំងអស់ ({courses.length})</h3>
        <button onClick={fetchCourses} className="text-sm text-blue-600 hover:underline font-khmer">Refresh</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          {/* ... Table Header (រក្សាទុកដដែល) ... */}
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-khmer text-sm">
            <tr>
              <th className="p-4">វគ្គសិក្សា</th>
              <th className="p-4">តម្លៃ</th>
              <th className="p-4">មេរៀន</th>
              <th className="p-4 text-right">សកម្មភាព</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={course.imageUrl} alt={course.title} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white font-khmer text-sm">{course.title}</p>
                        <span className="text-xs text-slate-500">{course.level}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {course.price > 0 ? `$${course.price}` : <span className="text-green-600">Free</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                        <Video size={14} />
                        {course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 0}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* 👇 ប៊ូតុង Edit: ហៅ onEdit ពេលចុច */}
                      <button 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" 
                        title="កែប្រែ"
                        onClick={() => onEdit(course)} 
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(course.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" 
                        title="លុប"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">គ្មានទិន្នន័យ</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCourseList;