// @ts-nocheck
import React, { useContext, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/css';
import { NtqToolbarContext } from './NtqToolbarProvider';
import { Dropdown, Space } from 'antd';
import styles from './index.module.css';
import logo from './images/logo.png';
import Impersonation from './Impersonation';

const Container = styled.div`
  position: fixed;
  top: 0;
  background-color: #000;
  display: flex;
  height: 50px;
  width: 100%;
  color: white;
  padding: 0 16px;
  z-index: 1000;
`;

const Right = styled.div`
  display: flex;
  margin-left: auto;
  align-items: center;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const bodyClass = css`
  .ant-layout-header,
  .ant-layout-sider {
    margin-top: 50px;
  }
`;

type NtqToolbarProps = {
  enabled?: boolean;
};

const url = '/ntq_tools';

const NtqToolbar: React.FC<NtqToolbarProps> = (props) => {
  const { enabled = true } = props;
  const config = useContext(NtqToolbarContext);

  if (!enabled) return null;

  const onRefresh = () => {
    fetch(`${url}/translation/refresh`);
  };

  useEffect(() => {
    if (enabled) {
      document.body.classList.add(bodyClass);
      document.body.classList.add('ntq-toolbar-enabled');
      return () => document.body.classList.remove(bodyClass);
    }
  });

  // @ts-ignore
  const onFeatureToggle = (option) => () =>
    config.onI18nConfigChange(option, !config?.i18n ? true : !config.i18n[option]);

  const items = [
    {
      label: (
        <span>
          <span
            className={`${styles.pill} ${config?.i18n?.debug ? styles.enabled : styles.disabled}`}
          />
          Live
        </span>
      ),
      key: 'debug',
      onClick: () => onFeatureToggle('debug')(!config?.i18n?.debug),
    },
    {
      label: (
        <span>
          <span
            className={`${styles.pill} ${
              config?.i18n?.preventDefault ? styles.enabled : styles.disabled
            }`}
          />
          Prevent default
        </span>
      ),
      key: 'preventDefault',
      onClick: () => onFeatureToggle('preventDefault')(!config?.i18n?.preventDefault),
    },
    {
      label: <span>Refresh translations</span>,
      key: 'refresh',
      onClick: onRefresh,
    },
  ];
  return (
    <Container>
      <Left>
        <img src={logo} width="30" />
      </Left>
      <Right>
        <Space>
          {!!config?.impersonation && <Impersonation />}
          <Dropdown menu={{ items }} trigger={['hover']}>
            <span className={`${styles.tag}`} onClick={onFeatureToggle('debug')}>
              <span
                className={`${styles.pill} ${
                  config?.i18n?.debug ? styles.enabled : styles.disabled
                }`}
              />
              Traduction live
            </span>
          </Dropdown>
        </Space>
      </Right>
    </Container>
  );
};

export default NtqToolbar;
