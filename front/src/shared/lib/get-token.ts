import { cookies } from 'next/headers';
import { JWT_TOKEN_KEY } from '@/src/shared/constants';

export const getToken = (): string | undefined => {
  const cookieStore = cookies();
  const token = cookieStore.get(JWT_TOKEN_KEY);
  return token?.value;
};
