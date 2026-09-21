import { Job, SearchFilters } from '../types';

export const fetchRealSoftwareJobs = async (filters: SearchFilters): Promise<Job[]> => {
  try {
    const params = new URLSearchParams();
    if (filters.query) params.append('query', filters.query);
    if (filters.category) params.append('category', filters.category);
    if (filters.type) params.append('type', filters.type);
    if (filters.experience) params.append('experience', filters.experience);
    if (filters.location) params.append('location', filters.location);

    const res = await fetch(`/api/jobs?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (error) {
    console.warn('API route /api/jobs unreachable, attempting direct client fallback:', error);
  }

  // Client-side fallback if server route is unavailable
  return fetchClientFallbackJobs(filters);
};

async function fetchClientFallbackJobs(filters: SearchFilters): Promise<Job[]> {
  const jobs: Job[] = [];

  // Helper HTML cleaner
  const cleanHtml = (raw: string = '') => raw.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim();

  try {
    const res = await fetch('https://jobicy.com/api/v2/remote-jobs?count=50&industry=dev');
    if (res.ok) {
      const data = await res.json();
      if (data.jobs && Array.isArray(data.jobs)) {
        data.jobs.forEach((j: any) => {
          jobs.push({
            id: 'jobicy-' + j.id,
            title: j.jobTitle || 'Software Engineer',
            company: j.companyName || 'Tech Firm',
            location: j.jobGeo || 'Remote',
            type: Array.isArray(j.jobType) ? (j.jobType[0] || 'Full-time') : 'Full-time',
            salary: (j.annualSalaryMin && j.annualSalaryMax) ? `$${j.annualSalaryMin} - $${j.annualSalaryMax}` : 'Competitive',
            tags: Array.isArray(j.jobCategory) ? j.jobCategory : ['Software'],
            description: cleanHtml(j.jobDescription || j.jobExcerpt),
            postedAt: j.pubDate ? new Date(j.pubDate).toLocaleDateString() : 'Recently',
            applyLink: j.url,
            experienceLevel: j.jobLevel || 'Mid',
            source: 'Jobicy',
            category: 'Software Engineering'
          });
        });
      }
    }
  } catch (e) {
    console.error('Jobicy fallback error:', e);
  }

  try {
    const res = await fetch('https://www.arbeitnow.com/api/job-board-api');
    if (res.ok) {
      const data = await res.json();
      if (data.data && Array.isArray(data.data)) {
        data.data.forEach((j: any) => {
          jobs.push({
            id: 'arbeitnow-' + j.slug,
            title: j.title || 'Software Developer',
            company: j.company_name || 'Software Company',
            location: j.location ? `${j.location}${j.remote ? ' (Remote)' : ''}` : 'Remote',
            type: 'Full-time',
            salary: 'Competitive',
            tags: j.tags || ['Software'],
            description: cleanHtml(j.description),
            postedAt: j.created_at ? new Date(j.created_at * 1000).toLocaleDateString() : 'Recently',
            applyLink: j.url,
            experienceLevel: 'Mid',
            source: 'Arbeitnow',
            category: 'Software Engineering'
          });
        });
      }
    }
  } catch (e) {
    console.error('Arbeitnow fallback error:', e);
  }

  return jobs;
}
