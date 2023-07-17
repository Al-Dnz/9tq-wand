import { useDebounceFn, useLocalStorageState } from 'ahooks';
import { omit } from 'lodash';
import { Button, Space } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import SelectFilter from './fields/SelectFilter';
import { FilterTogglerType, InlineFilterSchema } from './types';
import { filterForType } from './_utils';
import FilterToggler from './FilterToggler';

type InlineFiltersProps = {
  schema: InlineFilterSchema;
  value: any;
  delay?: number;
  resetText?: string;
  toggle?: FilterTogglerType;
  onReset: () => void;
  onChange: (object: any) => void;
};

const InlineFilters: React.FC<InlineFiltersProps> = props => {
  const {
    schema,
    value,
    delay = 200,
    resetText,
    toggle,
    onReset,
  } = props;

  const [hiddenFilters, setHiddenFilters] = useLocalStorageState<string[]>(toggle?.key ? `${toggle?.key}-filters` : 'filter-toggle');
  const [internalValue, setInternalValue] = useState(value);
  const { run: handleChange } = useDebounceFn(values => {
    if (props.onChange) props.onChange(values);
  }, { wait: delay });

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const submitValues = (values) => {
    setInternalValue(values)
    handleChange(values)
  }

  const onFilterChange = (values: any) => submitValues(omit({
    ...internalValue,
    ...values
  }, toggle ? hiddenFilters : []));

  const onFilterToggleChange = (names) => {
    setHiddenFilters(names);
    submitValues(omit({
    ...internalValue
  }, toggle ? names : []));

  }

  let fields = schema;
  if (toggle && hiddenFilters && hiddenFilters.length > 0) fields = fields.filter(f => (f.toggleable !== undefined && !f.toggleable) || !hiddenFilters.includes(Array.isArray(f.name) ? f.name.join("//=") : f.name));


  return (
    <Space style={{ width: "100%" }} wrap>
      {fields.map(field => {
        const FilterComponent = filterForType[field.input.type] || SelectFilter;
        return (
          <FilterComponent
            key={Array.isArray(field.name) ? field.name.join('--') : field.name}
            field={field}
            value={Array.isArray(field.name) ? field.name.reduce((acc, name) => { acc[name] = internalValue[name]; return acc; }, {}) : internalValue[field.name]}
            onChange={onFilterChange}
          />
        )
      })}
      {toggle && (
        <FilterToggler
          schema={schema}
          value={hiddenFilters}
          onChange={onFilterToggleChange}
          {...(toggle || {})}
        />
      )}
      {onReset && (
        <Button type="text" onClick={onReset}>
          {resetText || 'Reset filters'}
        </Button>
      )}
    </Space>
  )
}

export default InlineFilters;
