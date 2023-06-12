// @ts-nocheck
import { CSVNotice } from '@9troisquarts/wand';
import {
  Button,
  Descriptions,
  Modal,
  Result,
  Space,
  Spin,
  Steps,
  Typography,
  Upload,
} from 'antd';
import React from 'react';
import { ConfigurationType } from './types';
import useImportModal from './useImportModal';
import styles from './index.module.css';
import { LoadingOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

type ImportModalProps = {
  open?: boolean;
  title?: string | React.ReactNode;
  allowImportOnError?: boolean;
  importType: string;
  onCancel?: () => void;
  translate?: (key: string) => void;
  onCompleted?: () => void;
};

let config: ConfigurationType = {
  rootUrl: 'excelsior',
};

const stateForUpload = (importFile) => {
  if (!importFile) return { status: 'progress' };

  if (importFile.state === 'pending' || importFile.state === 'buffering')
    return { status: 'progress', icon: <LoadingOutlined /> };

  return { status: 'finish' };
};

const stateForVerify = (importFile) => {
  if (!importFile) return { status: 'wait' };

  if (importFile.state === 'checking') return { status: 'progress', icon: <LoadingOutlined /> };
  if (['buffered', 'checked', 'importing', 'imported'].includes(importFile.state))
    return { status: 'finish' };

  return { status: 'wait' };
};

const stateForImport = (importFile) => {
  if (!importFile) return { status: 'wait' };

  if (importFile.state === 'importing') return { status: 'progress', icon: <LoadingOutlined /> };

  if (importFile.state === 'imported') return { status: 'finish' };

  return { status: 'wait' };
};

const ImportModalContent: React.FC<ImportModalProps> = (props) => {
  const { importType, allowImportOnError = false, onCancel, onCompleted } = props;
  const { importer, importFile, onReset, onImport, onProcessImport } = useImportModal({
    configuration: config,
    importType,
    onCompleted,
  });
  const translate = props.translate || config.translate;

  //if (!importer) return null;
  const steps = [
    {
      title: translate ? translate('excelsior_modal.upload_file') : 'Upload file',
      ...stateForUpload(importFile),
    },
    {
      title: translate ? translate('excelsior_modal.verify_file') : 'Verify file',
      ...stateForVerify(importFile),
    },
    {
      title: translate ? translate('excelsior_modal.import_file') : 'Import file',
      ...stateForImport(importFile),
    },
  ];

  const StepsWizard = <Steps style={{ paddingRight: 30, marginBottom: 16 }} items={steps} />;

  if (!importFile || ['buffering', 'buffered', 'pending'].includes(importFile.state)) {
    return (
      <>
        {StepsWizard}
        <Spin
          delay={200}
          spinning={['buffering', 'pending'].includes(importFile?.state)}
          tip={translate ? translate('excelsior_modal.uploading_file') : 'Uploading...'}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Dragger name="file" showUploadList={false} multiple={false} beforeUpload={onImport}>
              <p className="ant-upload-hint">
                {translate
                  ? translate('excelsior_modal.upload_format')
                  : 'Upload a .xlsx or a .csv file'}
              </p>
            </Dragger>
            {importer && importer.notice && (
              <>
                <Typography.Title style={{ marginBottom: 0 }} level={5}>
                  <Space>
                    {translate ? translate('excelsior_modal.expected_columns') : 'Expected cols'}
                    {importer.sample_file && (
                      <a
                        className={styles.sampleFileLink}
                        href={importer.sample_file}
                        target="_blank"
                      >
                        {translate
                          ? translate('excelsior_modal.download_sample_file')
                          : 'Download sample file'}
                      </a>
                    )}
                  </Space>
                </Typography.Title>
                <CSVNotice schema={importer.notice} />
              </>
            )}
          </Space>
        </Spin>
      </>
    );
  }

  if (['checking', 'checked'].includes(importFile.state)) {
    return (
      <>
        {StepsWizard}
        <Spin
          delay={200}
          spinning={['checking'].includes(importFile?.state)}
          tip={translate ? translate('excelsior_modal.checking_file') : 'Checking...'}
        >
          <Descriptions
            bordered
            className={styles.checkDescriptions}
            size="small"
            colon={false}
            layout="vertical"
            column={4}
          >
            <Descriptions.Item
              span={4}
              label={
                translate ? translate('excelsior_modal.number_of_error_lines') : 'Error lines count'
              }
            >
              {importFile.state === 'checking' ? '' : importFile.errors_count.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item
              span={4}
              label={
                translate
                  ? translate('excelsior_modal.number_of_success_lines')
                  : 'Correct lines count'
              }
            >
              {importFile.state === 'checking' ? '' : importFile.success_count.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item
              span={2}
              label={translate ? translate('excelsior_modal.number_of_creation') : 'Create'}
            >
              {importFile.state === 'checking' ? '' : importFile.create_count.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item
              span={2}
              label={translate ? translate('excelsior_modal.number_of_update') : 'Update'}
            >
              {importFile.state === 'checking' ? '' : importFile.update_count.toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
          <div className={styles.actions}>
            <Space>
              <Button onClick={onCancel} type="text">
                {translate ? translate('excelsior_modal.cancel') : 'Cancel'}
              </Button>
              <Button onClick={onProcessImport} type="primary">
                {translate ? translate('excelsior_modal.import') : 'Import'}
              </Button>
            </Space>
          </div>
        </Spin>
      </>
    );
  }

  const stats = (
    <Descriptions
      bordered
      className={styles.checkDescriptions}
      size="small"
      colon={false}
      layout="vertical"
      column={4}
    >
      <Descriptions.Item
        span={4}
        label={translate ? translate('excelsior_modal.number_of_error_lines') : 'Error lines count'}
      >
        {importFile.errors_count?.toLocaleString() || '0'}
      </Descriptions.Item>
      <Descriptions.Item
        span={4}
        label={
          translate ? translate('excelsior_modal.number_of_success_lines') : 'Correct lines count'
        }
      >
        {importFile.success_count?.toLocaleString() || '0'}
      </Descriptions.Item>
      <Descriptions.Item
        span={2}
        label={translate ? translate('excelsior_modal.number_of_creation') : 'Create'}
      >
        {importFile.create_count?.toLocaleString() || '0'}
      </Descriptions.Item>
      <Descriptions.Item
        span={2}
        label={translate ? translate('excelsior_modal.number_of_update') : 'Update'}
      >
        {importFile.update_count?.toLocaleString() || '0'}
      </Descriptions.Item>
    </Descriptions>
  );

  if (['importing', 'imported'].includes(importFile.state)) {
    return (
      <>
        {StepsWizard}
        <Spin
          delay={200}
          spinning={['importing'].includes(importFile?.state)}
          tip={translate ? translate('excelsior_modal.importing_file') : 'Importing...'}
        >
          {importFile.state == 'imported' && (
            <Result
              status="success"
              title={
                translate
                  ? translate('excelsior_modal.file_successfully_imported')
                  : 'File successfully importer'
              }
              extra={[
                <Button type="text" key="reset" onClick={onCancel}>
                  {translate ? translate('excelsior_modal.finish_and_close') : 'Finish and close'}
                </Button>,
                <Button type="primary" key="close" onClick={onReset}>
                  {translate ? translate('excelsior_modal.new_import') : 'New import'}
                </Button>,
              ]}
            />
          )}
          {stats}
        </Spin>
      </>
    );
  }

  if (importFile.state === 'error') {
    if (importFile.error_message == 'header_not_found') {
      return (
        <Result
          status="error"
          title={translate ? translate('excelsior_modal.missing_header') : 'Error'}
          subTitle={
            <div>
              {translate ? translate('excelsior_modal.following_headers_are_missing') : 'Error'}
              :&nbsp;
              {(importFile.missing_headers || []).join(', ')}
            </div>
          }
          extra={[
            <Button type="text" key="reset" onClick={onCancel}>
              {translate ? translate('excelsior_modal.finish_and_close') : 'Finish and close'}
            </Button>,
            <Button type="primary" key="close" onClick={onReset}>
              {translate ? translate('excelsior_modal.new_import') : 'New import'}
            </Button>,
          ]}
        />
      );
    }
    return (
      <>
        {StepsWizard}
        <Result
          status="error"
          title={translate ? translate('excelsior_modal.error_on_file') : 'Error'}
          subTitle={
            importFile.error_file ? (
              <a href={importFile.error_file} target="_blank">
                {translate
                  ? translate('excelsior_modal.click_here_for_download_error_file')
                  : 'Error'}
              </a>
            ) : null
          }
          extra={[
            allowImportOnError ? (
              <Button onClick={onProcessImport} type="primary">
                  {translate ? translate('excelsior_modal.import') : 'Import'}
              </Button>
            ) : (
              <Button type="text" key="reset" onClick={onCancel}>
                {translate ? translate('excelsior_modal.finish_and_close') : 'Finish and close'}
              </Button>
            ),
            <Button type="primary" key="close" onClick={onReset}>
              {translate ? translate('excelsior_modal.new_import') : 'New import'}
            </Button>,
          ]}
        />
      </>
    );
  }

  return <div>{StepsWizard}</div>;
};

const ImportModal: React.FC<ImportModalProps> = (props) => {
  const { open, translate, onCancel, title } = props;

  if (!open) return null;

  return (
    <Modal open width={1000} footer={false} title={title} onCancel={onCancel}>
      <ImportModalContent translate={translate} {...props} />
    </Modal>
  );
};

export const configure = (configuration: ConfigurationType) => {
  config = { ...config, ...configuration };
  return config;
};

export default ImportModal;
