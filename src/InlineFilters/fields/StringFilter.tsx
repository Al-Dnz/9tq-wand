import React, { useEffect, useRef, useState } from 'react';
import { FieldSchema, SelectInputProps, StringInputProps } from '../types';
import SVG from 'react-inlinesvg';
import { Badge, Checkbox, Input, Popover, Space } from 'antd';
import { useSelections } from 'ahooks';
import scopeSvg from '../icons/scope.svg';
import '../index.css';
import { filterOption } from '../_utils';

type FilterProps = {
  field: FieldSchema;
  value: any;
  onChange: (name: string, value: any) => void;
};

const StringFilter: React.FC<FilterProps> = props => {
  const {
    field,
    value,
    onChange,
  } = props;

  const {
    placeholder,
  } = (field.input || {}) as StringInputProps;

  const [internalValue, setInternalValue] = useState<string | undefined>(undefined);


  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e) => {
    setInternalValue(e.target.value);
    onChange(field.name, e.target.value)
  }

  return (
    <Input
      className={`wand__inline-filter__string-input ${field.className || ''}`}
      value={internalValue}
      onChange={handleChange}
      addonBefore={field.icon}
      placeholder={placeholder}
    />
  )
}

export default StringFilter;
