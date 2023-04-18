import '@testing-library/jest-dom';
import moment from 'moment';
import ModelDefinition from './index';

describe('ModelDefinition', () => {
  it('cast string to float', () => {
    const definition = new ModelDefinition({
      price: 'float',
    });
    const parsedAttributes = definition.parse({ price: '45,87' });
    expect(parsedAttributes.price).toEqual(45.87);
  });

  it('cast date to string', () => {
    const date = moment();
    const definition = new ModelDefinition({
      date: 'date',
      datetime: 'datetime',
    });
    const parsedAttributes = definition.parse({ date, datetime: date });
    expect(parsedAttributes.date).toEqual(moment().format('YYYY-MM-DD'));
  });
});
