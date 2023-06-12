import { DocumentNode, gql, MutationFunctionOptions, QueryFunctionOptions, useMutation, useQuery } from "@apollo/client";
import { ModelDefinitionType } from '@9troisquarts/wand'

import { useState } from 'react';
import { upperFirst } from 'lodash';
import { notification } from 'antd';
import castAttributesFromModel from "../ModelDefinition/castAttributesFromDefinition";

type ID = string | number;

type FlashType = {
  type: 'open' | 'success' | 'warning' | 'error';
  description: string;
  message: string;
};

const showNotification = (flash: FlashType) => {
  notification[flash.type || 'open']({
    message: flash.message,
    description: null,
    placement: 'bottomRight',
    duration: 2,
  });
};

const handleNotifications = (response) => {
  const { data } = response;
  if (data) {
    const queryKeys = Object.keys(data);
    queryKeys.forEach((key) => {
      (data[key]?.flashMessages || []).forEach((flashMessage: any) => {
        showNotification(JSON.parse(flashMessage));
      });
    });
  }
  return response;
};

type Options = {
  mutationOptions?: MutationFunctionOptions;
  fetch?: boolean | QueryFunctionOptions;
  singleton?: boolean;
  queries?: {
    fetch?: DocumentNode;
  }
}

type DefaultInputFn = (actionName: string, modelName: string) => string;
type DefaultInputObject = {
  create?: string;
  delete?: string;
  update?: string;
  import?: string;
}

type DefaultInputName = DefaultInputFn | DefaultInputObject;

type GraphqlModelOptions = {
  flashMessages?: boolean;
  fragment?: DocumentNode;
  defaultMutationNames?: {
    update?: string;
    create?: string;
    delete?: string;
    import?: string;
  };
  defaultInputNames?: DefaultInputName;
  queries?: {
    fetch?: DocumentNode;
  };
  mutations?: {
    update?: DocumentNode;
    create?: DocumentNode;
    delete?: DocumentNode;
    import?: DocumentNode;
  },
  definition?: ModelDefinitionType;
  debug?: boolean;
};

type generateMutationOptions = {
  inputName?: string;
  flashMessages?: boolean;
  mutationName: string;
}

const generateMutation = (modelName: string, actionName: string, fragment, options: generateMutationOptions) => {
  const fragmentName = fragment ? fragment.definitions.find((d: any) => d.kind === "FragmentDefinition" && d.name.kind === "Name")?.name?.value : undefined;
  const inName = options?.inputName || `${upperFirst(actionName)}${upperFirst(modelName)}Input`;

  return gql`
    mutation ${options.mutationName}($input: ${inName}!) {
      ${options.mutationName}(input: $input) {
        ${modelName} {
          ...${fragmentName}
        }
        ${options.flashMessages ? 'flashMessages' : ''}
      }
    }
    ${fragment}
  `
}


function useGraphqlModel<RecordType = unknown>(modelName: string, opts: GraphqlModelOptions) {
  const {
    flashMessages = false,
    definition,
    queries: {
      fetch: fetchQuery
    } = {},
    defaultMutationNames = {},
    defaultInputNames = {},
    mutations = {},
    fragment,
  } = opts;

  let createMutation: DocumentNode | undefined = mutations.create;
  const createMutationName = defaultMutationNames.create || `create${upperFirst(modelName)}`;
  if (!createMutation && fragment) {
    let createInputName;
    if (defaultInputNames) {
      if (typeof defaultInputNames === 'function') {
        createInputName = defaultInputNames('create', modelName);
      } else if (defaultInputNames.create) {
        createInputName = defaultInputNames.create;
      }
    }
    createMutation = generateMutation(modelName, 'create', fragment, { inputName: createInputName, flashMessages, mutationName: createMutationName })
  }

  let updateMutation: DocumentNode | undefined = mutations.update;
  const updateMutationName = defaultMutationNames.update || `update${upperFirst(modelName)}`;
  if (!updateMutation && fragment) {
    let updateInputName;
    if (defaultInputNames) {
      if (typeof defaultInputNames === 'function') {
        updateInputName = defaultInputNames('update', modelName);
      } else if (defaultInputNames.update) {
        updateInputName = defaultInputNames.update;
      }
    }
    updateMutation = generateMutation(modelName, 'update', fragment, { inputName: updateInputName, flashMessages, mutationName: updateMutationName })
  }

  let deleteMutation: DocumentNode | undefined = mutations.delete;
  const deleteMutationName = defaultMutationNames.delete || `delete${upperFirst(modelName)}`;
  if (!deleteMutation && fragment) {
    let deleteInputName;
    if (defaultInputNames) {
      if (typeof defaultInputNames === 'function') {
        deleteInputName = defaultInputNames('delete', modelName);
      } else if (defaultInputNames.delete) {
        deleteInputName = defaultInputNames.delete;
      }
    }
    deleteMutation = generateMutation(modelName, 'delete', fragment, { inputName: deleteInputName, flashMessages, mutationName: deleteMutationName })
  }

  let importMutation: DocumentNode | undefined = mutations.import;
  const importMutationName = defaultMutationNames.import || `import${upperFirst(modelName)}s`;
  if (!importMutation && fragment) {
    let importInputName;
    if (defaultInputNames) {
      if (typeof defaultInputNames === 'function') {
        importInputName = defaultInputNames('import', modelName);
      } else if (defaultInputNames.delete) {
        importInputName = defaultInputNames.import;
      }
    }
    importMutation = generateMutation(modelName, 'import', fragment, { inputName: importInputName, flashMessages, mutationName: importMutationName });
  }

  return (id?: ID, options?: Options) => {
    const {
      mutationOptions = {},
      fetch = false,
      singleton = false,
      queries,
    } = options || {};
    const hasUpload = definition && (Object.values(definition).includes('File') || Object.values(definition).includes('Files'));
    const onError = (error) => console.log(error)
    const { data = {}, loading = false, refetch = undefined } = fetchQuery || queries?.fetch ?
      useQuery(
        // @ts-ignore
        queries?.fetch || fetchQuery,
        {
          variables: { id },
          skip: !fetch || (!id && !singleton) || !fetchQuery,
          fetchPolicy: 'cache-and-network',
          onError,
          ...(typeof fetch === "object" ? fetch : {})
        }
      ) : {};
    const record: RecordType = data[modelName] || {};

    const [errors, setErrors] = useState<any | undefined>(undefined);

    // @ts-ignore
    const [create, { loading: creating }] = createMutation ? useMutation(createMutation, {
      ...(mutationOptions || {}),
      context: {
        hasUpload
      }
    }) : [];

    // @ts-ignore
    const [update, { loading: updating }] = updateMutation ? useMutation(updateMutation, {
      ...(mutationOptions || {}),
      context: {
        hasUpload
      }
    }) : [];

    const [destroy] = deleteMutation ? useMutation(deleteMutation, {
      ...(mutationOptions || {})
    }) : [];

    const [importMutationDispatcher] = importMutation ? useMutation(importMutation, {
      ...(mutationOptions || {})
    }) : [];


    const onSave = (payload: RecordType, options?: any) => {
      // @ts-ignore
      const attributes = definition || options?.definition ? castAttributesFromModel(options?.definition || definition, payload) : payload;
      if (opts.debug) console.log("attributes", attributes);
      const onCompleted = (data: any) => {
        const { recordErrors } = data;
        if (flashMessages) handleNotifications(data);
        if (recordErrors) setErrors(recordErrors);
        else setErrors(undefined);
        if(options?.onCompleted) options.onCompleted(data);
      }

      if (id || options?.id || singleton) {
        if(update)
          update({
            variables: {
              input: {
                id: id || options?.id,
                attributes,
                ...(options?.variables || {})
              },
            },
            onCompleted,
          });
      }
      else {
        if (create)
          create({
            variables: {
              input: {
                attributes,
                ...(options?.variables || {})
              },
            },
            onCompleted,
          });
      }
    };

    const onDelete = (id: ID, options?: any) => {
      if (opts.debug) console.log("DELETE", id)
      if (destroy)
        destroy({
          variables: {
            input: {
              id: id || options.id
            }
          },
          onCompleted: (data: any) => {
            if (flashMessages) handleNotifications(data);
            if(options?.onCompleted) options.onCompleted(data);
          },
        })
    }

    const onImport = (file: any, options?: any) => {
      if (importMutationDispatcher)
        importMutationDispatcher({
          context: {
            hasUpload: true,
          },
          variables: {
            input: {
              file
            }
          },
          onCompleted: (data: any) => {
            if (flashMessages) handleNotifications(data);
            if(options?.onCompleted) options.onCompleted(data);
          },
        })
    }

    return {
      onSave,
      onDelete,
      onImport,
      refetch,
      record,
      loading,
      submitting: creating || updating,
      errors
    };
  };
}

export default useGraphqlModel;
