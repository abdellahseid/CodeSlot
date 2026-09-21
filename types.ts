export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Part-time' | 'Freelance' | string;
  salary?: string;
  tags: string[];
  description: string;
  postedAt: string;
  applyLink?: string;
  experienceLevel?: 'Junior' | 'Mid' | 'Senior' | 'Lead' | string;
  source?: string;
  category?: string;
  companyLogo?: string;
}

export interface SearchFilters {
  query: string;
  category: string;
  type: string;
  experience: string;
  location: string;
  dateRange: string;
}

export interface SearchState {
  isLoading: boolean;
  error: string | null;
  data: Job[];
}