import { HttpException, HttpStatus } from '@nestjs/common';

export const UnifiedError = ({
  title,
  message,
  httpStatus,
}: {
  title: string;
  message: string;
  httpStatus: HttpStatus;
}) => {
  const errorResponse = {
    errors: {},
  };
  errorResponse.errors[title] = message;
  return new HttpException(errorResponse, httpStatus);
};
