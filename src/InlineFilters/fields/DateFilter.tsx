import React, { useEffect, useRef, useState } from 'react';
import { DateInputProps, FieldSchema, SelectInputProps } from '../types';
import SVG from 'react-inlinesvg';
import { Badge, Checkbox, DatePicker, Input, Popover, Space } from 'antd';
import { useSelections } from 'ahooks';
import scopeSvg from '../icons/scope.svg';
import '../index.css';
import { filterOption } from '../_utils';
import moment from 'moment';

type FilterProps = {
  field: FieldSchema;
  value: any;
  onChange: (name: string, value: any) => void;
};

const DateFilter: React.FC<FilterProps> = props => {
  const {
    field,
    value,
    onChange,
  } = props;

  const {
    inputProps = {}
  } = (field.input || {}) as DateInputProps;

  const [internalValue, setInternalValue] = useState<moment.Moment | undefined>(undefined);


  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (value) => {
    setInternalValue(value);
    onChange(field.name, value)
  }

  return (
    <DatePicker
      {...inputProps}
      placeholder={field.label}
      className={`wand__inline-filter__datepicker ${internalValue ? 'wand__inline-filter__datepicker--filled' : ''}`}
      value={internalValue}
      onChange={handleChange}
    />
  )
}

export default DateFilter;
