import React from 'react';
import { Search, Filter, RefreshCw, Calendar, Star, Globe, Code } from 'lucide-react';
import { SearchFilters } from '../types';

interface FilterBarProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onRefresh: () => void;
  isLoading: boolean;
  showBookmarkedOnly: boolean;
  setShowBookmarkedOnly: (show: boolean) => void;
  bookmarkCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
    filters, 
    setFilters, 
    onRefresh, 
    isLoading,
    showBookmarkedOnly,
    setShowBookmarkedOnly,
    bookmarkCount
}) => {
  return (
    <div className="w-full bg-white/90 dark:bg-dev-900/90 backdrop-blur-md border-b border-slate-200 dark:border-dev-700 py-4 px-6 mb-6 transition-colors duration-300">
      <div className="w-full flex flex-col xl:flex-row gap-4 justify-between items-center">
        
        {/* Search Input */}
        <div className="relative w-full xl:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400 dark:text-dev-600 group-focus-within:text-blue-600 dark:group-focus-within:text-dev-accent transition-colors" />
          </div>
          <input
            type="text"
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            placeholder="Search software roles, companies, tech (e.g. React, Python)..."
            className="w-full bg-slate-100 dark:bg-dev-800 border border-slate-200 dark:border-dev-700 text-slate-900 dark:text-dev-text text-sm rounded-md pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 dark:focus:border-dev-accent focus:ring-1 focus:ring-blue-500 dark:focus:ring-dev-accent transition-all font-mono placeholder:text-slate-400 dark:placeholder:text-dev-600"
          />
        </div>

        {/* Dropdowns & Actions */}
        <div className="flex gap-2 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 scrollbar-hide items-center">
          
          {/* Software Role Category Filter */}
          <div className="relative min-w-[150px]">
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="appearance-none w-full bg-slate-100 dark:bg-dev-800 border border-slate-200 dark:border-dev-700 text-slate-700 dark:text-dev-text text-xs font-mono rounded-md pl-3 pr-8 py-2.5 focus:outline-none focus:border-blue-500 dark:focus:border-dev-accent cursor-pointer hover:bg-slate-200 dark:hover:bg-dev-700 transition-colors"
            >
              <option value="">Category: All Software</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Fullstack">Fullstack</option>
              <option value="Mobile">Mobile</option>
              <option value="DevOps">DevOps & Cloud</option>
              <option value="AI / Data">AI & Data</option>
              <option value="QA / Testing">QA & Testing</option>
              <option value="Software Engineering">Software General</option>
            </select>
            <Code size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-dev-muted pointer-events-none" />
          </div>

          {/* Region / Location Filter */}
          <div className="relative min-w-[140px]">
            <select
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="appearance-none w-full bg-slate-100 dark:bg-dev-800 border border-slate-200 dark:border-dev-700 text-slate-700 dark:text-dev-text text-xs font-mono rounded-md pl-3 pr-8 py-2.5 focus:outline-none focus:border-blue-500 dark:focus:border-dev-accent cursor-pointer hover:bg-slate-200 dark:hover:bg-dev-700 transition-colors"
            >
              <option value="">Region: Worldwide</option>
              <option value="Worldwide">Worldwide / Any</option>
              <option value="US">Americas / USA</option>
              <option value="Europe">Europe / UK</option>
              <option value="APAC">Asia-Pacific</option>
              <option value="Remote">Remote Only</option>
            </select>
            <Globe size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-dev-muted pointer-events-none" />
          </div>

          {/* Experience Filter */}
          <div className="relative min-w-[130px]">
            <select
              value={filters.experience}
              onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
              className="appearance-none w-full bg-slate-100 dark:bg-dev-800 border border-slate-200 dark:border-dev-700 text-slate-700 dark:text-dev-text text-xs font-mono rounded-md pl-3 pr-8 py-2.5 focus:outline-none focus:border-blue-500 dark:focus:border-dev-accent cursor-pointer hover:bg-slate-200 dark:hover:bg-dev-700 transition-colors"
            >
              <option value="">Exp: Any</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid-Level</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead / Staff</option>
            </select>
            <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-dev-muted pointer-events-none" />
          </div>

          {/* Job Type Filter */}
          <div className="relative min-w-[130px]">
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="appearance-none w-full bg-slate-100 dark:bg-dev-800 border border-slate-200 dark:border-dev-700 text-slate-700 dark:text-dev-text text-xs font-mono rounded-md pl-3 pr-8 py-2.5 focus:outline-none focus:border-blue-500 dark:focus:border-dev-accent cursor-pointer hover:bg-slate-200 dark:hover:bg-dev-700 transition-colors"
            >
              <option value="">Type: Any</option>
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
            <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-dev-muted pointer-events-none" />
          </div>

          {/* Date Filter */}
          <div className="relative min-w-[130px]">
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="appearance-none w-full bg-slate-100 dark:bg-dev-800 border border-slate-200 dark:border-dev-700 text-slate-700 dark:text-dev-text text-xs font-mono rounded-md pl-3 pr-8 py-2.5 focus:outline-none focus:border-blue-500 dark:focus:border-dev-accent cursor-pointer hover:bg-slate-200 dark:hover:bg-dev-700 transition-colors"
            >
              <option value="">Date: Any</option>
              <option value="24h">Last 24 Hours</option>
              <option value="3d">Last 3 Days</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last Month</option>
            </select>
            <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-dev-muted pointer-events-none" />
          </div>

          <div className="h-6 w-px bg-slate-300 dark:bg-dev-700 mx-1 hidden md:block"></div>

          {/* Marked/Saved Toggle */}
          <button
            onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
            className={`
                relative flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold font-mono transition-all whitespace-nowrap
                ${showBookmarkedOnly 
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 border border-amber-500 dark:border-amber-600' 
                    : 'bg-slate-100 dark:bg-dev-800 text-slate-600 dark:text-dev-muted border border-slate-200 dark:border-dev-700 hover:bg-slate-200 dark:hover:bg-dev-700'}
            `}
          >
            <Star size={14} fill={showBookmarkedOnly ? "currentColor" : "none"} />
            SAVED
            {bookmarkCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px]">
                    {bookmarkCount}
                </span>
            )}
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold font-mono transition-all whitespace-nowrap ml-2
              ${isLoading 
                ? 'bg-slate-200 dark:bg-dev-800 text-slate-400 dark:text-dev-muted cursor-wait' 
                : 'bg-blue-600 dark:bg-dev-accent text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-lg shadow-blue-500/20'}
            `}
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? 'FETCHING...' : 'REFRESH'}
          </button>
        </div>

      </div>
    </div>
  );
};