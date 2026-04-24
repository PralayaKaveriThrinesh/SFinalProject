import React from 'react';
import { Shield, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="glass border-t border-khaki-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-6 h-6 text-primary-500" />
              <span className="text-xl font-bold text-slate-900">CodeGuardian</span>
            </div>
            <p className="text-slate-600 max-w-xs">
              Advanced plagiarism detection and code quality analysis platform for academic and professional institutions.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-600 hover:text-primary-600 transition-colors">Features</a></li>
              <li><a href="#" className="text-slate-600 hover:text-primary-600 transition-colors">Code Analysis</a></li>
              <li><a href="#" className="text-slate-600 hover:text-primary-600 transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-600 hover:text-primary-600 transition-colors">About Us</a></li>
              <li><a href="#" className="text-slate-600 hover:text-primary-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-600 hover:text-primary-600 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-khaki-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2026 CodeGuardian. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-white"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-gray-500 hover:text-white"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-gray-500 hover:text-white"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
