import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-slate-900">
                Blog <span className="text-brand-600">TK</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              An open, autonomous blogging and knowledge-sharing platform where developers, architects, and designers publish insights freely.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/" className="hover:text-brand-600 transition-colors">Home Feed</Link></li>
              <li><Link to="/about" className="hover:text-brand-600 transition-colors">About Us</Link></li>
              <li><Link to="/create-post" className="hover:text-brand-600 transition-colors">Publish Article</Link></li>
              <li><Link to="/my-posts" className="hover:text-brand-600 transition-colors">My Articles</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Community</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><span className="text-slate-500">Node & React</span></li>
              <li><span className="text-slate-500">Design Systems</span></li>
              <li><span className="text-slate-500">Cloud Architecture</span></li>
              <li><span className="text-slate-500">Security & UX</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Blog TK. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with modern MERN stack & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
