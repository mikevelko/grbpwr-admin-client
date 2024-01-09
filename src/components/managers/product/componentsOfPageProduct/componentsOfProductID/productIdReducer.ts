/* eslint-disable no-case-declarations */
import {
  common_GenderEnum,
  common_Genders,
  common_MeasurementName,
  common_ProductFull,
  common_Size,
} from 'api/proto-http/admin';

export type MeasurementUpdates = {
  [key: string]: string;
};

export interface ProductFields {
  [key: string]: number | string | common_GenderEnum;
  newProductName: string;
  newSku: string;
  newPreorder: string;
  newColor: string;
  newColorHEX: string;
  newCountry: string;
  newBrand: string;
  newGender: common_GenderEnum;
  newThumbnail: string;
  newPrice: string;
  newSale: string;
  newCategory: number;
  newDescription: string;
  newTag: string;
}

interface IState {
  product: common_ProductFull | undefined;
  genders: common_Genders[] | undefined;
  productFields: ProductFields;
  showAddMedia: boolean;
  tags: string[];
  measurement: MeasurementUpdates;
  sizeUpdates: { [sizeId: string]: number };
  sizes: common_Size[];
  measurements: common_MeasurementName[] | undefined;
  // ... other states
}

const initialState: IState = {
  product: undefined,
  genders: undefined,
  productFields: {
    newProductName: '',
    newSku: '',
    newPreorder: '',
    newColor: '',
    newColorHEX: '',
    newCountry: '',
    newBrand: '',
    newGender: 'GENDER_ENUM_UNKNOWN', // Assuming 'GENDER_ENUM_UNKNOWN' is a valid value
    newThumbnail: '',
    newPrice: '',
    newSale: '',
    newCategory: 0,
    newDescription: '',
    newTag: '',
    // ... other initial values for product fields
  },
  showAddMedia: false,
  tags: [],
  measurement: {},
  sizeUpdates: {},
  sizes: [],
  measurements: [],
};

type ActionType =
  | { type: 'SET_PRODUCT'; payload: common_ProductFull | undefined }
  | {
      type: 'UPDATE_PRODUCT_FIELD';
      fieldName: keyof ProductFields;
      value: string | number | common_GenderEnum;
    }
  | { type: 'UPDATE_SIZE'; sizeId: number | undefined; quantity: number | undefined }
  | { type: 'UPDATE_MEASUREMENT'; sizeId: number; measurementNameId: number; value: string }
  | { type: 'SET_GENDERS'; payload: common_Genders[] | undefined }
  | { type: 'TOGGLE_ADD_MEDIA' }
  | { type: 'TOGGLE_HIDE_PRODUCT'; payload: { productId: number; hideStatus: boolean } }
  | { type: 'SET_TAGS'; payload: string[] }
  | { type: 'SET_NEW_TAG'; payload: string }
  | { type: 'ADD_TAG'; tag: string }
  | { type: 'REMOVE_TAG'; tag: string }
  | { type: 'SET_SIZES'; payload: common_Size[] }
  | { type: 'SET_MEASUREMENTS'; payload: common_MeasurementName[] };

const reducer = (state: IState, action: ActionType): IState => {
  switch (action.type) {
    case 'SET_PRODUCT':
      const productTags =
        action.payload?.tags
          ?.map((tag) => tag.productTagInsert?.tag)
          .filter((tagName): tagName is string => tagName !== undefined) ?? [];
      return {
        ...state,
        product: action.payload,
        tags: productTags,
      };
    case 'UPDATE_PRODUCT_FIELD':
      return {
        ...state,
        productFields: {
          ...state.productFields,
          [action.fieldName]: action.value,
        },
      };
    case 'TOGGLE_ADD_MEDIA':
      return { ...state, showAddMedia: !state.showAddMedia };
    case 'TOGGLE_HIDE_PRODUCT':
      if (state.product && state.product.product?.id === action.payload.productId) {
        // Assuming your product structure has a 'hidden' field to toggle
        const updatedProduct = {
          ...state.product,
          product: {
            ...state.product.product,
            hidden: action.payload.hideStatus,
          },
        };
        return { ...state, product: updatedProduct };
      }
      return state;
    case 'ADD_TAG':
      return {
        ...state,
        tags: [...state.tags, action.tag],
      };
    case 'REMOVE_TAG':
      return {
        ...state,
        tags: state.tags.filter((tag) => tag !== action.tag),
      };
    case 'SET_NEW_TAG':
      return {
        ...state,
        productFields: {
          ...state.productFields,
          newTag: action.payload,
        },
      };
    case 'UPDATE_MEASUREMENT':
      const measurementKey = `${action.sizeId}-${action.measurementNameId}`;
      return {
        ...state,
        measurement: {
          ...state.measurement,
          [measurementKey]: action.value,
        },
      };
    case 'UPDATE_SIZE':
      if (typeof action.sizeId === 'number') {
        return {
          ...state,
          sizeUpdates: {
            ...state.sizeUpdates,
            [action.sizeId]: action.quantity,
          },
        };
      }
      return state;
    case 'SET_SIZES':
      return { ...state, sizes: action.payload };

    case 'SET_MEASUREMENTS':
      return { ...state, measurements: action.payload };
    case 'SET_GENDERS':
      return { ...state, genders: action.payload };
    default:
      return state;
  }
};

export { reducer, initialState };
