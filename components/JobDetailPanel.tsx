import React from 'react';
import { Job } from '../types';
import { X, ExternalLink, Globe, Calendar, CheckCircle, Code, Bookmark } from 'lucide-react';

interface JobDetailPanelProps {
  job: Job | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (jobId: string) => void;
}

export const JobDetailPanel: React.FC<JobDetailPanelProps> = ({ job, onClose, isBookmarked, onToggleBookmark }) => {
  if (!job) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white dark:bg-dev-900 border-l border-slate-200 dark:border-dev-700 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto">
      
      {/* Header */}
      <div className="sticky top-0 bg-white/95 dark:bg-dev-900/95 backdrop-blur-md border-b border-slate-200 dark:border-dev-700 p-6 flex justify-between items-start z-10 transition-colors duration-300">
        <div className="flex-1 pr-4">
           <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-green-600 dark:border-dev-success text-green-700 dark:text-dev-success bg-green-50 dark:bg-dev-success/10 uppercase tracking-wider">
                Active
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-slate-300 dark:border-dev-700 text-slate-500 dark:text-dev-muted uppercase tracking-wider">
                {job.id.slice(0, 8)}
              </span>
           </div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-dev-text mb-1">{job.title}</h2>
           <div className="flex items-center gap-2 text-blue-600 dark:text-dev-accent font-mono text-sm">
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
             <p className="text-amber-600 dark:text-dev-warning font-semibold text-sm">{job.salary || 'Not disclosed'}</p>
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
            Tech Stack & Requirements
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
            Job Description
          </h3>
          <div className="prose prose-slate dark:prose-invert prose-sm max-w-none text-slate-600 dark:text-dev-muted leading-relaxed">
            <p>{job.description}</p>
            <p className="mt-4 italic text-xs border-l-2 border-slate-300 dark:border-dev-700 pl-4 py-2 bg-slate-50 dark:bg-dev-800/30 text-slate-500 dark:text-dev-muted">
              Note: This description was summarized by AI from the original job posting. Please check the official application page for full details.
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
              flex items-center justify-center gap-2 w-full py-4 rounded-lg font-bold text-white transition-all
              ${job.applyLink 
                ? 'bg-blue-600 dark:bg-dev-accent hover:bg-blue-700 dark:hover:bg-blue-600 shadow-lg hover:shadow-xl shadow-blue-500/20' 
                : 'bg-slate-300 dark:bg-dev-700 cursor-not-allowed text-slate-500 dark:text-dev-muted'}
            `}
          >
            {job.applyLink ? 'Apply for this Role' : 'Application Link Not Found'}
            <ExternalLink size={18} />
          </a>
        </div>

      </div>
    </div>
  );
};