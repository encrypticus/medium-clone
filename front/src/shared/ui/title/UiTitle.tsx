'use client';
import type { FC } from 'react';
import type { TitleProps } from 'antd/es/typography/Title';
import { Typography } from 'antd';

interface UiTitleProps extends TitleProps {
  text?: string;
}

export const UiTitle: FC<UiTitleProps> = ({ text, ...props }) => {
  return <Typography.Title {...props}>{text}</Typography.Title>;
};
