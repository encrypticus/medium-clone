import type { AxiosError } from 'axios';
import { App } from 'antd';

export type ErrorResponse = {
  errors?: Record<string, string>;
};

export const useResponseError = () => {
  const { notification } = App.useApp();

  const onError = (error: AxiosError<ErrorResponse>) => {
    if (error.response) {
      if (error.response.data.errors) {
        const entries = Object.entries(error.response.data.errors);

        entries.forEach((item) => {
          let message = '';
          item.forEach((value) => {
            message += `${value} `;
          });

          notification.error({ message });
        });
      } else {
        notification.error({ message: error.response.data as string });
      }
    }
  };

  return {
    onError,
  };
};
