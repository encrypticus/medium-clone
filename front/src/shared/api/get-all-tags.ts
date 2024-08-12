import axios, { AxiosError } from 'axios';
import { Api } from '@/src/shared/endpoints';

export const getAllTags = async (): Promise<{ tags: string[] }> => {
  try {
    const res = await axios.get(Api.tags.getTagList);
    return res.data;
  } catch (error) {
    throw new AxiosError('Failed to fetch tags');
  }
};
