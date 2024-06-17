// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { DateInputProps, FieldSchema } from '../types';
import { DatePicker } from 'antd';
import '../index.css';
import dayjs, { isDayjs } from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)

type FilterProps = {
  field: FieldSchema;
  value: any;
  onChange: (values: any) => void;
};

const castDefaultValue = (value: string | dayjs.Dayjs) => {
  if (value) {
    if (isDayjs(value)) return value;
    if (dayjs(value).isValid()) return dayjs(value);
  }
  return value
}

const DateFilter: React.FC<FilterProps> = props => {
  const {
    field,
    value,
    onChange,
  } = props;

  const {
    inputProps = {}
  } = (field.input || {}) as DateInputProps;

  const [internalValue, setInternalValue] = useState<dayjs.Dayjs | undefined>(castDefaultValue(value));

  useEffect(() => {
    setInternalValue(castDefaultValue(value));
  }, [value]);

  const handleChange = (value) => {
    setInternalValue(value);
    onChange({ [field.name]: value });
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
