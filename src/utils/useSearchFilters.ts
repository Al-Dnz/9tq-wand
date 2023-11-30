import { useLocalStorageState, useDebounceFn } from 'ahooks';
import queryString from "query-string";
import qs from "qs";
import { useEffect } from 'react';
import dayjs from 'dayjs';
import moment from 'moment';
import { ModelDefinitionType } from '@9troisquarts/wand'
import castAttributesFromModel, { reverseCastFromDefinition } from '../ModelDefinition/castAttributesFromDefinition';

const getPairs = (obj: any, keys = []) =>
  Object.entries(obj).reduce((pairs, [key, value]) => {
    if (value) {
      if (typeof value === 'object')
        // @ts-ignore
        pairs.push(...getPairs(value, [...keys, key]));
      else
        // @ts-ignore
        pairs.push([[...keys, key], value]);
    }
    return pairs;
  }, []);

type OptionsType = {
  enabled?: boolean;
  updateLocation?: boolean;
  definition?: ModelDefinitionType;
  defaultSearch?: any;
  debug?: boolean;
  history: any;
}

const useSearchFilters= <SearchType>(key: string, options: OptionsType) => {
  const {
    updateLocation = false,
    enabled = true,
    debug = false,
    definition = undefined,
    defaultSearch = {},
    history,
  } = options || {};

  if(!enabled) return {};

  const [page, setPage] = useLocalStorageState<string | number>(
    `${key}-page`,
    // @ts-ignore
    1,
  );

  const [perPage, setPerPage] = useLocalStorageState<string | number>(
    `${key}-per-page`,
    // @ts-ignore
    25,
  );

  const [s, setSearch] = useLocalStorageState<SearchType>(key, { defaultValue: defaultSearch as SearchType });
  const search: SearchType = s || ({} as SearchType);

  useEffect(() => {
    if(updateLocation) {
      const parsed = qs.parse(location.search.replace('?', ''));
      if(parsed) {
        const values = Object.keys(parsed).map(k => parsed[k]).filter(Boolean);
        // @ts-ignore
        if(values.length > 0) {
          if(definition) setSearch({ ...castAttributesFromModel(definition, parsed) });
          // @ts-ignore
          else setSearch({ ...parsed });
        }
      }
    }
  }, []);

  const handleSearch = (values: SearchType) => {
    let nextSearch = { ...s, ...values };
    let locationSearch = { ...s, ...values };
    if (definition) {
      // @ts-ignore
      nextSearch = castAttributesFromModel(definition, nextSearch);
      // @ts-ignore
      locationSearch = castAttributesFromModel(definition, locationSearch, { skipDate: true });
    }
    if(debug) console.table({ parameters: nextSearch, original: values, definition })
    setSearch(nextSearch)
    if(updateLocation) {
      const nestedParams = getPairs(locationSearch).map(([[key0, ...keysRest], value]) =>
        `${key0}${keysRest.map(a => `[${a}]`).join('')}=${value}`).join('&');
      setPage(1)
      const pathname = window.location?.pathname + '?' + nestedParams;
      if(history) history.push(pathname)
    }
  };

  const onReset = () => {
    setSearch({} as SearchType)
    if(updateLocation && history) history.push(window.location.pathname)
  };

  const onPageChange = (page: number, pageSize: number) => {
    setPage(perPage !== pageSize ? 1 : page);
    setPerPage(pageSize);
    if (updateLocation) {
      const searchToStringify = Object.keys(search || {}).reduce((acc, attributeName) => {
        // @ts-ignore
        if (dayjs.isDayjs(search[attributeName])) acc[attributeName] = search[attributeName].format('YYYY-MM-DD');
        // @ts-ignore
        if (moment.isMoment(search[attributeName])) acc[attributeName] = search[attributeName].format('YYYY-MM-DD');
        // @ts-ignore
        else acc[attributeName] = search[attributeName];
        return acc;
      }, {})
      const pathname =
        window.location?.pathname + '?' + queryString.stringify(
          { ...searchToStringify, page, perPage: pageSize },
          { arrayFormat: 'bracket', skipNull: true },
        );
      if(history) history.replace(pathname);
    }
  };

  const {
    run: onSearch,
  }: {
    run: (values: SearchType) => void;
  } = useDebounceFn(
    handleSearch,
    {
      wait: 500
    }
  )

  return {
    // @ts-ignore
    search: (definition ? reverseCastFromDefinition(definition, search) : search) as SearchType,
    page: page ? parseInt(page as string) : 1,
    perPage: perPage ? parseInt(perPage as string) : 10,
    onPageChange,
    onReset,
    set: setSearch,
    onChange: onSearch,
  }
}

export default useSearchFilters;
