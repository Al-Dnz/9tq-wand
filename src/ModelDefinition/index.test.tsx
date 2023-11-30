import '@testing-library/jest-dom';
import ModelDefinition from './index';
import dayjs from 'dayjs';

describe('ModelDefinition', () => {
  it('cast string to float', () => {
    const definition = new ModelDefinition({
      price: 'float',
    });
    const parsedAttributes = definition.parse({ price: '45,87' });
    expect(parsedAttributes.price).toEqual(45.87);
  });

  it('cast date to string', () => {
    const date = dayjs();
    const definition = new ModelDefinition({
      date: 'date',
      datetime: 'datetime',
    });
    const parsedAttributes = definition.parse({ date, datetime: date });
    expect(parsedAttributes.date).toEqual(dayjs().format('YYYY-MM-DD'));
  });
});
