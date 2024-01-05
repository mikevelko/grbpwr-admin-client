/* eslint-disable no-case-declarations */
import React, { FC, useState, useEffect, useReducer } from 'react';
import { reducer, initialState } from './componentsOfProductID/productIdReducer';
import { Layout } from 'components/layout/layout';
import {
  common_GenderEnum,
  common_Genders,
  common_MeasurementName,
  common_ProductFull,
  common_Size,
} from 'api/proto-http/admin';
import { getProductByID, getDictionary } from 'api/admin';
import { UpdateInputField } from './componentsOfProductID/updateInputField';
import { UpdateColors } from './componentsOfProductID/updateColors';
import { AddMediaByID } from './componentsOfProductID/addMediaById';
import { UpdateSizeMeasurements } from './componentsOfProductID/updateSizeMeasurements';
import {
  updateName,
  updateSku,
  updatePreorder,
  updateColors,
  updateCountry,
  updateBrand,
  updateGender,
  updateThumbnail,
  updatePrice,
  updateSale,
  updateCategory,
  updateSize,
  updateMeasurement,
  updateDescription,
  updateTag,
  deleteTag,
  updateHide,
} from 'api/byID';
import queryString from 'query-string';
import styles from 'styles/productID.scss';
// TODO: ????
interface ProductFields {
  // TODO: ???
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

export const ProductId: FC = () => {
  const queryParams = queryString.parse(window.location.search);
  const productId = queryParams.productId as string;
  const [state, dispatch] = useReducer(reducer, initialState);

  const [sizeDictionary, setSizeDictionary] = useState<common_Size[]>([]);
  const [genders, setGenders] = useState<common_Genders[] | undefined>(undefined);
  // const [productFields, setProductFields] = useState<ProductFields>({
  //   newProductName: '',
  //   newSku: '',
  //   newPreorder: '',
  //   newColor: '',
  //   newColorHEX: '',
  //   newCountry: '',
  //   newBrand: '',
  //   newGender: '' as common_GenderEnum,
  //   newThumbnail: '',
  //   newPrice: '',
  //   newSale: '',
  //   newCategory: 0,
  //   newDescription: '',
  // });
  // const [sizeUpdates, setSizeUpdates] = useState<{ [sizeId: string]: number }>({});
  // const [measurement, setMeasurement] = useState<common_MeasurementName[]>([]);
  // const [measurementUpdates, setMeasurementUpdates] = useState<MeasurementUpdates>({});
  // const [showAddMedia, setShowAddMedia] = useState(false);
  // const [tags, setTags] = useState<string[]>([]);
  // const [newTag, setNewTag] = useState<string>('');

  const updateFunctions = {
    newProductName: updateName,
    newSku: updateSku,
    newPreorder: updatePreorder,
    newColor: updateColors,
    newColorHEX: updateColors,
    newCountry: updateCountry,
    newBrand: updateBrand,
    newGender: updateGender,
    newThumbnail: updateThumbnail,
    newPrice: updatePrice,
    newSale: updateSale,
    newCategory: updateCategory,
    newDescription: updateDescription,
  };

  // const handleMeasurementChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   sizeId: number,
  //   measurementNameId: number,
  // ) => {
  //   const key = `${sizeId}-${measurementNameId}`;
  //   setMeasurementUpdates({
  //     ...measurementUpdates,
  //     [key]: e.target.value,
  //   });
  // };

  // const updateMeasurementValue = async (sizeId: number, measurementNameId: number) => {
  //   const key = `${sizeId}-${measurementNameId}`;
  //   const measurementValue = measurementUpdates[key];
  //   if (!sizeId || !measurementNameId || !measurementValue || !product?.product?.id) return;

  //   try {
  //     const decimalValue = createDecimalObject(measurementValue);
  //     await updateMeasurement({
  //       productId: product.product.id,
  //       sizeId,
  //       measurementNameId,
  //       measurementValue: decimalValue,
  //     });
  //     // Optionally, update local state or refetch measurement details
  //   } catch (error) {
  //     console.error('Error updating measurement:', error);
  //   }
  // };

  // const handleSizeChange = (sizeId: number | undefined, quantity: number) => {
  //   if (typeof sizeId !== 'undefined') {
  //     setSizeUpdates((prev) => ({ ...prev, [sizeId]: quantity }));
  //   }
  // };

  // const updateSizeQuantity = async (sizeId: number | undefined, quantity: number | undefined) => {
  //   if (typeof sizeId === 'undefined' || typeof quantity === 'undefined' || !product?.product?.id)
  //     return;
  //   try {
  //     await updateSize({ productId: product.product.id, sizeId, quantity });
  //     // Optionally, update local state or refetch product details
  //   } catch (error) {
  //     console.error('Error updating size:', error);
  //   }
  // };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    dispatch({
      type: 'UPDATE_PRODUCT_FIELD',
      fieldName: name as keyof ProductFields,
      value,
    });
  };

  const updateProduct = async (fieldNameToUpdate: string) => {
    if (!state.product?.product?.id) {
      console.error('Product ID is undefined');
      return;
    }

    const productId = state.product.product.id;
    const value = state.productFields[fieldNameToUpdate as keyof ProductFields];

    try {
      switch (fieldNameToUpdate) {
        case 'newProductName':
          await updateName({ productId, name: value as string });
          break;
        case 'newSku':
          await updateSku({ productId, sku: value as string });
          break;
        case 'newPreorder':
          await updatePreorder({ productId, preorder: value as string });
          break;
        case 'newColor':
          if (state.productFields.newColor && state.productFields.newColorHEX) {
            await updateColors({
              productId,
              color: state.productFields.newColor,
              colorHex: state.productFields.newColorHEX,
            });
          }
          break;
        case 'newCountry':
          await updateCountry({ productId, countryOfOrigin: value as string });
          break;
        case 'newBrand':
          await updateBrand({ productId, brand: value as string });
          break;
        case 'newGender':
          await updateGender({
            productId,
            gender: state.productFields.newGender,
          });
          break;
        case 'newThumbnail':
          await updateThumbnail({ productId, thumbnail: value as string });
          break;
        case 'newPrice':
          const decimalPrice = createDecimalObject(state.productFields.newPrice);
          await updatePrice({ productId, price: decimalPrice });
          break;
        case 'newSale':
          const decimalSale = createDecimalObject(state.productFields.newSale);
          await updateSale({ productId, sale: decimalSale });
          break;
        case 'newCategory':
          await updateCategory({ productId, categoryId: Number(value) });
          break;
        case 'newDescription':
          await updateDescription({ productId, description: value as string });
          break;
        default:
          console.warn(`No update function for field: ${fieldNameToUpdate}`);
      }

      dispatch({
        type: 'UPDATE_PRODUCT_FIELD',
        fieldName: fieldNameToUpdate,
        value: value,
      });

      console.log(`Product field ${fieldNameToUpdate} updated successfully`);
    } catch (error) {
      console.error(`Error updating product field ${fieldNameToUpdate}:`, error);
    }
  };

  function createDecimalObject(decimalString: string) {
    if (!decimalString) return { value: '0' };
    return { value: decimalString };
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProductByID({ id: Number(productId) });
        dispatch({ type: 'SET_PRODUCT', payload: response.product });
        const dictionaryResponse = await getDictionary({});
        dispatch({
          type: 'SET_SIZE_DICTIONARY',
          payload: dictionaryResponse.dictionary?.sizes || [],
        });
        dispatch({ type: 'SET_GENDERS', payload: dictionaryResponse.dictionary?.genders });
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [productId]);

  const getSizeName = (sizeId: number | undefined): string => {
    const size = sizeDictionary.find((s) => s.id === sizeId);
    if (size && size.name) {
      return size.name.replace('SIZE_ENUM_', '');
    }
    return 'size not found';
  };

  // const getMeasuremntName = (measurementId: number | undefined): string => {
  //   const measure = measurement.find((m) => m.id === measurementId);
  //   if (measure && measure.name) {
  //     return measure.name.replace('MEASUREMENT_NAME_ENUM_', '');
  //   }
  //   return 'size not found';
  // };

  // const toogleAddMedia = () => {
  //   setShowAddMedia(!showAddMedia);
  // };

  // const handleNewTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setNewTag(e.target.value);
  // };
  // ADD TAG

  // const addTag = async () => {
  //   if (newTag && product?.product?.id) {
  //     try {
  //       await updateTag({ productId: product.product.id, tag: newTag });
  //       setTags((prev) => [...prev, newTag]);
  //       setNewTag('');
  //     } catch (error) {
  //       console.error('Error adding tag:', error);
  //     }
  //   }
  // };

  // DELETE TAG

  // const deleteUpdatedTag = async (tag: string) => {
  //   if (tag && product?.product?.id) {
  //     try {
  //       await deleteTag({ productId: product.product.id, tag });
  //       setTags((prev) => prev.filter((t) => t !== tag));
  //     } catch (error) {
  //       console.error('Error deleting tag:', error);
  //     }
  //   }
  // };

  // const toggleHideProduct = async (
  //   productId: number | undefined,
  //   currentHideStatus: boolean | undefined,
  // ) => {
  //   if (productId !== undefined) {
  //     try {
  //       const request = {
  //         id: productId,
  //         hide: !currentHideStatus, // Toggle the hide status
  //       };
  //       await updateHide(request);
  //       // Handle the response, e.g., update local state or UI
  //       setProuct((prevProduct) => {
  //         if (!prevProduct) return prevProduct; // If there's no previous product, return as is

  //         // Creating a deep copy of the product object
  //         const updatedProduct = JSON.parse(JSON.stringify(prevProduct));

  //         // Updating the 'hidden' property
  //         updatedProduct.product.hidden = !currentHideStatus;

  //         return updatedProduct; // Return the updated product
  //       });
  //     } catch (error) {
  //       console.error('Error toggling product hide status:', error);
  //     }
  //   }
  // };

  return (
    <Layout>
      <div className={styles.product_id_full_content}>
        <div className={styles.img_grid}>
          <div className={styles.main_img_container}>
            <img
              src={state.product?.product?.productInsert?.thumbnail}
              alt='thumbnail'
              className={styles.main_img}
            />
            {/* <button onClick={toogleAddMedia}>add</button>
            {showAddMedia && (
              <div className={styles.add_media}>
                <AddMediaByID />
              </div>
            )} */}
          </div>
          <ul className={styles.product_by_id_media_list}>
            {state.product?.media?.map((media, index) => (
              <li key={index}>
                <p>{index + 1}</p>
                <img src={media.productMediaInsert?.compressed} alt='' />
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.product_id_information}>
          {/* <button
            onClick={() =>
              toggleHideProduct(product?.product?.id, product?.product?.productInsert?.hidden)
            }
          >
            {state.product?.product?.productInsert?.hidden ? 'Unhide Product' : 'Hide Product'}
          </button> */}
          <UpdateInputField
            label='Name'
            productInfo={state.product?.product?.productInsert?.name}
            name='newProductName'
            value={state.productFields.newProductName}
            onChange={handleChange}
            updateFunction={() => updateProduct('newProductName')}
          />

          <UpdateInputField
            label='description'
            productInfo={state.product?.product?.productInsert?.description}
            name='newDescription'
            value={state.productFields.newDescription}
            onChange={handleChange}
            updateFunction={() => updateProduct('newDescription')}
          />
          <UpdateInputField
            label='Sku'
            productInfo={state.product?.product?.productInsert?.sku}
            name='newSku'
            value={state.productFields.newSku}
            onChange={handleChange}
            updateFunction={() => updateProduct('newSku')}
          />
          <UpdateInputField
            label='Preorder'
            productInfo={state.product?.product?.productInsert?.preorder}
            name='newPreorder'
            value={state.productFields.newPreorder}
            onChange={handleChange}
            updateFunction={() => updateProduct('newPreorder')}
          />
          <UpdateColors
            label='Colors'
            productInfo={state.product?.product?.productInsert?.color}
            productInfoHEX={state.product?.product?.productInsert?.colorHex}
            colorName='newColor'
            hexName='newColorHEX'
            colorValue={state.productFields.newColor}
            hexValue={state.productFields.newColorHEX}
            onChange={handleChange}
            updateFunction={() => updateProduct('newColor')}
          />
          <UpdateInputField
            label='Country'
            productInfo={state.product?.product?.productInsert?.countryOfOrigin}
            name='newCountry'
            value={state.productFields.newCountry}
            onChange={handleChange}
            updateFunction={() => updateProduct('newCountry')}
          />
          <UpdateInputField
            label='Brand'
            productInfo={state.product?.product?.productInsert?.brand}
            name='newBrand'
            value={state.productFields.newBrand}
            onChange={handleChange}
            updateFunction={() => updateProduct('newBrand')}
          />
          <UpdateInputField
            label='Thumbnail'
            productInfo={state.product?.product?.productInsert?.thumbnail}
            name='newThumbnail'
            value={state.productFields.newThumbnail}
            onChange={handleChange}
            updateFunction={() => updateProduct('newThumbnail')}
          />
          <UpdateInputField
            label='Price'
            productInfo={state.product?.product?.productInsert?.price?.value}
            name='newPrice'
            value={state.productFields.newPrice}
            onChange={handleChange}
            updateFunction={() => updateProduct('newPrice')}
          />
          <UpdateInputField
            label='Sale'
            productInfo={state.product?.product?.productInsert?.salePercentage?.value}
            name='newSale'
            value={state.productFields.newSale}
            onChange={handleChange}
            updateFunction={() => updateProduct('newSale')}
          />
          <UpdateInputField
            label='Category'
            productInfo={state.product?.product?.productInsert?.categoryId}
            name='newCategory'
            value={state.productFields.newCategory}
            onChange={handleChange}
            updateFunction={() => updateProduct('newCategory')}
          />

          {/* <div>
            <h3>Tags</h3>
            {state.tags.map((tag, index) => (
              <div key={index}>
                {tag} <button onClick={() => deleteUpdatedTag(tag)}>Delete</button>
              </div>
            ))}
            <input
              type='text'
              placeholder='Add new tag'
              value={newTag}
              onChange={handleNewTagChange}
            />
            <button onClick={addTag}>Add Tag</button>
          </div> */}

          {/* <h3>{product?.product?.productInsert?.targetGender}</h3>
          <select name='newGender' value={productFields.newGender} onChange={handleChange}>
            <option value='GENDER_ENUM_UNKNOWN'>Select gender</option>
            {genders?.map((gender, _) => (
              <option key={gender.id} value={gender.id}>
                {gender.name}
              </option>
            ))}
          </select>
          <button onClick={() => updateProduct('newGender')}>+</button> */}

          {/* <UpdateSizeMeasurements
            sizes={state.product?.sizes}
            measurements={state.product?.measurements}
            sizeUpdates={state.sizeUpdates}
            measurementUpdates={measurementUpdates}
            getSizeName={getSizeName}
            getMeasuremntName={getMeasuremntName}
            handleSizeChange={handleSizeChange}
            handleMeasurementChange={handleMeasurementChange}
            updateSizeQuantity={updateSizeQuantity}
            updateMeasurementValue={updateMeasurementValue}
          /> */}
        </div>
      </div>
    </Layout>
  );
};
