import React from 'react';
import { Job } from '../types';
import { MapPin, Clock, Briefcase, DollarSign, ChevronRight, Bookmark } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onClick: (job: Job) => void;
  isActive: boolean;
  isBookmarked?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick, isActive, isBookmarked }) => {
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
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-gradient-to-br dark:from-dev-700 dark:to-dev-800 flex items-center justify-center border border-slate-200 dark:border-dev-600 text-slate-700 dark:text-dev-text font-bold text-sm shadow-sm relative">
               {job.company.substring(0, 2).toUpperCase()}
               {isBookmarked && (
                 <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full border border-white dark:border-dev-800">
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
          <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-dev-muted bg-slate-100 dark:bg-dev-900 px-2 py-1 rounded border border-slate-200 dark:border-dev-700 whitespace-nowrap">
            {job.postedAt}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-y-3 mb-5 text-sm text-slate-600 dark:text-dev-muted">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-blue-500 dark:text-dev-accent shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-green-600 dark:text-dev-success shrink-0" />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={14} className="text-amber-600 dark:text-dev-warning shrink-0" />
            <span className="truncate">{job.salary || 'Competitive'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-slate-400 dark:text-dev-500 shrink-0" />
            <span>{job.experienceLevel || 'Mid-Senior'}</span>
          </div>
        </div>
      </div>

      <div>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {job.tags.slice(0, 4).map((tag, idx) => (
            <span key={idx} className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-50 dark:bg-dev-700/50 text-slate-600 dark:text-cyan-400 border border-slate-200 dark:border-cyan-900/30">
              {tag}
            </span>
          ))}
          {job.tags.length > 4 && (
            <span className="text-[11px] px-2 py-1 text-slate-400 dark:text-dev-muted">+ {job.tags.length - 4}</span>
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