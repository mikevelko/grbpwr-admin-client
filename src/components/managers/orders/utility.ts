import { common_Dictionary } from 'api/proto-http/admin';

/* eslint-disable @typescript-eslint/no-unused-vars */
type Pattern = {
  [key: string]: RegExp;
};

const pattern: Pattern = {
  size: /SIZE_ENUM_/,
  measurement: /MEASUREMENT_NAME_ENUM_/,
  category: /CATEGORY_ENUM_/,
};

type dictionaryTypes = 'size' | 'order' | 'carrier' | 'status' | 'measurement' | 'category';

export const findInDictionary = (
  dictionary: common_Dictionary | undefined,
  id: number | undefined,
  type: dictionaryTypes,
) => {
  if (!dictionary || id === undefined) return null;

  let data;
  switch (type) {
    case 'category':
      data = dictionary.categories?.find((s) => s.id === id)?.name?.replace(pattern[type], '');
      break;
    case 'size':
      data = dictionary.sizes?.find((s) => s.id === id)?.name?.replace(pattern[type], '');
      break;
    case 'measurement':
      data = dictionary.measurements?.find((s) => s.id === id)?.name?.replace(pattern[type], '');
      break;
    case 'order':
      data = dictionary.orderStatuses?.find((s) => s.id === id)?.name?.replace(pattern[type], '');
      break;
    case 'carrier':
      data = dictionary.shipmentCarriers?.find((s) => s.id === id)?.shipmentCarrier?.carrier;
      break;
    case 'status':
      data = dictionary.orderStatuses?.find((s) => s.id === id)?.name?.replace(pattern[type], '');
      break;

    default:
      data = null;
  }

  return data;
};

export function formatDateTime(value: string | undefined): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return `${formattedDate}, ${formattedTime}`;
}
