import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FileCode, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart, 
  Plus,
  Loader2
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const StudentDashboard: React.FC = () => {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/submissions/my');
                setSubmissions(response.data);
            } catch (error) {
                console.error("Dashboard fetch failed", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const stats = [
        { label: 'Total Submissions', value: isLoading ? '...' : submissions.length.toString(), icon: FileCode, color: 'text-primary-500' },
        { label: 'Avg Similarity', value: '12%', icon: BarChart, color: 'text-emerald-500' },
        { label: 'Pending Reviews', value: '0', icon: Clock, color: 'text-amber-500' },
        { label: 'Quality Score', value: 'A', icon: CheckCircle2, color: 'text-indigo-500' },
    ];

    const recentSubmissions = submissions.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">Student Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Monitor your code quality and plagiarism reports.</p>
        </div>
        <Button onClick={() => window.location.href = '/student/upload'}>
            <Plus className="w-5 h-5 mr-2" />
            New Submission
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4 flex items-center space-x-4">
            <div className={`p-3 rounded-lg bg-khaki-100 dark:bg-slate-800 ${stat.color} transition-colors`}>
                <stat.icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card title="Recent Submissions">
                <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-khaki-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm transition-colors">
                                <th className="pb-4 font-medium">Filename</th>
                                <th className="pb-4 font-medium">Date</th>
                                <th className="pb-4 font-medium">Similarity</th>
                                <th className="pb-4 font-medium">Status</th>
                                <th className="pb-4 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-khaki-100 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center space-y-2">
                                            <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                                            <p>Loading dashboard...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : recentSubmissions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-500">
                                        No recent activity. Start by uploading code!
                                    </td>
                                </tr>
                            ) : recentSubmissions.map((sub) => (
                                <tr key={sub.id} className="text-slate-700 dark:text-slate-300 transition-colors group">
                                    <td className="py-4 flex items-center space-x-2">
                                        <FileCode className="w-4 h-4 text-primary-500" />
                                        <span className="font-medium">{sub.language === 'python' ? 'Analysis.py' : 'Solution.java'}</span>
                                    </td>
                                    <td className="py-4 text-sm">{new Date(sub.createdAt).toLocaleDateString()}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold bg-emerald-500/10 text-emerald-500`}>
                                            12%
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <span className="flex items-center text-emerald-500 text-xs">
                                            <CheckCircle2 className="w-3 h-3 mr-1" /> {sub.status}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <button 
                                            onClick={() => navigate(`/student/analysis/${sub.id}`)}
                                            className="text-primary-500 hover:text-primary-400 text-sm font-medium"
                                        >
                                            View Report
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>

        <div className="lg:col-span-1">
            <Card title="AI Insights" subtitle="Recent suggestions for your code">
                <div className="space-y-4 mt-6">
                    <div className="p-3 bg-white dark:bg-slate-950 rounded-lg border border-khaki-200 dark:border-slate-800 transition-colors">
                        <p className="text-sm text-slate-900 dark:text-white font-medium mb-1">Complexity Alert</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Your BinarySearch.py has a high cyclomatic complexity in the main loop.</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-950 rounded-lg border border-khaki-200 dark:border-slate-800 transition-colors">
                        <p className="text-sm text-slate-900 dark:text-white font-medium mb-1">Style Improvement</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Consider using list comprehensions in QuickSort.java for better readability.</p>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full text-xs text-primary-600 dark:text-primary-400 hover:bg-khaki-100 dark:hover:bg-slate-800">View All Suggestions</Button>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
