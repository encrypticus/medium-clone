import axios from 'axios';
import { Routes } from '@/src/shared/routes';

import { useRouter } from 'next/navigation';
import { useNotification } from '@/src/shared/ui/notification';
import { useAuth } from '@/src/shared/lib/auth-context';

export const useGetTokenFromCookie = () => {
  const { login } = useAuth();
  const { push } = useRouter();
  const { showNotification } = useNotification({
    message: 'Unauthorized',
    type: 'error',
  });

  const getToken = async (withRedirect: boolean = true) => {
    const tokenRes = await axios.get<{ token: string | undefined }>(
      Routes.api.auth,
    );

    if (!tokenRes.data.token && withRedirect) {
      push(Routes.client.signIn);
      showNotification();
      login?.(false);
    }

    return tokenRes.data.token;
  };

  return {
    getToken,
  };
};
