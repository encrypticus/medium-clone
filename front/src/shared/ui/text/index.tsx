'use client';
import type { TextProps } from 'antd/es/typography/Text';
import type { FC } from 'react';
import { Typography } from 'antd';

interface UiTextProps extends TextProps {
  text: string;
}

export const UiText: FC<UiTextProps> = ({ text, ...props }) => {
  return <Typography.Text {...props}>{text}</Typography.Text>;
};
