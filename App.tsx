import React, { useState, useEffect, useCallback } from 'react';
import { Job, SearchFilters, SearchState } from './types';
import { fetchJobsWithGemini } from './services/geminiService';
import { JobCard } from './components/JobCard';
import { JobDetailPanel } from './components/JobDetailPanel';
import { FilterBar } from './components/FilterBar';
import { Terminal, AlertCircle, Sun, Moon, ArrowDownCircle } from 'lucide-react';

export default function App() {
  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: true,
    error: null,
    data: [],
  });

  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: '',
    experience: '',
    dateRange: '',
  });

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Initialize theme
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
    
    // Load Bookmarks
    const saved = localStorage.getItem('devhunt_bookmarks');
    if (saved) {
        setBookmarkedIds(JSON.parse(saved));
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      html.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
        const newIds = prev.includes(id) 
            ? prev.filter(bId => bId !== id) 
            : [...prev, id];
        localStorage.setItem('devhunt_bookmarks', JSON.stringify(newIds));
        return newIds;
    });
  };

  const loadJobs = useCallback(async (isLoadMore = false) => {
    if (!isLoadMore) {
        setSearchState(prev => ({ ...prev, isLoading: true, error: null }));
    } else {
        setIsLoadingMore(true);
    }

    try {
      const newData = await fetchJobsWithGemini(filters.query);
      
      setSearchState(prev => {
        if (isLoadMore) {
            // Filter duplicates based on ID or Title+Company combination to be safe
            const existingIds = new Set(prev.data.map(j => j.id));
            const uniqueNewJobs = newData.filter(job => !existingIds.has(job.id));
            
            return {
                ...prev,
                isLoading: false,
                data: [...prev.data, ...uniqueNewJobs]
            };
        }
        return { isLoading: false, error: null, data: newData };
      });
    } catch (error) {
      if (!isLoadMore) {
          setSearchState({ 
            isLoading: false, 
            error: "Failed to fetch jobs. Please try again or check your connection.", 
            data: [] 
          });
      }
    } finally {
        setIsLoadingMore(false);
    }
  }, [filters.query]);

  useEffect(() => {
    loadJobs();
  }, []); 

  // Utility to parse relative dates into Timestamps for sorting/filtering
  const parseRelativeTime = (timeStr: string): number => {
    const now = new Date();
    const str = timeStr.toLowerCase();
    
    if (str.includes('just') || str.includes('sec')) return now.getTime();
    if (str.includes('min')) return now.getTime() - (parseInt(str) || 1) * 60 * 1000;
    if (str.includes('hour')) return now.getTime() - (parseInt(str) || 1) * 3600 * 1000;
    
    const dayMatch = str.match(/(\d+)\s+day/);
    if (dayMatch) return now.getTime() - parseInt(dayMatch[1]) * 86400000;
    
    const weekMatch = str.match(/(\d+)\s+week/);
    if (weekMatch) return now.getTime() - parseInt(weekMatch[1]) * 7 * 86400000;
    
    const monthMatch = str.match(/(\d+)\s+month/);
    if (monthMatch) return now.getTime() - parseInt(monthMatch[1]) * 30 * 86400000;

    return 0; // oldest if parsing fails
  };

  const filteredJobs = searchState.data
    .filter(job => {
      // Bookmark Filter
      if (showBookmarkedOnly && !bookmarkedIds.includes(job.id)) {
          return false;
      }

      const matchesType = !filters.type || job.type.toLowerCase().includes(filters.type.toLowerCase());
      const matchesExp = !filters.experience || 
        (job.experienceLevel && job.experienceLevel.toLowerCase().includes(filters.experience.toLowerCase())) ||
        job.title.toLowerCase().includes(filters.experience.toLowerCase());
      
      const matchesQuery = !filters.query || 
        job.title.toLowerCase().includes(filters.query.toLowerCase()) || 
        job.tags.some(tag => tag.toLowerCase().includes(filters.query.toLowerCase()));

      let matchesDate = true;
      if (filters.dateRange) {
         const jobTime = parseRelativeTime(job.postedAt);
         const now = new Date().getTime();
         const diff = now - jobTime;
         if (filters.dateRange === '24h') matchesDate = diff <= 86400000;
         else if (filters.dateRange === '3d') matchesDate = diff <= 3 * 86400000;
         else if (filters.dateRange === '7d') matchesDate = diff <= 7 * 86400000;
         else if (filters.dateRange === '30d') matchesDate = diff <= 30 * 86400000;
      }

      return matchesType && matchesExp && matchesQuery && matchesDate;
    })
    .sort((a, b) => {
        // Sort by Newest First
        return parseRelativeTime(b.postedAt) - parseRelativeTime(a.postedAt);
    });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dev-900 text-slate-900 dark:text-dev-text font-sans selection:bg-dev-accent selection:text-white pb-10 transition-colors duration-300">
      
      {/* Header - Full Width */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-dev-900/95 backdrop-blur-md border-b border-slate-200 dark:border-dev-700 py-4 px-6 transition-colors duration-300">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 dark:bg-dev-800 p-2 rounded-lg border border-slate-200 dark:border-dev-700">
               <Terminal className="text-blue-600 dark:text-dev-accent" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                CodeSlot <span className="text-blue-600 dark:text-dev-accent text-xs px-1.5 py-0.5 rounded border border-blue-200 dark:border-dev-accent/30 bg-blue-50 dark:bg-dev-accent/10">BETA</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-dev-muted font-mono hidden sm:block">REMOTE_FRONTEND_JOBS_AGGREGATOR</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-dev-800 text-slate-600 dark:text-dev-muted hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-dev-700 transition-all hover:scale-105 active:scale-95"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Controls - Full Width */}
      <FilterBar 
        filters={filters} 
        setFilters={setFilters} 
        onRefresh={() => loadJobs(false)}
        isLoading={searchState.isLoading}
        showBookmarkedOnly={showBookmarkedOnly}
        setShowBookmarkedOnly={setShowBookmarkedOnly}
        bookmarkCount={bookmarkedIds.length}
      />

      {/* Main Layout - Full Width */}
      <main className="w-full px-4 md:px-8 relative">
        
        {/* Job List */}
        <div className="w-full">
          
          {searchState.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
               {[...Array(12)].map((_, i) => (
                 <div key={i} className="h-64 rounded-xl bg-white dark:bg-dev-800 border border-slate-200 dark:border-dev-700 p-5 space-y-4">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded bg-slate-200 dark:bg-dev-700"></div>
                     <div className="space-y-2 flex-1">
                       <div className="h-4 bg-slate-200 dark:bg-dev-700 rounded w-3/4"></div>
                       <div className="h-3 bg-slate-200 dark:bg-dev-700 rounded w-1/2"></div>
                     </div>
                   </div>
                   <div className="h-20 bg-slate-100 dark:bg-dev-700/50 rounded"></div>
                   <div className="flex gap-2">
                     <div className="h-5 w-16 bg-slate-200 dark:bg-dev-700 rounded"></div>
                     <div className="h-5 w-16 bg-slate-200 dark:bg-dev-700 rounded"></div>
                   </div>
                 </div>
               ))}
            </div>
          ) : searchState.error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle size={48} className="text-red-500 dark:text-dev-danger mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Error Fetching Jobs</h3>
              <p className="text-slate-500 dark:text-dev-muted max-w-md mb-6">{searchState.error}</p>
              <button 
                onClick={() => loadJobs(false)}
                className="px-6 py-2 bg-slate-200 dark:bg-dev-800 hover:bg-slate-300 dark:hover:bg-dev-700 border border-slate-300 dark:border-dev-600 rounded-md text-sm font-mono transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-lg font-mono text-slate-500 dark:text-dev-muted">
                {showBookmarkedOnly ? "No marked jobs found." : "No jobs found matching your filters."}
              </h3>
              <button 
                onClick={() => {
                    setFilters({ query: '', type: '', experience: '', dateRange: '' });
                    setShowBookmarkedOnly(false);
                }}
                className="mt-4 text-blue-600 dark:text-dev-accent hover:underline text-sm"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-end mb-4">
                 <h2 className="text-sm font-mono text-slate-500 dark:text-dev-muted">
                   {showBookmarkedOnly ? 'SAVED JOBS' : 'ALL JOBS'} — SHOWING {filteredJobs.length} RESULT(S)
                 </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
                {filteredJobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    onClick={setSelectedJob} 
                    isActive={selectedJob?.id === job.id}
                    isBookmarked={bookmarkedIds.includes(job.id)}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {!showBookmarkedOnly && (
                  <div className="flex justify-center pb-20">
                    <button 
                        onClick={() => loadJobs(true)}
                        disabled={isLoadingMore}
                        className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-dev-800 border border-slate-200 dark:border-dev-700 hover:border-blue-500 dark:hover:border-dev-accent rounded-full shadow-lg hover:shadow-xl transition-all text-slate-600 dark:text-dev-text font-bold"
                    >
                        {isLoadingMore ? (
                            <>
                                <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                                Loading More Jobs...
                            </>
                        ) : (
                            <>
                                <ArrowDownCircle size={20} className="text-blue-600 dark:text-dev-accent" />
                                Load More Jobs
                            </>
                        )}
                    </button>
                  </div>
              )}
            </>
          )}
        </div>

        {/* Backdrop for Detail Panel */}
        {selectedJob && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setSelectedJob(null)}
          ></div>
        )}

        {/* Details Panel Overlay */}
        <JobDetailPanel 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
          isBookmarked={selectedJob ? bookmarkedIds.includes(selectedJob.id) : false}
          onToggleBookmark={toggleBookmark}
        />

      </main>
    </div>
  );
}