export interface Job {
  id: string;
  title: string;
  company: string;
  location: string; // Should always confirm remote/worldwide
  type: 'Full-time' | 'Contract' | 'Part-time' | 'Freelance';
  salary?: string;
  tags: string[];
  description: string;
  postedAt: string;
  applyLink?: string;
  experienceLevel?: 'Junior' | 'Mid' | 'Senior' | 'Lead';
}

export interface SearchFilters {
  query: string;
  type: string;
  experience: string;
  dateRange: string;
}

export interface SearchState {
  isLoading: boolean;
  error: string | null;
  data: Job[];
}