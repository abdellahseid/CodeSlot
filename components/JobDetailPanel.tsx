import React, { useState, useEffect } from 'react';
import { Job } from '../types';
import { X, ExternalLink, Globe, Calendar, CheckCircle, Code, Bookmark, ShieldCheck } from 'lucide-react';

interface JobDetailPanelProps {
  job: Job | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (jobId: string) => void;
}

export const JobDetailPanel: React.FC<JobDetailPanelProps> = ({ job, onClose, isBookmarked, onToggleBookmark }) => {
  if (!job) return null;

  const cleanName = job.company.replace(/[^a-zA-Z0-9\s]/g, '').trim() || 'Tech';
  const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=0284c7&color=ffffff&bold=true&length=2&font-size=0.45`;
  const [logoUrl, setLogoUrl] = useState<string>(job.companyLogo || fallbackLogo);

  useEffect(() => {
    setLogoUrl(job.companyLogo || fallbackLogo);
  }, [job?.id, job?.companyLogo, fallbackLogo]);

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white dark:bg-dev-900 border-l border-slate-200 dark:border-dev-700 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto">
      
      {/* Header */}
      <div className="sticky top-0 bg-white/95 dark:bg-dev-900/95 backdrop-blur-md border-b border-slate-200 dark:border-dev-700 p-6 flex justify-between items-start z-10 transition-colors duration-300">
        <div className="flex-1 pr-4">
           <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-green-600 dark:border-dev-success text-green-700 dark:text-dev-success bg-green-50 dark:bg-dev-success/10 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={12} /> Live Listing
              </span>
              {job.source && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-blue-300 dark:border-dev-600 text-blue-700 dark:text-dev-accent bg-blue-50 dark:bg-dev-accent/10 uppercase tracking-wider">
                  Source: {job.source}
                </span>
              )}
              {job.category && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-cyan-300 dark:border-cyan-800 text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/20 uppercase tracking-wider">
                  {job.category}
                </span>
              )}
           </div>
           
           <div className="flex items-center gap-3 mb-2">
             <img 
               src={logoUrl} 
               alt={job.company} 
               className="w-8 h-8 rounded-md border border-slate-200 dark:border-dev-700 object-cover shrink-0" 
               onError={() => setLogoUrl(fallbackLogo)}
             />
             <h2 className="text-2xl font-bold text-slate-900 dark:text-dev-text">{job.title}</h2>
           </div>

           <div className="flex items-center gap-2 text-blue-600 dark:text-dev-accent font-mono text-sm ml-1">
             <Globe size={14} />
             <span>{job.company}</span>
           </div>
        </div>
        <div className="flex gap-2">
            <button
                onClick={() => onToggleBookmark(job.id)}
                className={`p-2 rounded-lg border transition-all ${isBookmarked 
                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500 text-amber-600 dark:text-amber-500' 
                    : 'bg-white dark:bg-dev-800 border-slate-200 dark:border-dev-700 text-slate-400 dark:text-dev-muted hover:text-slate-900 dark:hover:text-white'}`}
                title={isBookmarked ? "Remove Marker" : "Mark for Later"}
            >
                <Bookmark size={24} fill={isBookmarked ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-dev-800 rounded-lg text-slate-500 dark:text-dev-muted hover:text-slate-900 dark:hover:text-dev-text transition-colors border border-transparent"
            >
              <X size={24} />
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
           <div className="p-4 rounded-lg bg-slate-50 dark:bg-dev-800 border border-slate-200 dark:border-dev-700">
             <p className="text-xs text-slate-500 dark:text-dev-muted font-mono mb-1">COMPENSATION</p>
             <p className="text-amber-600 dark:text-dev-warning font-semibold text-sm">{job.salary || 'Competitive'}</p>
           </div>
           <div className="p-4 rounded-lg bg-slate-50 dark:bg-dev-800 border border-slate-200 dark:border-dev-700">
             <p className="text-xs text-slate-500 dark:text-dev-muted font-mono mb-1">LOCATION</p>
             <p className="text-slate-700 dark:text-dev-text font-semibold text-sm">{job.location}</p>
           </div>
           <div className="p-4 rounded-lg bg-slate-50 dark:bg-dev-800 border border-slate-200 dark:border-dev-700">
             <p className="text-xs text-slate-500 dark:text-dev-muted font-mono mb-1">TYPE</p>
             <p className="text-green-600 dark:text-dev-success font-semibold text-sm">{job.type}</p>
           </div>
           <div className="p-4 rounded-lg bg-slate-50 dark:bg-dev-800 border border-slate-200 dark:border-dev-700">
             <p className="text-xs text-slate-500 dark:text-dev-muted font-mono mb-1">POSTED</p>
             <p className="text-slate-700 dark:text-dev-text font-semibold flex items-center gap-2 text-sm">
               <Calendar size={14} /> {job.postedAt}
             </p>
           </div>
        </div>

        {/* Tech Stack */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-dev-text uppercase tracking-widest mb-4">
            <Code size={16} className="text-blue-600 dark:text-dev-accent" />
            Tech Stack & Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-md bg-white dark:bg-dev-800 border border-slate-300 dark:border-dev-600 text-slate-700 dark:text-cyan-400 font-mono text-xs shadow-sm dark:shadow-none cursor-default">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-dev-text uppercase tracking-widest mb-4">
            <CheckCircle size={16} className="text-blue-600 dark:text-dev-accent" />
            Job Overview & Requirements
          </h3>
          <div className="prose prose-slate dark:prose-invert prose-sm max-w-none text-slate-600 dark:text-dev-muted leading-relaxed whitespace-pre-line">
            <p>{job.description}</p>
            <p className="mt-4 italic text-xs border-l-2 border-blue-500 dark:border-dev-accent pl-4 py-2 bg-blue-50/50 dark:bg-dev-800/30 text-slate-500 dark:text-dev-muted">
              Direct live job listing fetched from {job.source || 'verified global job board'}. Click below to apply directly on the company's application portal.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-slate-200 dark:border-dev-700">
          <a 
            href={job.applyLink || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`
              flex items-center justify-center gap-2 w-full py-4 rounded-lg font-bold text-white transition-all text-base
              ${job.applyLink 
                ? 'bg-blue-600 dark:bg-dev-accent hover:bg-blue-700 dark:hover:bg-blue-600 shadow-lg hover:shadow-xl shadow-blue-500/20' 
                : 'bg-slate-300 dark:bg-dev-700 cursor-not-allowed text-slate-500 dark:text-dev-muted'}
            `}
          >
            {job.applyLink ? `Apply Directly at ${job.company}` : 'Application Link Not Found'}
            <ExternalLink size={18} />
          </a>
        </div>

      </div>
    </div>
  );
};