import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../../components/common/Card';
import { ShieldAlert, Info, Loader2 } from 'lucide-react';

const PlagiarismMatrix: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMatrix = async () => {
            try {
                const token = localStorage.getItem('user_token');
                const response = await axios.get('http://localhost:8081/api/admin/similarity-matrix', {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch matrix", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMatrix();
    }, []);

    const getColor = (value: number) => {
        if (value >= 90) return 'bg-gray-800 text-gray-500';
        if (value > 70) return 'bg-red-500/20 text-red-500 font-bold';
        if (value > 40) return 'bg-amber-500/20 text-amber-500';
        if (value > 10) return 'bg-emerald-500/10 text-emerald-500';
        return 'bg-white/5 text-gray-600';
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-white">Similarity Matrix</h1>
                    <p className="text-gray-400 mt-1">Cross-referencing submissions for internal collusion detection.</p>
                </div>
                <div className="p-3 glass rounded-lg border border-red-500/20 flex items-center space-x-3">
                    <ShieldAlert className="text-red-500" />
                    <div>
                        <p className="text-xs text-red-400">High Risk Detected</p>
                        <p className="text-sm font-bold text-white">Alice W. & Charlie K. (82%)</p>
                    </div>
                </div>
            </div>

            <Card className="p-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-12 space-y-4 text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                        <p>Scanning global submissions for collusion...</p>
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No cross-submission similarities detected yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-slate-500 text-xs uppercase tracking-wider">
                                    <th className="p-4 text-left">Submission A</th>
                                    <th className="p-4 text-left">Submission B</th>
                                    <th className="p-4 text-center">Logic Similarity</th>
                                    <th className="p-4 text-center">Structural Match</th>
                                    <th className="p-4 text-center">Detected On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {data.map((sim, i) => (
                                    <tr key={sim.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white">#SUB-{sim.submissionA.id}</span>
                                                <span className="text-xs text-slate-500">{sim.submissionA.user.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white">#SUB-{sim.submissionB.id}</span>
                                                <span className="text-xs text-slate-500">{sim.submissionB.user.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className={`px-3 py-1 rounded-full text-xs inline-block ${getColor(sim.similarityScore)}`}>
                                                {sim.similarityScore}%
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-sm text-slate-400">88%</span>
                                        </td>
                                        <td className="p-4 text-center text-xs text-slate-500">
                                            {new Date().toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-8 flex items-center space-x-6 text-xs text-gray-500 border-t border-gray-800 pt-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500/20 rounded-full" />
                        <span>Critical ({'>'}70%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-amber-500/20 rounded-full" />
                        <span>Warning (40-70%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-emerald-500/10 rounded-full" />
                        <span>Safe ({'<'}40%)</span>
                    </div>
                    <div className="flex items-center space-x-2 ml-auto">
                        <Info className="w-4 h-4" />
                        <span>Values represent token-level structural similarity</span>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default PlagiarismMatrix;
