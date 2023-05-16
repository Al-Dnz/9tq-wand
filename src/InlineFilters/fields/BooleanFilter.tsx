import React, { useEffect, useState } from 'react';
import { Space, Checkbox } from 'antd';
import { BooleanInputProps, FieldSchema, StringInputProps } from '../types';
import { Input } from 'antd';
import '../index.css';

type FilterProps = {
  field: FieldSchema;
  value: any;
  onChange: (values: any) => void;
};

const BooleanFilter: React.FC<FilterProps> = props => {
  const {
    field,
    value,
    onChange,
  } = props;

  const {
    inputProps: {
      inverted = false,
      className,
      text
    } = {},
  } = (field.input || {}) as BooleanInputProps;

  const [internalValue, setInternalValue] = useState<boolean>(false);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e) => {
    setInternalValue(!internalValue);
    onChange({ [field.name]: !internalValue })
  }

  return (
    <div onClick={handleChange} className={`wand__inline-filter__filter wand__inline-filter__boolean ${internalValue ? 'wand__inline-filter__boolean--checked' : ''}`}>
      <Space>
        <Checkbox checked={internalValue} />
        {field.label}
      </Space>
    </div>
  )
}

export default BooleanFilter;
