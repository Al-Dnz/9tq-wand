// @ts-nocheck
import React, { createContext } from 'react';
import { useLocalStorageState } from 'ahooks';

type ToolbarConfig = {
  i18n?: {
    debug?: boolean;
    preventDefault?: boolean;
  };
  baseUrl: string;
  impersonation:
    | boolean
    | {
        userTypes: string[];
      };
};

export const NtqToolbarContext = createContext<ToolbarConfig>(null);
const defaultConfig: ToolbarConfig = {
  i18n: {
    debug: false,
    preventDefault: false,
  },
};

type NtqToolbarProviderProps = {
  enabled?: boolean;
  impersonation?:
    | boolean
    | {
        userTypes: string[];
      };
};

const NtqToolbarProvider: React.FC<NtqToolbarProviderProps> = (props) => {
  const { enabled = true, impersonation = false, baseUrl = '/ntq_tools' } = props;
  const [config, setConfig] = useLocalStorageState<ToolbarConfig>(
    `ntq-toolbar-config`,
    // @ts-ignore
    defaultConfig,
  );
  const onI18nConfigChange = (name, value) =>
    setConfig({
      ...defaultConfig,
      ...(config || {}),
      i18n: { ...((config || {}).i18n || {}), [name]: value },
    });
  const conf = { ...defaultConfig, ...(config || {}), onI18nConfigChange, impersonation, baseUrl };

  if (!enabled) return props.children;

  return <NtqToolbarContext.Provider value={conf}>{props.children}</NtqToolbarContext.Provider>;
};

export default NtqToolbarProvider;
