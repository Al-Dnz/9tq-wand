// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { DateInputProps, FieldSchema } from '../types';
import { DatePicker } from 'antd';
import '../index.css';
import moment, { isMoment } from 'moment';

const { RangePicker } = DatePicker;

type FilterProps = {
  field: FieldSchema;
  value: any;
  onChange: (values: any) => void;
};

type ValueType = {
  [k: string]: string | moment.Moment
};

const DateRangeFilter: React.FC<FilterProps> = props => {
  const {
    field,
    value,
    onChange,
  } = props;

  const {
    inputProps = {}
  } = (field.input || {}) as DateInputProps;

  // @ts-ignore
  const [startName, endName] = field.name;
  const [internalValue, setInternalValue] = useState<ValueType>(value || {});

  useEffect(() => {
    setInternalValue(value || {})
  }, [value])

  const handleChange = (mDates: [moment.Moment, moment.Moment]) => {
    const nextValues = {
      [startName]: mDates ? mDates[0] : undefined,
      [endName]: mDates ? mDates[1] : undefined,
    }
    onChange(nextValues);
    setInternalValue(nextValues);
  }


  let from = internalValue[startName];
  if(from && !moment.isMoment(from)) from = moment(from).startOf('day');

  let to = internalValue[endName];
  if(to && !moment.isMoment(to)) to = moment(to).startOf('day');

  const v = [
    from,
    to
  ];

  const filled = v.filter(Boolean).length > 0;

  return (
    <RangePicker
      {...(inputProps || {})}
      className={`wand__inline-filter__datepicker ${filled ? 'wand__inline-filter__datepicker--filled' : ''}`}
      value={v}
      onChange={handleChange}
    />
  )
}

export default DateRangeFilter;
