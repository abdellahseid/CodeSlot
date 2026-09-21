import React, { useState, useEffect } from 'react';
import { Job } from '../types';
import { MapPin, Clock, Briefcase, DollarSign, ChevronRight, Bookmark } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onClick: (job: Job) => void;
  isActive: boolean;
  isBookmarked?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick, isActive, isBookmarked }) => {
  const cleanName = String(job.company || '').replace(/[^a-zA-Z0-9\s]/g, '').trim() || 'Tech';
  const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=0284c7&color=ffffff&bold=true&length=2&font-size=0.45`;

  const [currentLogo, setCurrentLogo] = useState<string>(job.companyLogo || fallbackLogo);

  useEffect(() => {
    setCurrentLogo(job.companyLogo || fallbackLogo);
  }, [job.companyLogo, fallbackLogo]);

  const safeTags = Array.isArray(job.tags) ? job.tags : [];

  return (
    <div 
      onClick={() => onClick(job)}
      className={`
        group relative p-6 rounded-xl border cursor-pointer transition-all duration-300 ease-out h-full flex flex-col justify-between
        ${isActive 
          ? 'bg-blue-50 dark:bg-dev-800 border-blue-500 dark:border-dev-accent shadow-[0_0_15px_rgba(47,129,247,0.15)] ring-1 ring-blue-500 dark:ring-dev-accent' 
          : 'bg-white dark:bg-dev-800/50 border-transparent dark:border-dev-700 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-none hover:border-blue-400 dark:hover:border-dev-accent hover:shadow-xl dark:hover:shadow-[0_0_15px_rgba(47,129,247,0.1)] hover:-translate-y-1'}
      `}
    >
      <div>
        {/* Top Meta */}
        <div className="flex justify-between items-start mb-4 gap-2">
          <div className="flex items-center gap-3">
             <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-dev-700 flex items-center justify-center border border-slate-200 dark:border-dev-600 shadow-sm relative overflow-hidden shrink-0">
               <img 
                 src={currentLogo} 
                 alt={`${job.company} logo`} 
                 className="w-full h-full object-cover rounded-md p-0.5"
                 onError={() => {
                   if (currentLogo !== fallbackLogo) {
                     setCurrentLogo(fallbackLogo);
                   }
                 }}
               />
               {isBookmarked && (
                 <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full border border-white dark:border-dev-800 z-10">
                    <Bookmark size={8} fill="currentColor" />
                 </div>
               )}
             </div>
             <div>
               <h3 className="font-sans font-bold text-lg text-slate-800 dark:text-dev-text group-hover:text-blue-600 dark:group-hover:text-dev-accent transition-colors line-clamp-1">
                 {job.title}
               </h3>
               <p className="text-sm text-slate-500 dark:text-dev-muted font-medium line-clamp-1">{job.company}</p>
             </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-dev-muted bg-slate-100 dark:bg-dev-900 px-2 py-0.5 rounded border border-slate-200 dark:border-dev-700 whitespace-nowrap">
              {job.postedAt}
            </span>
            {job.source && (
              <span className="text-[9px] font-mono uppercase tracking-wider text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-dev-700 px-1.5 py-0.5 rounded border border-blue-200 dark:border-dev-600">
                {job.source}
              </span>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-y-3 mb-5 text-sm text-slate-600 dark:text-dev-muted">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-blue-500 dark:text-dev-accent shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-green-600 dark:text-dev-success shrink-0" />
            <span className="truncate">{job.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={14} className="text-amber-600 dark:text-dev-warning shrink-0" />
            <span className="truncate">{job.salary || 'Competitive'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-slate-400 dark:text-dev-500 shrink-0" />
            <span className="truncate">{job.experienceLevel || 'Mid-Senior'}</span>
          </div>
        </div>
      </div>

      <div>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {safeTags.slice(0, 4).map((tag, idx) => (
            <span key={idx} className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-50 dark:bg-dev-700/50 text-slate-600 dark:text-cyan-400 border border-slate-200 dark:border-cyan-900/30">
              {typeof tag === 'string' ? tag : String(tag || '')}
            </span>
          ))}
          {safeTags.length > 4 && (
            <span className="text-[11px] px-2 py-1 text-slate-400 dark:text-dev-muted">+ {safeTags.length - 4}</span>
          )}
        </div>
      </div>
      
      {/* Hover Action Indicator */}
      <div className="absolute right-5 bottom-5 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
        <ChevronRight className="text-blue-600 dark:text-dev-accent" size={24} />
      </div>
    </div>
  );
};