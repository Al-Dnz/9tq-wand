import React, { useEffect, useRef, useState } from 'react';
import { DateInputProps, FieldSchema, SelectInputProps } from '../types';
import SVG from 'react-inlinesvg';
import { DatePicker } from 'antd';
import '../index.css';
import { filterOption } from '../_utils';
import moment, { isMoment } from 'moment';

type FilterProps = {
  field: FieldSchema;
  value: any;
  onChange: (values: any) => void;
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

  const [internalValue, setInternalValue] = useState<moment.Moment | undefined>(isMoment(value) ? value : (moment(value).isValid() ? moment(value) : undefined));

  useEffect(() => {
    setInternalValue(isMoment(value) ? value : (moment(value).isValid() ? moment(value) : undefined));
  }, [value]);

  const handleChange = (value) => {
    setInternalValue(value);
    onChange({ [field.name]: value })
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
