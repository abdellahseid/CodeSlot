import { Plugin } from 'vite';
import { Job } from '../types';

let cache: { jobs: Job[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

function cleanHtml(rawHtml: string = ''): string {
  if (!rawHtml) return '';
  return rawHtml
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}

function inferCategory(title: string = '', tags: string[] = []): string {
  const t = (title + ' ' + tags.join(' ')).toLowerCase();
  if (t.includes('frontend') || t.includes('react') || t.includes('vue') || t.includes('angular') || t.includes('css') || t.includes('web developer')) {
    return 'Frontend';
  }
  if (t.includes('backend') || t.includes('node') || t.includes('express') || t.includes('django') || t.includes('spring') || t.includes('rails')) {
    return 'Backend';
  }
  if (t.includes('fullstack') || t.includes('full-stack') || t.includes('full stack')) {
    return 'Fullstack';
  }
  if (t.includes('mobile') || t.includes('ios') || t.includes('android') || t.includes('react native') || t.includes('flutter')) {
    return 'Mobile';
  }
  if (t.includes('devops') || t.includes('cloud') || t.includes('aws') || t.includes('kubernetes') || t.includes('sre') || t.includes('infrastructure')) {
    return 'DevOps';
  }
  if (t.includes('ai') || t.includes('machine learning') || t.includes('ml') || t.includes('data engineer') || t.includes('python')) {
    return 'AI / Data';
  }
  if (t.includes('qa') || t.includes('test') || t.includes('automation') || t.includes('quality')) {
    return 'QA / Testing';
  }
  return 'Software Engineering';
}

function inferExperience(title: string = '', description: string = ''): 'Junior' | 'Mid' | 'Senior' | 'Lead' {
  const text = (title + ' ' + description).toLowerCase();
  if (text.includes('lead') || text.includes('staff') || text.includes('principal') || text.includes('head') || text.includes('architect')) {
    return 'Lead';
  }
  if (text.includes('senior') || text.includes('sr.') || text.includes('sr ')) {
    return 'Senior';
  }
  if (text.includes('junior') || text.includes('jr.') || text.includes('entry') || text.includes('intern')) {
    return 'Junior';
  }
  return 'Mid';
}

async function fetchRemotive(): Promise<Job[]> {
  const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CodeSlot/1.0' };
  try {
    const res = await fetch('https://remotive.com/api/remote-jobs?category=software-dev', { headers });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.jobs || !Array.isArray(data.jobs)) return [];
    
    return data.jobs.map((j: any) => {
      const title = j.title || 'Software Developer';
      const tags = j.tags || [];
      return {
        id: 'remotive-' + (j.id || Math.random().toString(36).substring(7)),
        title,
        company: j.company_name || 'Tech Company',
        location: j.candidate_required_location || 'Worldwide Remote',
        type: j.job_type === 'full_time' ? 'Full-time' : j.job_type === 'contract' ? 'Contract' : 'Full-time',
        salary: j.salary || 'Competitive',
        tags: tags.length ? tags : ['Software', 'Remote'],
        description: cleanHtml(j.description),
        postedAt: j.publication_date ? new Date(j.publication_date).toLocaleDateString() : 'Recently',
        applyLink: j.url || 'https://remotive.com',
        experienceLevel: inferExperience(title, j.description),
        source: 'Remotive',
        category: inferCategory(title, tags),
        companyLogo: j.company_logo || undefined
      };
    });
  } catch (e) {
    console.error('Error fetching Remotive:', e);
    return [];
  }
}

async function fetchJobicy(): Promise<Job[]> {
  const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CodeSlot/1.0' };
  try {
    const res = await fetch('https://jobicy.com/api/v2/remote-jobs?count=50&industry=dev', { headers });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.jobs || !Array.isArray(data.jobs)) return [];

    return data.jobs.map((j: any) => {
      const title = j.jobTitle || 'Software Engineer';
      const tags = Array.isArray(j.jobCategory) ? j.jobCategory : [j.jobIndustry || 'Dev'];
      const salaryStr = (j.annualSalaryMin && j.annualSalaryMax)
        ? `$${Number(j.annualSalaryMin).toLocaleString()} - $${Number(j.annualSalaryMax).toLocaleString()}`
        : 'Competitive';

      return {
        id: 'jobicy-' + (j.id || Math.random().toString(36).substring(7)),
        title,
        company: j.companyName || 'Technology Firm',
        location: j.jobGeo || 'Worldwide Remote',
        type: Array.isArray(j.jobType) ? (j.jobType[0] || 'Full-time') : (j.jobType || 'Full-time'),
        salary: salaryStr,
        tags: tags.length ? tags : ['Software'],
        description: cleanHtml(j.jobDescription || j.jobExcerpt),
        postedAt: j.pubDate ? new Date(j.pubDate).toLocaleDateString() : 'Recently',
        applyLink: j.url || 'https://jobicy.com',
        experienceLevel: j.jobLevel ? (j.jobLevel.charAt(0).toUpperCase() + j.jobLevel.slice(1)) : inferExperience(title, j.jobDescription),
        source: 'Jobicy',
        category: inferCategory(title, tags),
        companyLogo: j.companyLogo || undefined
      };
    });
  } catch (e) {
    console.error('Error fetching Jobicy:', e);
    return [];
  }
}

async function fetchArbeitnow(): Promise<Job[]> {
  const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CodeSlot/1.0' };
  try {
    const res = await fetch('https://www.arbeitnow.com/api/job-board-api', { headers });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.data || !Array.isArray(data.data)) return [];

    return data.data
      .filter((j: any) => {
        const text = (j.title + ' ' + (j.tags || []).join(' ')).toLowerCase();
        return text.includes('developer') || text.includes('engineer') || text.includes('software') || text.includes('frontend') || text.includes('backend') || text.includes('fullstack') || text.includes('tech');
      })
      .map((j: any) => {
        const title = j.title || 'Software Engineer';
        const tags = j.tags || [];
        const loc = j.location ? `${j.location}${j.remote ? ' (Remote)' : ''}` : 'Remote';

        return {
          id: 'arbeitnow-' + (j.slug || Math.random().toString(36).substring(7)),
          title,
          company: j.company_name || 'Software Company',
          location: loc,
          type: Array.isArray(j.job_types) ? (j.job_types.join(', ') || 'Full-time') : 'Full-time',
          salary: 'Competitive',
          tags: tags.length ? tags : ['Software', 'Engineering'],
          description: cleanHtml(j.description),
          postedAt: j.created_at ? new Date(j.created_at * 1000).toLocaleDateString() : 'Recently',
          applyLink: j.url || 'https://www.arbeitnow.com',
          experienceLevel: inferExperience(title, j.description),
          source: 'Arbeitnow',
          category: inferCategory(title, tags)
        };
      });
  } catch (e) {
    console.error('Error fetching Arbeitnow:', e);
    return [];
  }
}

async function fetchRemoteOK(): Promise<Job[]> {
  const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CodeSlot/1.0' };
  try {
    const res = await fetch('https://remoteok.com/api', { headers });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data
      .filter((j: any) => j && j.position)
      .map((j: any) => {
        const title = j.position || 'Software Engineer';
        const tags = j.tags || [];
        const salaryStr = (j.salary_min && j.salary_max)
          ? `$${Number(j.salary_min).toLocaleString()} - $${Number(j.salary_max).toLocaleString()}`
          : 'Competitive';

        return {
          id: 'remoteok-' + (j.id || Math.random().toString(36).substring(7)),
          title,
          company: j.company || 'Tech Start-up',
          location: j.location || 'Worldwide Remote',
          type: 'Full-time',
          salary: salaryStr,
          tags: tags.length ? tags : ['Remote', 'Software'],
          description: cleanHtml(j.description),
          postedAt: j.date ? new Date(j.date).toLocaleDateString() : 'Recently',
          applyLink: j.apply_url || j.url || 'https://remoteok.com',
          experienceLevel: inferExperience(title, j.description),
          source: 'RemoteOK',
          category: inferCategory(title, tags),
          companyLogo: j.company_logo || j.logo || undefined
        };
      });
  } catch (e) {
    console.error('Error fetching RemoteOK:', e);
    return [];
  }
}

async function fetchHackerNewsJobs(): Promise<Job[]> {
  const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CodeSlot/1.0' };
  try {
    const res = await fetch('https://hn.algolia.com/api/v1/search_by_date?tags=job&hitsPerPage=30', { headers });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.hits || !Array.isArray(data.hits)) return [];

    return data.hits.map((j: any) => {
      const rawTitle = j.title || 'Software Engineer';
      let company = 'Hacker News Startup';
      let title = rawTitle;

      if (rawTitle.includes('Is Hiring') || rawTitle.includes('is hiring')) {
        const parts = rawTitle.split(/is hiring/i);
        company = parts[0].trim();
        title = parts[1] ? parts[1].replace(/^[:\s\-]+/, '').trim() : rawTitle;
      }

      return {
        id: 'hn-' + (j.objectID || Math.random().toString(36).substring(7)),
        title: title || rawTitle,
        company: company || 'Hacker News Startup',
        location: 'Worldwide Remote',
        type: 'Full-time',
        salary: 'Competitive',
        tags: ['Hacker News', 'Software', 'Startup'],
        description: `Official job posting from ${company} on Hacker News. Apply directly using the link below.`,
        postedAt: j.created_at ? new Date(j.created_at).toLocaleDateString() : 'Recently',
        applyLink: j.url || `https://news.ycombinator.com/item?id=${j.objectID}`,
        experienceLevel: inferExperience(title, ''),
        source: 'Hacker News',
        category: inferCategory(title, ['Software'])
      };
    });
  } catch (e) {
    console.error('Error fetching HackerNews:', e);
    return [];
  }
}

export async function fetchAllLiveJobs(): Promise<Job[]> {
  if (cache && (Date.now() - cache.timestamp < CACHE_TTL_MS)) {
    return cache.jobs;
  }

  const results = await Promise.allSettled([
    fetchRemotive(),
    fetchJobicy(),
    fetchArbeitnow(),
    fetchRemoteOK(),
    fetchHackerNewsJobs()
  ]);

  const allJobs: Job[] = [];
  const seenUrls = new Set<string>();

  for (const res of results) {
    if (res.status === 'fulfilled' && Array.isArray(res.value)) {
      for (const job of res.value) {
        if (job.applyLink && !seenUrls.has(job.applyLink)) {
          seenUrls.add(job.applyLink);
          allJobs.push(job);
        }
      }
    }
  }

  cache = {
    jobs: allJobs,
    timestamp: Date.now()
  };

  return allJobs;
}

export function jobApiPlugin(): Plugin {
  return {
    name: 'job-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/jobs', async (req, res) => {
        try {
          const urlObj = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
          const query = (urlObj.searchParams.get('query') || '').toLowerCase();
          const category = urlObj.searchParams.get('category') || '';
          const type = urlObj.searchParams.get('type') || '';
          const experience = urlObj.searchParams.get('experience') || '';
          const location = urlObj.searchParams.get('location') || '';

          let jobs = await fetchAllLiveJobs();

          if (query) {
            jobs = jobs.filter(j =>
              j.title.toLowerCase().includes(query) ||
              j.company.toLowerCase().includes(query) ||
              j.tags.some(t => t.toLowerCase().includes(query)) ||
              j.description.toLowerCase().includes(query)
            );
          }

          if (category) {
            jobs = jobs.filter(j => j.category === category);
          }

          if (type) {
            jobs = jobs.filter(j => j.type.toLowerCase().includes(type.toLowerCase()));
          }

          if (experience) {
            jobs = jobs.filter(j => j.experienceLevel?.toLowerCase().includes(experience.toLowerCase()));
          }

          if (location) {
            jobs = jobs.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify({ status: 'success', count: jobs.length, data: jobs }));
        } catch (error) {
          console.error('API Error in /api/jobs:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'error', message: 'Failed to fetch software jobs' }));
        }
      });
    }
  };
}
