import React from 'react';
import castAttributesFromModel from './castAttributesFromDefinition';


type OptionsType = {
  skipUndefinedKeys?: boolean;
};

type PlacesType = {
  type: 'places';
  options?: {
    formattedAddress?: string;
    lat?: string;
    lng?: string;
    city?: string;
  }
}


export type ModelDefinitionType<RecordType = unknown, Keys extends keyof RecordType = keyof RecordType> = {
  [K in Keys]:
    | 'password'
    | 'float'
    | 'integer'
    | 'other'
    | 'nested'
    | 'datetime'
    | 'date'
    | 'string'
    | 'files'
    | 'file'
    | 'boolean'
    | 'array'
    | PlacesType
    | ModelDefinitionType;
};

const defaultOptions = {
  skipUndefinedKeys: true,
};

class ModelDefinition {
  definition: ModelDefinitionType;
  options: OptionsType;

  constructor(definition = {}, options = defaultOptions) {
    this.definition = definition;
    this.options = options;
  }

  parse(object: any) {
    return castAttributesFromModel(this.definition, object, this.options);
  }
};

export default ModelDefinition;
