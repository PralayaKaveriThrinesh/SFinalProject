import React from 'react';
import { Shield, Zap, BarChart3, Code2, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Footer from '../components/layout/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-beige-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 flex flex-col items-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary-500/10 blur-[120px] rounded-full -z-10" />
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-center mb-6 leading-tight">
          <span className="text-slate-900 dark:text-white transition-colors">
            Intelligent Code Review &
          </span>
          <br />
          <span className="text-primary-500">Plagiarism Detection</span>
        </h1>
        
        <p className="text-xl text-slate-600 dark:text-slate-400 text-center max-w-2xl mb-10 transition-colors">
          Empowering educational institutions and development teams with state-of-the-art 
          similarity analysis and code quality insights.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 relative">
          <Button size="lg" className="w-full sm:w-auto px-10 shadow-2xl shadow-primary-500/30" onClick={() => window.location.href = '/student/upload'}>
            Start Analyzing <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full sm:w-auto bg-white dark:bg-slate-900 border-khaki-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-khaki-50 dark:hover:bg-slate-800"
            onClick={() => window.location.href = '/student/history'}
          >
            View Sample Report
          </Button>
        </div>

        <div className="mt-20 w-full max-w-5xl glass rounded-2xl border border-khaki-200 p-2 shadow-2xl relative">
             <div className="absolute inset-0 bg-primary-500/5 blur-3xl -z-10" />
             <div className="bg-khaki-50 dark:bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center border border-khaki-200 dark:border-slate-800 transition-colors">
                <div className="flex flex-col items-center text-slate-400 dark:text-slate-500">
                    <Code2 className="w-16 h-16 mb-4 animate-pulse-slow" />
                    <span className="text-sm font-mono tracking-tighter">CODE ANALYSIS ENGINE ACTIVE</span>
                </div>
             </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-khaki-50 dark:bg-slate-900/50 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Powerful Features</h2>
            <p className="text-slate-600 dark:text-slate-400">Everything you need to maintain academic integrity and code excellence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card 
              title="AST-Based Detection" 
              subtitle="Beyond token comparison, we analyze the Abstract Syntax Tree for deep structural similarity logic."
            >
              <div className="h-12 w-12 bg-primary-600/20 rounded-lg flex items-center justify-center mb-4 text-primary-500">
                <Shield />
              </div>
            </Card>

            <Card 
              title="Quality Analysis" 
              subtitle="Comprehensive linting and style check to ensure code follows modern best practices."
            >
              <div className="h-12 w-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-4 text-indigo-500">
                <Zap />
              </div>
            </Card>

            <Card 
              title="Complexity Metrics" 
              subtitle="Detailed Cyclomatic complexity and cognitive load scores for every function."
            >
              <div className="h-12 w-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mb-4 text-emerald-500">
                <BarChart3 />
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
