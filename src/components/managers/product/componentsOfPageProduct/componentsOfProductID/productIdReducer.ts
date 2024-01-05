import {
  common_GenderEnum,
  common_Genders,
  common_MeasurementName,
  common_ProductFull,
  common_Size,
} from 'api/proto-http/admin';

type MeasurementUpdates = {
  [key: string]: string;
};

interface ProductFields {
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
}

interface IState {
  product: common_ProductFull | undefined;
  sizeDictionary: common_Size[];
  genders: common_Genders[] | undefined;
  productFields: ProductFields;
  // ... other states
}

const initialState: IState = {
  product: undefined,
  sizeDictionary: [],
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
    // ... other initial values for product fields
  },
  // ... other initial values for state
};

type ActionType =
  | { type: 'SET_PRODUCT'; payload: common_ProductFull | undefined }
  | {
      type: 'UPDATE_PRODUCT_FIELD';
      fieldName: keyof ProductFields;
      value: string | number | common_GenderEnum;
    }
  | { type: 'SET_SIZE_DICTIONARY'; payload: common_Size[] }
  | { type: 'SET_GENDERS'; payload: common_Genders[] | undefined }
  | { type: 'UPDATE_SIZE_UPDATE'; sizeId: string; quantity: number }
  | { type: 'SET_MEASUREMENT_UPDATES'; payload: MeasurementUpdates }
  | { type: 'TOGGLE_ADD_MEDIA' }
  | { type: 'SET_TAGS'; payload: string[] }
  | { type: 'ADD_TAG'; tag: string }
  | { type: 'REMOVE_TAG'; tag: string };

const reducer = (state: IState, action: ActionType): IState => {
  switch (action.type) {
    case 'SET_PRODUCT':
      return { ...state, product: action.payload };
    case 'UPDATE_PRODUCT_FIELD':
      return {
        ...state,
        productFields: {
          ...state.productFields,
          [action.fieldName]: action.value,
        },
      };
    // ... other cases for different actions
    default:
      return state;
  }
};

// Export the reducer and the initial state
export { reducer, initialState };
