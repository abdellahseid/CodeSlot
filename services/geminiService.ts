import { fetchRealSoftwareJobs } from './jobService';
import { Job } from '../types';

export const fetchJobsWithGemini = async (searchQuery: string = ""): Promise<Job[]> => {
  return fetchRealSoftwareJobs({
    query: searchQuery,
    category: '',
    type: '',
    experience: '',
    location: '',
    dateRange: ''
  });
};