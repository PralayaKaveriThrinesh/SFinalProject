import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, FileCode, Search, AlertTriangle, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import axios from 'axios';

const CodeAnalysis: React.FC = () => {
    const { id } = useParams();
    const [submission, setSubmission] = React.useState<any>(null);
    const [aiSuggestions, setAiSuggestions] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAiLoading, setIsAiLoading] = React.useState(true);
    const [reportTheme, setReportTheme] = React.useState('vs-dark');

    const toggleTheme = () => {
        setReportTheme(prev => prev === 'vs-dark' ? 'light' : 'vs-dark');
    };

    useEffect(() => {
        fetchData();
        fetchSuggestions();
    }, [id]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8081/api/submissions/${id}`);
            setSubmission(response.data);
        } catch (error) {
            console.error("Failed to fetch submission data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSuggestions = async () => {
        setIsAiLoading(true);
        try {
            const response = await axios.get(`http://localhost:8081/api/analysis/ai-suggestions/${id}`);
            setAiSuggestions(response.data.suggestions);
        } catch (error) {
            console.error("Failed to fetch AI suggestions", error);
            setAiSuggestions("Unable to generate AI suggestions at this time.");
        } finally {
            setIsAiLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
                <p className="text-slate-500 animate-pulse">Generating Report...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center space-x-4">
                <Link to="/student/dashboard">
                    <Button variant="ghost" size="sm">
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back
                    </Button>
                </Link>
                <div className="flex-1 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Analysis Report #{id}</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors text-uppercase">
                            {submission?.language} Submission
                        </p>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={toggleTheme}
                        className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-white dark:bg-slate-800 border border-khaki-200 dark:border-slate-700 text-amber-500"
                    >
                        {reportTheme === 'vs-dark' ? '🌞' : '🌙'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex items-center space-x-4 p-4 border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 text-center">
                    <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-500">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-emerald-500 uppercase font-bold tracking-wider">Similarity Status</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white transition-colors">Low Risk</p>
                    </div>
                </Card>
                <Card className="flex items-center space-x-4 p-4 border-primary-500/20 bg-primary-500/5 dark:bg-primary-500/10">
                    <div className="p-3 bg-primary-500/20 rounded-lg text-primary-500">
                        <Search className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-primary-500 uppercase font-bold tracking-wider">Logic Score</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white transition-colors">7.4%</p>
                    </div>
                </Card>
                <Card className="flex items-center space-x-4 p-4 border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/10">
                    <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-500">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-indigo-500 uppercase font-bold tracking-wider">AST Analysis</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white transition-colors">Validated</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
                {/* Left Side: Your Uploaded Code */}
                <div className={`rounded-xl overflow-hidden border shadow-xl flex flex-col transition-all duration-300 ${
                    reportTheme === 'vs-dark' 
                    ? 'bg-slate-900 border-slate-800 text-white' 
                    : 'bg-white border-khaki-200 text-slate-900'
                }`}>
                    <div className={`p-4 border-b flex justify-between items-center transition-colors ${
                        reportTheme === 'vs-dark' ? 'bg-slate-950 border-slate-800' : 'bg-khaki-50 border-khaki-100'
                    }`}>
                        <div className="flex items-center space-x-2">
                            <FileCode className="w-4 h-4 text-primary-500" />
                            <span className="text-sm font-bold uppercase tracking-widest">Your Uploaded Code</span>
                        </div>
                        <span className="text-[10px] bg-primary-600/20 text-primary-500 px-2 py-0.5 rounded font-bold uppercase">{submission?.language}</span>
                    </div>
                    <div className={`flex-1 overflow-auto p-6 custom-scrollbar ${
                        reportTheme === 'vs-dark' ? 'bg-slate-950/40' : 'bg-slate-50'
                    }`}>
                        <pre className="text-sm leading-relaxed font-mono whitespace-pre-wrap"><code>{submission?.code}</code></pre>
                    </div>
                </div>

                {/* Right Side: AI Intelligence Assistant */}
                <div className={`rounded-xl overflow-hidden border shadow-xl flex flex-col transition-all duration-300 ${
                    reportTheme === 'vs-dark' 
                    ? 'bg-slate-900 border-slate-800 text-white' 
                    : 'bg-white border-khaki-200 text-slate-900'
                }`}>
                    <div className={`p-4 border-b flex items-center space-x-2 transition-colors ${
                        reportTheme === 'vs-dark' ? 'bg-emerald-950/20 border-slate-800' : 'bg-emerald-50 border-khaki-100'
                    }`}>
                        <Zap className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-bold uppercase tracking-widest text-emerald-500">AI Intelligence Assistant</span>
                    </div>
                    <div className="flex-1 overflow-auto p-6 custom-scrollbar">
                        {isAiLoading ? (
                            <div className="flex flex-col items-center justify-center h-full space-y-4 text-primary-500">
                                <Loader2 className="w-10 h-10 animate-spin" />
                                <p className="text-sm animate-pulse font-bold">Consulting Gemini AI...</p>
                            </div>
                        ) : (
                            <div className={`p-5 border rounded-xl transition-all ${
                                reportTheme === 'vs-dark' 
                                ? 'bg-slate-800/40 border-emerald-500/10 text-slate-300' 
                                : 'bg-white border-emerald-500/10 text-slate-600'
                            }`}>
                                <div className="text-sm leading-relaxed font-mono whitespace-pre-wrap">
                                    {aiSuggestions}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeAnalysis;
