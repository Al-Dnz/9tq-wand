import { useDebounceFn } from 'ahooks';
import { Button, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import SelectFilter from './fields/SelectFilter';
import { InlineFilterSchema } from './types';
import { filterForType } from './_utils';

type InlineFiltersProps = {
  schema: InlineFilterSchema;
  value: any;
  delay?: number;
  resetText?: string;
  onReset: () => void;
  onChange: (object: any) => void;
};

const InlineFilters: React.FC<InlineFiltersProps> = props => {
  const {
    schema,
    value,
    delay = 200,
    resetText,
    onReset,
  } = props;

  const [internalValue, setInternalValue] = useState(value);
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const { run: handleChange } = useDebounceFn(values => {
    if (props.onChange) props.onChange(values);
  }, { wait: delay });

  const onFilterChange = (name, value) => {
    const nextValues = {
      ...internalValue,
      [name]: value
    }
    setInternalValue(nextValues)
    handleChange(nextValues)
  }

  return (
    <Space style={{ width: "100%" }} wrap>
      {schema.map(field => {
        const FilterComponent = filterForType[field.input.type] || SelectFilter;
        return (
          <FilterComponent
            key={field.name}
            field={field}
            value={internalValue[field.name]}
            onChange={onFilterChange}
          />
        )
      })}
      {onReset && (
        <Button type="text" onClick={onReset}>
          {resetText || 'Reset filters'}
        </Button>
      )}
    </Space>
  )
}

export default InlineFilters;
