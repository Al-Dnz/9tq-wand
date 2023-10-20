// @ts-nocheck
import { useEffect, useState } from 'react';
import { useRequest } from 'ahooks';
import { ConfigurationType, ImporterType } from './types';

const useImportModal = ({
  configuration,
  importType,
  defaultValue = undefined,
  defaultImportFile = undefined,
}: {
  configuration: ConfigurationType;
  importType: string;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [importer, setImporter] = useState<ImporterType | undefined>(defaultValue);
  const [importFile, setImportFile] = useState(defaultImportFile);

  const getStatus = (id) => {
    if (!id) return new Promise((resolve, reject) => resolve({}));

    return configuration.client?.get(`/${configuration.rootUrl}/imports/${id}`);
  };

  const { run, cancel } = useRequest(getStatus, {
    pollingInterval: 3000,
    pollingWhenHidden: true,
    manual: true,
    onSuccess: (data) => {
      if (data.id) setImportFile(data);
    },
  });

  const onImport = (file) => {
    const formData = new FormData();
    formData.append('file', file, file.name);
    if (configuration.client) {
      configuration.client
        .post(`/${configuration.rootUrl}/imports/${importType}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((data) => {
          if (data.id) {
            run(data.id);
            setImportFile(data);
          }
          return false;
        });
    }
    return false;
  };

  useEffect(() => {
    if (configuration.client) {
      configuration.client.get(`/${configuration.rootUrl}/importers/${importType}`).then((data) => {
        setImporter(data);
      });
    }
  }, [importType]);

  useEffect(() => {
    if (['checked', 'imported'].includes(importFile?.state)) {
      cancel();
    }
  }, [importFile?.state]);

  const onReset = () => {
    setImportFile(undefined);
    setLoading(false);
    cancel();
  };

  const onProcessImport = () => {
    if (configuration.client) {
      cancel();
      setImportFile({
        ...importFile,
        state: 'importing',
      });
      configuration.client
        .put(`/${configuration.rootUrl}/imports/${importFile.id}`, { to_state: 'import' })
        .then((data) => {
          if (data.id) {
            run(data.id);
            setImportFile(data);
          }
        });
    }
  };

  return {
    loading,
    importer,
    importFile,
    onImport,
    onProcessImport,
    onReset,
  };
};

export default useImportModal;
