// @ts-nocheck
import { Space } from 'antd';
import React from 'react';
import styles from './index.module.css';

type ValueType = {
  description?: string;
  value: string;
};

type Item = {
  header: string;
  description: string;
  values: Array<ValueType>;
};

type CSVNoticeProps = {
  schema: Array<Item>;
};

const CSVNoticeItem: React.FC<Item> = ({ header, values, description }) => (
  <Space align="start" className={`${styles.item} wand-csv-notice-item`} key={header}>
    <code>{header}</code>
    <div>
      {description}
      {values && values.length > 0 && (
        <ul>
          {values.map(({ value, description }) => (
            <li key={value}>
              <Space>
                <strong>{value}</strong>
                {description}
              </Space>
            </li>
          ))}
        </ul>
      )}
    </div>
  </Space>
);

const CSVNotice: React.FC<CSVNoticeProps> = (props) => {
  const { schema = [] } = props;
  return (
    <div className={`${styles.container} wand-csv-notice-container`}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {schema.map((item) => (
          <CSVNoticeItem key={item.header} {...item} />
        ))}
      </Space>
    </div>
  );
};

export default CSVNotice;
