type OptionsType = {
  separator?: string;
  split?: any;
};

const separateWords = (string: string, options: OptionsType) => {
  options = options || {};
  var separator = options.separator || '_';
  var split = options.split || /(?=[A-Z])/;

  return string.split(split).join(separator);
};

const decamelize = (string: string, options: OptionsType) => {
  return separateWords(string, options).toLowerCase();
};

export default decamelize;
