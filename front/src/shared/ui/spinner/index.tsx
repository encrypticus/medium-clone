import type { SpinProps } from 'antd';
import { Spin } from 'antd';
import styles from './spinner.module.css';
import type { FC } from 'react';

export const Spinner: FC<SpinProps> = (props) => {
  return (
    <div className={styles.view}>
      <Spin size={'large'} {...props} />
    </div>
  );
};
