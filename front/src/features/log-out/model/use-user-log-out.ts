import { useGetTokenFromCookie } from '@/src/shared/lib';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import { Api } from '@/src/shared/endpoints';

export const useUserLogOut = () => {
  const { getToken } = useGetTokenFromCookie();

  return useSWRMutation('user-log-out', async () => {
    const token = await getToken();
    await axios.post(Api.auth.logOut, undefined, {
      headers: {
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    });
  });
};
