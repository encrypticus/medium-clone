'use client';
import type { FC } from 'react';
import { Typography } from 'antd';
import type { ParagraphProps } from 'antd/es/typography/Paragraph';

interface UiParagraphProps extends ParagraphProps {
  text?: string;
}

export const UiParagraph: FC<UiParagraphProps> = ({ text, ...props }) => {
  return <Typography.Paragraph {...props}>{text}</Typography.Paragraph>;
};
