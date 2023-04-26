import { DatePickerProps } from "antd";

type Option = {
  value: any;
  label: string;
  children?: React.ReactNode[] | React.ReactNode;
  options?: Option[];
};

export type DateInputProps = {
  type: 'date';
  format?: string;
  inputProps: DatePickerProps;
  className?: string;
}

export type DatePickerInputProps = {
  type: 'daterange';
  format?: string;
  className?: string;
}

export type SelectInputProps = {
  type: 'select';
  options: Option[];
  multiple?: boolean;
  allowSearch?: boolean;
  searchPlaceholder?: string;
  noOptionsFound?: string;
  className?: string;
};

export type StringInputProps = {
  type: 'string';
  placeholder?: string;
  className?: string;
};

export type InputType =
  | DatePickerInputProps
  | SelectInputProps
  | DateInputProps
  | StringInputProps;

export type FieldItemType = {
  label?: string;
  icon?: any;
  name: string;
  input: InputType;
  className?: string;
  disabled?: boolean;
}

export type FieldType = {
  defaultValue?: any;
} & FieldItemType;

export type FieldSchema = FieldType;

export type InlineFilterSchema = Array<FieldSchema>
