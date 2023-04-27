import React, { useEffect, useState } from 'react';
import { FieldSchema, StringInputProps } from '../types';
import { Input } from 'antd';
import '../index.css';

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

  const [isFocused, setIsFocused] = useState<boolean>(false);
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
      className={`wand__inline-filter__string-input ${field.className || ''} ${isFocused || (internalValue && internalValue.length > 0) ? 'wand__inline-filter__string-input--is-focused' : ''}`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={field.style || {}}
      value={internalValue}
      onChange={handleChange}
      addonBefore={field.icon}
      placeholder={placeholder}
    />
  )
}

export default StringFilter;
