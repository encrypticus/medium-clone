import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ErrorResponse } from '@/src/shared/lib';
import { useGetTokenFromCookie, useResponseError } from '@/src/shared/lib';
import type { CommentResponse, CreateCommentDto } from '@/src/entities/comment';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { Api } from '@/src/shared/endpoints';
import { queryKeys } from '@/src/shared/query-keys';

export const useAddComment = () => {
  const { onError } = useResponseError();
  const queryClient = useQueryClient();
  const { getToken } = useGetTokenFromCookie();

  return useMutation<
    CommentResponse,
    AxiosError<ErrorResponse>,
    CreateCommentDto
  >({
    mutationFn: async (variables) => {
      const token = await getToken();
      if (!token) return;

      const res = await axios.post(
        Api.comments.create,
        {
          comment: variables,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      return res.data;
    },

    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.articles.article.bySlug(
            data.comment.article.slug,
          ),
        });
      }
    },

    onError,
  });
};
