import { Job, SearchFilters } from '../types';

function normalizeTags(rawTags: any): string[] {
  if (!rawTags) return ['Software'];
  if (Array.isArray(rawTags)) {
    const list = rawTags
      .map(t => {
        if (typeof t === 'string') return t.trim();
        if (typeof t === 'number') return String(t);
        if (t && typeof t === 'object') return t.name || t.label || t.title || String(t);
        return '';
      })
      .filter(Boolean);
    return list.length ? list : ['Software'];
  }
  if (typeof rawTags === 'string') {
    const split = rawTags.split(',').map(s => s.trim()).filter(Boolean);
    return split.length ? split : ['Software'];
  }
  return ['Software'];
}

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
        return data.data.map((j: any) => ({
          ...j,
          tags: normalizeTags(j.tags)
        }));
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

  const cleanHtml = (raw: string = '') => String(raw || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim();

  try {
    const res = await fetch('https://jobicy.com/api/v2/remote-jobs?count=50&industry=dev');
    if (res.ok) {
      const data = await res.json();
      if (data.jobs && Array.isArray(data.jobs)) {
        data.jobs.forEach((j: any) => {
          jobs.push({
            id: 'jobicy-' + j.id,
            title: String(j.jobTitle || 'Software Engineer'),
            company: String(j.companyName || 'Tech Firm'),
            location: String(j.jobGeo || 'Remote'),
            type: Array.isArray(j.jobType) ? String(j.jobType[0] || 'Full-time') : 'Full-time',
            salary: (j.annualSalaryMin && j.annualSalaryMax) ? `$${j.annualSalaryMin} - $${j.annualSalaryMax}` : 'Competitive',
            tags: normalizeTags(j.jobCategory || j.jobIndustry),
            description: cleanHtml(j.jobDescription || j.jobExcerpt),
            postedAt: j.pubDate ? new Date(j.pubDate).toLocaleDateString() : 'Recently',
            applyLink: String(j.url || 'https://jobicy.com'),
            experienceLevel: String(j.jobLevel || 'Mid'),
            source: 'Jobicy',
            category: 'Software Engineering',
            companyLogo: j.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(String(j.companyName || 'Tech'))}&background=0284c7&color=ffffff&bold=true`
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
            title: String(j.title || 'Software Developer'),
            company: String(j.company_name || 'Software Company'),
            location: j.location ? `${j.location}${j.remote ? ' (Remote)' : ''}` : 'Remote',
            type: 'Full-time',
            salary: 'Competitive',
            tags: normalizeTags(j.tags),
            description: cleanHtml(j.description),
            postedAt: j.created_at ? new Date(j.created_at * 1000).toLocaleDateString() : 'Recently',
            applyLink: String(j.url || 'https://www.arbeitnow.com'),
            experienceLevel: 'Mid',
            source: 'Arbeitnow',
            category: 'Software Engineering',
            companyLogo: j.company_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(String(j.company_name || 'Tech'))}&background=0284c7&color=ffffff&bold=true`
          });
        });
      }
    }
  } catch (e) {
    console.error('Arbeitnow fallback error:', e);
  }

  return jobs;
}
