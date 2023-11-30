// @ts-nocheck
import forIn from 'lodash/forIn';
import isObject from 'lodash/isObject';
import omit from 'lodash/omit';
import isArray from 'lodash/isArray';
import isNil from 'lodash/isNil';
import moment from 'moment';
import dayjs from 'dayjs';

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
  if(isNil(value)) return undefined;

  switch (type.toLowerCase()) {
    case 'float':
      return toFloat(value);
    case 'integer':
      return parseInt(value, 10);
    case 'string':
      return typeof value === 'string' ? value : value.toString();
    case 'date':
      const mDate = value;
      if (!dayjs.isDayjs(mDate) && !moment.isMoment(mDate)) mDate = dayjs(mDate);
      if (!mDate.isValid()) return null;

      return mDate.format('YYYY-MM-DD');
    case 'datetime':
      const mDateTime = value;
      if (!dayjs.isDayjs(mDateTime) && !moment.isMoment(mDateTime)) mDate = dayjs(mDateTime);
      if (!mDateTime.isValid()) return null;

      return mDateTime.format();
    case 'password':
    case 'files':
    case 'file':
      if (value) return value;
      return;
    default:
      return value;
  }
};

const reverseCastValue = (type, value) => {
  switch (type.toLowerCase()) {
    case 'files':
      return value.filter(f => f instanceof File);
    case 'file':
      return value;
    case 'location':
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
    case 'boolean':
      if(!value) return null

      return value === "true" || value === "1" || value
    case 'float':
      return toFloat(value);
    case 'integer':
      return parseInt(value, 10);
    case 'string':
      return typeof value === 'string' ? value : value.toString();
    case 'datetime':
    case 'date':
      if (dayjs.isDayjs(value)) return value;
      return moment.isMoment(value) ? value : dayjs(value);
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
        case 'attachment':
          if (attributes[key].id) formattedModel[`${key}Id`] = attributes[key].id
          break;
        case 'files':
          if (attributes[key]) formattedModel[key] = castValue('Files', attributes[key]);
          break;
        case 'file':
          if (attributes[key] && attributes[key] instanceof File) formattedModel[key] = castValue('File', attributes[key]);
          break;
        case 'password':
          if (attributes[key]) formattedModel[key] = castValue('String', attributes[key]);
          break;
        case 'nested':
          if (attributes[key])
            formattedModel[`${key}Attributes`] = isArray(attributes[key])
              ? attributes[key].map((v) => omit(v, ['__typename']))
              : omit(attributes[key], ['__typename']);
          break;
        default:
          formattedModel[key] = castValue(value.toLowerCase(), attributes[key])
          break;
      }
    } else if (value !== 'password' && value !== 'nested' && value !== 'id' && value !== "Attachment") {
      if (!options.skipUndefinedKeys || attributes.hasOwnProperty(key)) formattedModel[key] = null;
    }
  });
  return formattedModel;
}

export default castAttributesFromModel;
