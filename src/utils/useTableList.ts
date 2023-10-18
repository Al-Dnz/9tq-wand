import { useQuery } from "@apollo/client";
import { PaginationProps } from "antd";
import { DocumentNode } from "graphql"
import { useState } from "react";
import castAttributesFromModel, { ModelDefinitionType } from "../ModelDefinition/castAttributesFromDefinition";
import useSearchFilters from "./useSearchFilters";

type UseTableListProps = {
  query: DocumentNode;
  debug?: boolean;
  variables?: any;
  paginate?: boolean;
  resetPaginationOnComplete?: boolean;
  onCompleted?: (data: any) => void;
}

type SearchOptions = {
  definition: ModelDefinitionType;
  defaultSearch?: any;
  updateLocation?: boolean;
  params?: any;
  key?: string;
  history: any;
};

function useTableList<RecordType = unknown, SearchType = unknown>(name: string, options: UseTableListProps, searchOptions?: SearchOptions) {
  const {
    query,
    debug = false,
    resetPaginationOnComplete = true,
    paginate = true,
    onCompleted,
  } = options;

  const {
    params = {}
  } = (searchOptions || {});

  const [extraParams, setExtraParams] = useState<any>(params || {});
  const {
    search,
    onChange: onSearchChange,
    onReset,
  } = useSearchFilters<SearchType>(searchOptions?.key || name, {
    debug,
    enabled: !!searchOptions,
    defaultSearch: searchOptions?.defaultSearch || {},
    updateLocation: searchOptions?.updateLocation || false,
    history: searchOptions?.history,
    definition: searchOptions?.definition,
  });
  const [searchChanged, setSearchChanged] = useState<boolean>(false);
  const [internalPagination, setInternalPagination] = useState<{pageSize: number; page: number;}>({ pageSize: 25, page: 1 });
  const { data, loading, refetch } = useQuery(query,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        perPage: internalPagination.pageSize,
        page: internalPagination.page,
        ...(searchOptions ? ({
          search: searchOptions.definition ? castAttributesFromModel(searchOptions.definition, { ...(search || {}), ...extraParams }) : ({ ...search, ...extraParams }),
        }) : ({})),
        ...(options.variables || {}),
      },
      onCompleted: (data) => {
        setSearchChanged(false);
        if(resetPaginationOnComplete && searchChanged) setInternalPagination({ ...internalPagination, page: 1 });
        if(onCompleted) onCompleted(data);
      }
  });
  const queryRoot = data ? (data[name] || {}) : {};
  let records: Array<RecordType>;

  if (paginate)
    records = queryRoot[name] || []
  else
    records = data ? data[name] : []

  const pagination = paginate ? (queryRoot.pagination || {}) : {};

  const onPageChange = (page: number, pageSize: number) => {
    setInternalPagination({ page, pageSize })
  }

  const paginationProps: PaginationProps | false = pagination ? ({
    current: pagination.page,
    pageSize: pagination.perPage || 25,
    total: pagination.total,
    showSizeChanger: false,
    onChange: onPageChange
  }) : false

  const handleSearchChange = (values: SearchType) => {
    setSearchChanged(true);
    if(onSearchChange) onSearchChange(values);
  }

  return {
    records,
    data,
    loading,
    pagination: paginationProps,
    search,
    onSearchChange: handleSearchChange,
    setExtraParams,
    refetch,
    onReset,
  };
}

export default useTableList;
