// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react';
import { NtqToolbarContext } from './NtqToolbarProvider';
import styles from './index.module.css';
import { Col, Popover, Row, Spin } from 'antd';

const defaultOptions = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8',
  },
};

const Impersonation = (props) => {
  const config = useContext(NtqToolbarContext);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState();

  const onOpenChange = (visible: boolean) => {
    if (visible) {
      setOpen(true);
      if (!users) {
        setLoading(true);
        fetch(`${config.baseUrl}/impersonation/users.json`, {
          ...defaultOptions,
        })
          .then((response) => response.json())
          .then(({ data }) => {
            setUsers(data);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      } else setOpen(true);
    } else setOpen(false);
  };

  const onUserClick = (modelName, user) => {
    window.location.href = `${config.baseUrl}/impersonation/${modelName}/${user.id}/sign_in`;
  };

  const modelNames = Object.keys(users || {}).filter(
    (m) => !config?.impersonation?.userTypes || config.impersonation.userTypes.includes(m),
  );
  const hasManyModels = modelNames.length > 0;

  const content = (
    <>
      {loading && (
        <div className={styles.popoverLoading}>
          <Spin />
        </div>
      )}
      {!loading && users && (
        <div className={styles.popoverContent}>
          {modelNames.map((modelName) => (
            <Row key={modelName} className={styles.userGroup}>
              {hasManyModels && (
                <Col className={styles.impersonationModelName} span={24}>
                  {modelName}
                </Col>
              )}
              {users[modelName].map((user) => (
                <Col
                  key={user.id}
                  className={`${styles.user} ${hasManyModels ? styles.padded : ''}`}
                  span={24}
                  onClick={() => onUserClick(modelName, user)}
                >
                  {user.label}
                </Col>
              ))}
            </Row>
          ))}
        </div>
      )}
    </>
  );
  return (
    <Popover
      trigger={['click']}
      open={open}
      content={content}
      onOpenChange={onOpenChange}
      placement="bottom"
      arrowPointAtCenter
    >
      <span className={styles.tag}>Connexion utilisateur</span>
    </Popover>
  );
};

export default Impersonation;
