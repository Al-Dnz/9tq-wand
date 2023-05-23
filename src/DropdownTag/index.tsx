import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Tag, TagProps } from 'antd';
import React from 'react';

type OptionType = {
  value: string | number;
  label: string | React.ReactNode;
}

type DropdownTagProps = {
  children?: React.ReactNode | React.ReactNode[] | Element;
  options: OptionType[];
  undefinedText?: string;
  value: string | number;
  style?: React.CSSProperties;
  onChange: (value: string | number) => void;
  className?: string;
} & TagProps;

const DropdownTag: React.FC<DropdownTagProps> = props => {
  const {
    options,
    children,
    value,
    style = {},
    className = "",
    undefinedText = "Undefined",
    onChange,
    ...rest
  } = props;

  const items = options.filter(o => o.value !== value).map(option => ({
    key: option.value,
    label: option.label
  }));

  const selectedOption = value ? options.find(o => o.value === value) : null;
  const onSelect = ({ key }) => onChange(key)
  return (
    <Dropdown menu={{ items, onClick: onSelect }}>
      <Tag className={className} style={style} {...rest}>
        <Space>
          {children || selectedOption?.label || undefinedText}
          <DownOutlined />
        </Space>
      </Tag>
    </Dropdown>
  )
}

export default DropdownTag;
