import { AxiosInstance } from 'axios';

export type ConfigurationType = {
  rootUrl?: string;
  client?: AxiosInstance;
  translate: (key: string) => string;
};

export type ImporterType = {
  max_error_count?: number;
  notice?: Array<{
    header: string;
    description: string;
    required?: boolean;
    values?: Array<{
      header?: string;
      description?: string;
    }>;
  }>;
  sample_file?: string;
};
