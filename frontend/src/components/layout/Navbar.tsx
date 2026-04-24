import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, User, LayoutDashboard, History, FileCode, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import ThemeToggle from '../common/ThemeToggle';

import logo from '../../assets/logo.png';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="sticky top-0 w-full z-50 border-b border-khaki-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900 transition-all shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="h-12 w-12 overflow-hidden rounded-xl shadow-md border border-slate-200 dark:border-slate-800 transition-transform group-hover:scale-110">
              <img src={logo} alt="CodeGuardian Logo" className="h-full w-full object-cover" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase whitespace-nowrap">
              Code<span className="text-primary-500">Guardian</span>
            </span>
          </Link>

          {/* Scrolling Marquee in the middle */}
          <div className="hidden lg:flex flex-1 mx-12 overflow-hidden pointer-events-none">
            <marquee className="text-sm font-medium text-primary-500/80 dark:text-primary-400/60 uppercase tracking-widest italic" scrollamount="4">
              ℭ𝔬𝔡𝔢 𝔦𝔰 𝔱𝔥𝔢 𝔩𝔞𝔫𝔤𝔲𝔞𝔤𝔢 𝔬𝔣 𝔱𝔥𝔢 𝔣𝔲𝔱𝔲𝔯𝔢—𝔩𝔢𝔞𝔯𝔫 𝔦𝔱, 𝔢𝔞𝔯𝔫 𝔣𝔯𝔬𝔪 𝔦𝔱.
            </marquee>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex items-center space-x-5 mr-4">
              <Link to="/#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</Link>
              <Link to="/#about" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About</Link>
              {!isAuthenticated && (
                <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Login</Link>
              )}
            </nav>

            <div className="w-px h-4 bg-slate-200 dark:bg-slate-800" />
            
            <div className="flex items-center space-x-1">
              <ThemeToggle />
            </div>

            <div className="w-px h-4 bg-slate-200 dark:bg-slate-800" />
            
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 pl-2 pr-1 py-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent">
                  <div className="w-8 h-8 rounded-full bg-[#0ea5e9] shadow-inner shadow-white/20 flex items-center justify-center text-white font-bold text-sm ring-2 ring-transparent group-hover:ring-primary-500/20 transition-all">
                    {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-64 glass dark:bg-slate-900 border border-khaki-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-50">
                  <div className="p-4 border-b border-khaki-100 dark:border-slate-800 bg-khaki-50/50 dark:bg-slate-800/50">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || 'User Profile'}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate uppercase tracking-widest">{user?.email}</p>
                  </div>
                  
                  <div className="p-2">
                    <Link to="/student/dashboard" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group/item">
                      <LayoutDashboard className="w-4 h-4 text-slate-400 group-hover/item:text-primary-500" />
                      <span className="text-sm font-medium">Overview</span>
                    </Link>
                    <Link to="/student/upload" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group/item">
                      <FileCode className="w-4 h-4 text-slate-400 group-hover/item:text-primary-500" />
                      <span className="text-sm font-medium">Submissions</span>
                    </Link>
                    <Link to="/student/history" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group/item">
                      <History className="w-4 h-4 text-slate-400 group-hover/item:text-primary-500" />
                      <span className="text-sm font-medium">Reports</span>
                    </Link>
                  </div>

                  <div className="p-2 border-t border-khaki-100 dark:border-slate-800">
                    <button 
                      onClick={logout}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors group/item"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Button size="sm" onClick={() => window.location.href = '/register'}>Get Started</Button>
            )}
          </div>

          <div className="md:hidden text-slate-900 dark:text-white">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass border-b border-khaki-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/#features" className="block px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">Features</Link>
            <Link to="/#about" className="block px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">About</Link>
            {!isAuthenticated && (
              <Link to="/login" className="block px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">Login</Link>
            )}
            <div className="px-3 py-2">
              {isAuthenticated ? (
                <Button className="w-full" size="sm" onClick={logout}>Logout</Button>
              ) : (
                <Button className="w-full" size="sm" onClick={() => window.location.href = '/register'}>Get Started</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
