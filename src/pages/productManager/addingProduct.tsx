import React, { FC, useState, useRef, useEffect } from 'react';
import update from 'immutability-helper';
import { Layout } from 'components/layout';
import {
  common_ProductNew,
  common_SizeEnum,
  common_MeasurementNameEnum,
  common_ProductSizeInsert,
  common_CategoryEnum,
  googletype_Decimal,
} from 'api/proto-http/admin';
import { addProduct } from 'api';
import { ChromePicker } from 'react-color';
import styles from 'styles/addProd.scss';
import { Thumbnail } from './productManagerComponents/thumbnail';
// import { Sizes } from "./productManagerComponents/sizes";
import { Tags } from './productManagerComponents/tag';


// const availableSizes: common_SizeEnum[] = [
//   'SIZE_ENUM_XXS',
//   'SIZE_ENUM_XS',
//   'SIZE_ENUM_S',
//   'SIZE_ENUM_M',
//   'SIZE_ENUM_L',
//   'SIZE_ENUM_XL',
//   'SIZE_ENUM_XXL',
//   'SIZE_ENUM_OS',
// ];

const selectMeasurement: common_MeasurementNameEnum[] = [
  'MEASUREMENT_NAME_ENUM_WAIST',
  'MEASUREMENT_NAME_ENUM_INSEAM',
  'MEASUREMENT_NAME_ENUM_LENGTH',
  'MEASUREMENT_NAME_ENUM_RISE',
  'MEASUREMENT_NAME_ENUM_HIPS',
  'MEASUREMENT_NAME_ENUM_SHOULDERS',
  'MEASUREMENT_NAME_ENUM_BUST',
  'MEASUREMENT_NAME_ENUM_SLEEVE',
  'MEASUREMENT_NAME_ENUM_WIDTH',
  'MEASUREMENT_NAME_ENUM_HEIGHT',
];

const categories: common_CategoryEnum[] = [
  'CATEGORY_ENUM_T_SHIRT',
  'CATEGORY_ENUM_JEANS',
  'CATEGORY_ENUM_DRESS',
  'CATEGORY_ENUM_JACKET',
  'CATEGORY_ENUM_SWEATER',
  'CATEGORY_ENUM_PANT',
  'CATEGORY_ENUM_SKIRT',
  'CATEGORY_ENUM_SHORT',
  'CATEGORY_ENUM_BLAZER',
  'CATEGORY_ENUM_COAT',
  'CATEGORY_ENUM_SOCKS',
  'CATEGORY_ENUM_UNDERWEAR',
  'CATEGORY_ENUM_BRA',
  'CATEGORY_ENUM_HAT',
  'CATEGORY_ENUM_SCARF',
  'CATEGORY_ENUM_GLOVES',
  'CATEGORY_ENUM_SHOES',
  'CATEGORY_ENUM_BELT',
  'CATEGORY_ENUM_OTHER',
];

export const initialProductState: common_ProductNew = {
  media: [],
  product: {
    preorder: '',
    name: '',
    brand: '',
    sku: '', // VENDOR CODE
    color: '',
    colorHex: '',
    countryOfOrigin: '',
    thumbnail: '',
    price: { value: '' },
    salePercentage: undefined,
    categoryId: 0,
    description: '',
    hidden: false,
    targetGender: 'GENDER_ENUM_MALE',
  },
  sizeMeasurements: [],
  tags: [],
};

export const AddProducts: FC = () => {
  const [product, setProduct] = useState<common_ProductNew>({
    ...initialProductState,
    tags: [],
  });
  // Color HEX
  const [color, setColor] = useState('#000000');
  const [showHex, setShowHex] = useState(false);
  const colorPickerRef = useRef<any>(null);

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>, sizeIndex: number) => {
    const { name, value } = e.target;

    setProduct((prevProduct) => {
      const updatedSizeMeasurements = [...(prevProduct.sizeMeasurements || [])];
      const sizeQuantity: googletype_Decimal = { value: value };

      if (!updatedSizeMeasurements[sizeIndex]) {
        const sizeId = sizeIndex + 1;

        const productSize: common_ProductSizeInsert = {
          quantity: sizeQuantity,
          sizeId: sizeId,
        };

        updatedSizeMeasurements[sizeIndex] = {
          productSize: productSize,
          measurements: [],
        };
      } else {
        // Create a copy of the object to ensure type safety
        updatedSizeMeasurements[sizeIndex] = {
          productSize: {
            quantity: sizeQuantity,
            sizeId: updatedSizeMeasurements[sizeIndex].productSize?.sizeId || sizeIndex,
          },
          measurements: [],
        };
      }

      return { ...prevProduct, sizeMeasurements: updatedSizeMeasurements };
    });
  };

  const handleMeasurementChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    sizeIndex: number,
    measurementIndex: number,
  ) => {
    const { name, value } = e.target;

    setProduct((prevProduct) => {
      const updatedSizeMeasurements = [...(prevProduct.sizeMeasurements || [])];

      if (updatedSizeMeasurements[sizeIndex]) {
        const updatedMeasurements = [...(updatedSizeMeasurements[sizeIndex].measurements || [])];

        const measurementValue: googletype_Decimal = { value: value };

        updatedMeasurements[measurementIndex] = {
          measurementNameId: measurementIndex + 1, // You may adjust this index based on your requirements
          measurementValue: measurementValue,
        };

        updatedSizeMeasurements[sizeIndex] = {
          ...updatedSizeMeasurements[sizeIndex],
          measurements: updatedMeasurements,
        };

        return { ...prevProduct, sizeMeasurements: updatedSizeMeasurements };
      }

      return prevProduct;
    });
  };

  const handleCategorySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = parseInt(e.target.value, 10); // Parse the selected value to a number
    setProduct((prevProduct) => {
      return update(prevProduct, {
        product: {
          categoryId: { $set: selectedCategoryId },
        },
      });
    });
  };

  const handleColorHexClick = () => {
    // Toggle the visibility of the color picker
    setShowHex(!showHex);
  };

  const onColorPickerInfoChange = (color: any) => {
    setProduct((prevProduct) => {
      return update(prevProduct, {
        product: {
          colorHex: { $set: color.hex },
        },
      });
    });
    setColor(color.hex);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setProduct((prevProduct) => {
      return update(prevProduct, {
        product: {
          [name]: {
            $set: name === 'price' || name === 'salePercentage' ? { value: value } : value,
          },
        },
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Filter sizeMeasurements to include only items with non-null quantities
      const nonEmptySizeMeasurements = product.sizeMeasurements?.filter(
        (sizeMeasurement) =>
          sizeMeasurement &&
          sizeMeasurement.productSize &&
          sizeMeasurement.productSize.quantity !== null,
      );

      // Update the product with the filtered sizeMeasurements
      const productToDisplayInJSON = {
        ...product,
        sizeMeasurements: nonEmptySizeMeasurements,
      };

      // Convert the categoryText to an array before submitting
      const response = await addProduct(productToDisplayInJSON);
      // Handle the response
      console.log('Product added:', response);
      // Reset the form state

      setProduct(initialProductState);
    } catch (error) {
      setProduct(initialProductState);
      // Handle errors
      console.error('Error adding product:', error);
    }
  };

  const updateProductMedia = (updatedMedia: any) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      media: updatedMedia,
    }));
  };

  const updateTags = (updatedTags: any) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      tags: updatedTags, // Update the tags in the product state
    }));
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.product_container}>
          <label htmlFor='name' className={styles.title}>
            NAME
          </label>
          <input
            type='text'
            name='name'
            value={product.product?.name}
            onChange={handleChange}
            id='name'
            className={styles.product_input}
          />
        </div>

        <div className={styles.product_container}>
          <label className={styles.title} htmlFor='country'>
            COUNTRY
          </label>
          <input
            type='text'
            name='countryOfOrigin'
            value={product.product?.countryOfOrigin}
            onChange={handleChange}
            id='country'
            className={styles.product_input}
          />
        </div>

        <div className={styles.product_container}>
          <label className={styles.title} htmlFor='brand'>
            BRAND
          </label>
          <input
            type='text'
            name='brand'
            value={product.product?.brand}
            onChange={handleChange}
            id='brand'
            className={styles.product_input}
          />
        </div>

        <div className={styles.product_container}>
          <label htmlFor='price' className={styles.title}>
            Price
          </label>
          <input
            type='text'
            name='price'
            value={product.product?.price?.value}
            onChange={handleChange}
            className={styles.product_input}
          />
        </div>

        <div className={styles.product_container}>
          <label htmlFor='sale' className={styles.title}>
            SALES
          </label>
          <input
            type='text'
            name='salePercentage'
            value={product.product?.salePercentage?.value}
            onChange={handleChange}
            id='sale'
            className={styles.product_input}
          />
        </div>

        <div className={styles.product_container}>
          <label htmlFor='preorder' className={styles.title}>
            PREORDER
          </label>
          <input
            type='text'
            name='preorder'
            value={product.product?.preorder}
            onChange={handleChange}
            id='preorder'
            className={styles.product_input}
          />
        </div>

        <div className={styles.product_container}>
          <label htmlFor='descrip' className={styles.title}>
            DESCRIPTION
          </label>
          <textarea
            name='description'
            id='descrip'
            value={product.product?.description}
            cols={30}
            rows={10}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className={styles.product_container}>
          <label htmlFor='sku' className={styles.title}>
            Vendor Code
          </label>
          <input
            type='text'
            name='sku'
            value={product.product?.sku}
            id='sku'
            className={styles.product_input}
            onChange={handleChange}
          />
        </div>

        <div className={styles.product_container}>
          <label htmlFor='color' className={styles.title}>
            Color
          </label>
          <input
            type='text'
            name='color'
            value={product.product?.color}
            id='color'
            className={styles.product_input}
            onChange={handleChange}
          />
        </div>

        <div className={styles.product_container}>
          <label htmlFor='thumb' className={styles.title}>
            Thumbnail
          </label>
          <input
            type='text'
            name='thumbnail'
            value={product.product?.thumbnail}
            onChange={handleChange}
            className={styles.product_input}
          />
        </div>

        <div className={styles.product_container}>
          <label htmlFor='color_hex' className={styles.title}>
            Color Hex
          </label>
          <input
            type='text'
            name='colorHex'
            value={product.product?.colorHex}
            id='color_hex'
            onClick={handleColorHexClick}
            className={styles.product_input}
            onChange={handleChange}
          />
          <div ref={colorPickerRef} className={styles.color}>
            {showHex && (
              <ChromePicker
                className={styles.color_picker}
                color={color}
                onChangeComplete={onColorPickerInfoChange}
                disableAlpha={true}
              />
            )}
          </div>
        </div>

        <div className={styles.product_container}>
          <label htmlFor='category' className={styles.title}>
            Categories
          </label>
          <select
            name='categoryId'
            value={product.product?.categoryId}
            id=''
            onChange={handleCategorySelectChange}
            className={styles.product_input}
          >
            <option value=''>Select category</option>
            {categories.map((category, categoryIndex) => (
              <option value={categoryIndex + 1} key={categoryIndex}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.product_container}>
          <label className={styles.title}>Sizes</label>
          <div>
            {common_SizeEnum.map((size, sizeIndex) => (
              <div key={sizeIndex}>
                <label htmlFor={size}>{size}</label>
                <input
                  type='number'
                  id={size}
                  name='quantity'
                  onChange={(e) => handleSizeChange(e, sizeIndex)}
                />
                <div>
                  {selectMeasurement.map((measurement, measurementIndex) => (
                    <div key={measurementIndex}>
                      <label htmlFor={measurement}>{measurement}</label>
                      <input
                        type='text'
                        id={measurement}
                        name='measurementValue'
                        // value={sizeMeasurements.measurements[measurementIndex]?.measurementValue || ''}
                        onChange={(e) => handleMeasurementChange(e, sizeIndex, measurementIndex)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Thumbnail updateProductMedia={updateProductMedia} />

        <Tags updateTags={updateTags} />

        <button type='submit'>SUBMIT</button>
      </form>
    </Layout>
  );
};
