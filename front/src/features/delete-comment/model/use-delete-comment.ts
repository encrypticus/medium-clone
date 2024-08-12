import type { ErrorResponse } from '@/src/shared/lib';
import { useGetTokenFromCookie, useResponseError } from '@/src/shared/lib';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { DeleteCommentResponse } from '@/src/entities/comment';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { Api } from '@/src/shared/endpoints';
import { queryKeys } from '@/src/shared/query-keys';

export const useDeleteComment = () => {
  const { onError } = useResponseError();
  const queryClient = useQueryClient();
  const { getToken } = useGetTokenFromCookie();

  return useMutation<
    DeleteCommentResponse,
    AxiosError<ErrorResponse>,
    { articleSlug: string; commentId: number }
  >({
    mutationFn: async ({ commentId }) => {
      const token = await getToken();
      if (!token) return;

      const res = await axios.delete(`${Api.comments.delete}/${commentId}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      return res.data;
    },

    onSuccess: (_, { articleSlug }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.articles.article.bySlug(articleSlug),
      });
    },

    onError,
  });
};
