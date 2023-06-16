// @ts-nocheck
import forIn from 'lodash/forIn';
import isObject from 'lodash/isObject';
import omit from 'lodash/omit';
import isArray from 'lodash/isArray';
import isNil from 'lodash/isNil';
import moment from 'moment';

const toFloat = (v: number) => parseFloat(v.toString().replace(/\,/g, '.'));

const defaultOptions = {
  skipUndefinedKeys: true,
};

type OptionsType = {
  skipUndefinedKeys?: boolean;
};

type PlacesType = {
  type: 'Places';
  options?: {
    formattedAddress?: string;
    lat?: string;
    lng?: string;
    city?: string;
  };
};

export type ModelDefinitionType<
  RecordType = unknown,
  Keys extends keyof RecordType = keyof RecordType,
> = {
  [K in Keys]:
    | 'Password'
    | 'Float'
    | 'Integer'
    | 'Other'
    | 'Nested'
    | 'Datetime'
    | 'Date'
    | 'String'
    | 'ID'
    | 'Files'
    | 'File'
    | 'Boolean'
    | 'Array'
    | PlacesType
    | ModelDefinitionType;
};

export type AttributesType = {
  [k: string]: any;
};

const castValue = (type, value) => {
  switch (type) {
    case 'Float':
      return toFloat(value);
    case 'Integer':
      return parseInt(value, 10);
    case 'String':
      return typeof value === 'string' ? value : value.toString();
    case 'Date':
      return moment.isMoment(value) ? value.format('YYYY-MM-DD') : value;
    case 'Datetime':
      return moment.isMoment(value) ? value.format() : value;
    case 'Password':
    case 'Files':
    case 'File':
      if (value) return value;
      return;
    default:
      return value;
  }
};

const reverseCastValue = (type, value) => {
  switch (type) {
    case 'Location':
      return {
        location: {
          formattedAddress: value?.location?.formattedAddress || value?.formattedAddress,
          lat:
            value?.location?.lat || value?.lat
              ? toFloat(value.location?.lat || value?.lat)
              : undefined,
          lng:
            value?.location?.lng || value?.lat
              ? toFloat(value.location?.lng || value?.lng)
              : undefined,
        },
        proximity: value.proximity ? parseInt(value.proximity, 10) : undefined,
      };
    case 'Boolean':
      if(!value) return null

      return value === "true" || value === "1" || value
    case 'Float':
      return toFloat(value);
    case 'Integer':
      return parseInt(value, 10);
    case 'String':
      return typeof value === 'string' ? value : value.toString();
    case 'Datetime':
    case 'Date':
      return moment.isMoment(value) ? value : moment(value);
    default:
      return value;
  }
};

export const reverseCastFromDefinition = (
  model: ModelDefinitionType,
  attributes: AttributesType,
) => {
  const castedAttributes: any = {};
  forIn(model, (value, key) => {
    if (Array.isArray(value) && !isNil(attributes[key])) {
      castedAttributes[key] = attributes[key].map((v) => reverseCastValue(value[0], v));
    } else if (!isNil(attributes[key])) {
      castedAttributes[key] = reverseCastValue(value, attributes[key]);
    }
  });
  return castedAttributes;
};

function castAttributesFromModel(
  model: ModelDefinitionType,
  attributes: any,
  options: OptionsType = defaultOptions,
) {
  const formattedModel: any = {};
  forIn(model, (value, key) => {
    if (isObject(value)) {
      if (value.type === 'Places') {
        formattedModel[value.options?.formattedAddress || key] = attributes[key]?.formattedAddress;
        formattedModel[value.options?.city || 'city'] = attributes[key]?.city;
        formattedModel[value.options?.lat || 'lat'] = attributes[key]?.lat;
        formattedModel[value.options?.lng || 'lng'] = attributes[key]?.lng;
        if (value.options?.countryIso)
          formattedModel[value.options?.countryIso || 'countryIso'] = attributes[key]?.countryIso;
        if (value.options?.country)
          formattedModel[value.options?.country || 'country'] = attributes[key]?.country;
        if (value.options?.administrativeLevelOne)
          formattedModel[value.options.administrativeLevelOne] = attributes[
            key
          ]?.administrativeAreaLevels?.find((a) =>
            a.types.includes('administrative_area_level_1'),
          )?.long_name;
        if (value.options?.administrativeLevelTwo) {
          formattedModel[value.options.administrativeLevelTwo] = attributes[
            key
          ]?.administrativeAreaLevels?.find((a) =>
            a.types.includes('administrative_area_level_2'),
          )?.long_name;
        }
        if (value.options?.zipCode) {
          formattedModel[value.options.zipCode] = attributes[key]?.zipCode;
        }
      } else if (isArray(value) && !isNil(attributes[key])) {
        formattedModel[key] = attributes[key].map((v) => castValue(value[0], v));
      } else {
        if (!isNil(attributes[key])) {
          const attributeValue = attributes[key];
          if (attributeValue)
            formattedModel[`${key}Attributes`] = isArray(attributeValue)
              ? attributeValue.map((v) => castAttributesFromModel(value, v))
              : castAttributesFromModel(value, attributeValue);
        }
      }
    } else if (!isNil(attributes[key])) {
      switch (value.toLowerCase()) {
        case 'float':
          formattedModel[key] = toFloat(attributes[key]);
          break;
        case 'integer':
          formattedModel[key] = parseInt(attributes[key], 10);
          break;
        case 'string':
          formattedModel[key] =
            typeof attributes[key] === 'string' ? attributes[key] : attributes[key].toString();
          break;
        case 'date':
          formattedModel[key] =
            typeof attributes[key] !== 'string'
              ? attributes[key].format('YYYY-MM-DD')
              : attributes[key];
          break;
        case 'datetime':
          formattedModel[key] =
            typeof attributes[key] !== 'string' ? attributes[key].format() : attributes[key];
          break;
          case 'Files':
            if (attributes[key]) formattedModel[key] = attributes[key].filter(f => f instanceof File);
            break;
          case 'File':
            if (attributes[key] && attributes[key] instanceof File) formattedModel[key] = attributes[key];
            break;
          case 'password':
          if (attributes[key]) formattedModel[key] = attributes[key];
          break;
        case 'nested':
          if (attributes[key])
            formattedModel[`${key}Attributes`] = isArray(attributes[key])
              ? attributes[key].map((v) => omit(v, ['__typename']))
              : omit(attributes[key], ['__typename']);
          break;
        default:
          formattedModel[key] = attributes[key];
          break;
      }
    } else if (value !== 'password' && value !== 'nested' && value !== 'id') {
      if (!options.skipUndefinedKeys || attributes.hasOwnProperty(key)) formattedModel[key] = null;
    }
  });
  return formattedModel;
}

export default castAttributesFromModel;
