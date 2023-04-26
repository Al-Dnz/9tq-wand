import { Space } from 'antd';
import React from 'react';
import DateFilter from './fields/DateFilter';
import SelectFilter from './fields/SelectFilter';
import StringFilter from './fields/StringFilter';

const renderDate = () => {
  return (
    <Space>
      Render date
    </Space>
  )
}

export const renderValue = (props) => {
  const {
    field,
    value
  } = props;
  return (
    <Space>
      {field.label}
    </Space>
  )
}

export const renderValueForType = {
  date: renderDate
}

export const filterForType = {
  select: SelectFilter,
  date: DateFilter,
  string: StringFilter,
}

export const filterOption = (input: string, option: any) =>
  option.label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .indexOf(
      input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''),
    ) >= 0;
