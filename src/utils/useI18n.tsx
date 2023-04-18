// @ts-nocheck
import React, { useState, useContext } from 'react';
import { useIntl } from 'react-intl';
import { decamelize } from 'humps';
import { Button, Input, Popover, Spin } from 'antd';
import { css } from '@emotion/css';
import { NtqToolbarContext } from '../NtqToolbar/NtqToolbarProvider';

type Options = {
  debug?: boolean;
};

const url = '/ntq_tools';
const defaultOptions = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8',
  },
};

const linkCss = css`
  font-style: italic;
  color: #4527a0;
  text-decoration-line: underline;
  text-decoration-style: dashed;
  &:hover {
    color: #4527a0;
  }
`;

const MissingTranslationItem = (props) => {
  const { translationKey, preventDefault } = props;

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string | undefined>(props.value);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = () => {
    fetch(`${url}/translation`, {
      ...defaultOptions,
      method: 'PUT',
      body: JSON.stringify({ key: translationKey, value }),
    })
      .then((response) => response.json())
      .then(({ data }) => {
        if (data) {
          setOpen(false);
        }
      });
  };

  const content = open ? (
    <div style={{ minWidth: 150, minHeight: 75 }}>
      {loading ? (
        <div
          style={{ height: 75, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Spin />
        </div>
      ) : (
        <div>
          <Input.TextArea
            value={value}
            onChange={({ target: { value } }) => setValue(value)}
            autoSize
          />
          <div style={{ marginTop: 10, textAlign: 'right' }}>
            <Button onClick={onSubmit} size="small" type="primary">
              Modifier
            </Button>
          </div>
        </div>
      )}
    </div>
  ) : null;

  const onOpenChange = (visible: boolean) => {
    setOpen(visible);
    setLoading(true);
    fetch(`${url}/translation?key=${translationKey}`, defaultOptions)
      .then((response) => response.json())
      .then(({ data }) => {
        setValue(data);
        setLoading(false);
      });
  };

  const onClick = (e) => {
    if (preventDefault) e.stopPropagation();
  };

  return (
    <Popover
      title={loading ? null : translationKey}
      content={content}
      open={open}
      trigger={'click'}
      onOpenChange={onOpenChange}
    >
      <a onClick={onClick} className={linkCss}>
        {props.value || translationKey}
      </a>
    </Popover>
  );
};

const useI18n = (opts?: Options) => {
  const { debug = false } = opts || {};

  const toolbarConfig = useContext(NtqToolbarContext);
  const intl = useIntl();
  const isTranslated = (key: string) => intl.formatMessage({ id: key }) !== key;
  const t = (key, args: any = {}) => {
    const { count, ...rest } = args;
    let k = key;
    if (args && args.count !== undefined) {
      let pluralKey = 'zero';
      if (args.count > 1) pluralKey = 'other';
      else if (args.count === 1) pluralKey = 'one';
      k = `${key}.${pluralKey}`;
    }
    k = decamelize(k);
    const translation = intl.formatMessage({ id: k }, args);
    if (debug || toolbarConfig?.i18n?.debug) {
      return (
        <MissingTranslationItem
          translationKey={k}
          value={translation}
          preventDefault={toolbarConfig?.i18n?.preventDefault}
        />
      );
    }
    return translation;
  };

  const tAttribute = (modelName, attributeName) =>
    t(`activerecord.attributes.${decamelize(modelName)}.${decamelize(attributeName)}`);

  return {
    t,
    translate: t,
    tAttribute,
    isTranslated,
  };
};

export default useI18n;
