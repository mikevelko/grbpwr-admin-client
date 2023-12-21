import React, { FC, useState, useEffect } from 'react';
import { Layout } from 'components/layout/layout';
import {
  common_GenderEnum,
  common_Genders,
  common_ProductFull,
  common_Size,
} from 'api/proto-http/admin';
import { getProductByID, getDictionary } from 'api/admin';
import { AddMediaByID } from './addMediaById';
import {
  updateName,
  updateSku,
  updatePreorder,
  updateColors,
  updateCountry,
  updateBrand,
  updateGender,
  updateThumbnail,
} from 'api/byID';
import queryString from 'query-string';
import styles from 'styles/productID.scss';
// TODO: ????
interface ProductFields {
  [key: string]: string | common_GenderEnum; // или другой подходящий тип
  newProductName: string;
  newSku: string;
  newPreorder: string;
  newColor: string;
  newColorHEX: string;
  newCountry: string;
  newBrand: string;
  newGender: common_GenderEnum;
  newThumbnail: string;
}

export const ProductId: FC = () => {
  const queryParams = queryString.parse(window.location.search);
  const productId = queryParams.productId as string;
  const [product, setProuct] = useState<common_ProductFull | undefined>(undefined);
  const [sizeDictionary, setSizeDictionary] = useState<common_Size[]>([]);
  const [genders, setGenders] = useState<common_Genders[] | undefined>(undefined);
  const [productFields, setProductFields] = useState<ProductFields>({
    newProductName: '',
    newSku: '',
    newPreorder: '',
    newColor: '',
    newColorHEX: '',
    newCountry: '',
    newBrand: '',
    newGender: '' as common_GenderEnum,
    newThumbnail: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setProductFields((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const updateProduct = async (fieldName: string) => {
    if (!product || !product.product?.id) {
      console.error('id undefined');
      return;
    }
    const value = productFields[fieldName as keyof typeof productFields];
    if (!value) return;

    try {
      switch (fieldName) {
        case 'newProductName':
          await updateName({ productId: product.product.id, name: value });
          break;
        case 'newSku':
          await updateSku({ productId: product.product.id, sku: value });
          break;
        default:
          break;
      }
      updateLocalProductDetails(fieldName, productFields[fieldName]);
    } catch (error) {
      console.error(error);
    }
  };

  const updateLocalProductDetails = (fieldName: string, newValue: string) => {
    setProuct((prevProduct) => {
      if (!prevProduct || !prevProduct.product) {
        return prevProduct;
      }

      const updatedProduct = { ...prevProduct };
      if (fieldName === 'newProductName' && updatedProduct.product?.productInsert) {
        updatedProduct.product.productInsert.name = newValue;
      } else if (fieldName === 'newSku' && updatedProduct.product?.productInsert) {
        updatedProduct.product.productInsert.sku = newValue;
      }

      return updatedProduct;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProductByID({ id: Number(productId) });
        setProuct(response.product);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchData();
  }, [productId]);

  useEffect(() => {
    const fetchSize = async () => {
      try {
        const response = await getDictionary({});
        setSizeDictionary(response.dictionary?.sizes || []);
        setGenders(response.dictionary?.genders || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSize();
  }, []);

  const getSizeName = (sizeId: number | undefined): string => {
    const size = sizeDictionary.find((s) => s.id === sizeId);
    if (size && size.name) {
      return size.name.replace('SIZE_ENUM_', '');
    }
    return 'size not found';
  };

  return (
    <Layout>
      <div className={styles.product_id_full_content}>
        <div className={styles.img_grid}>
          <div className={styles.main_img_container}>
            <img
              src={product?.product?.productInsert?.thumbnail}
              alt='thumbnail'
              className={styles.main_img}
            />
          </div>
          <ul className={styles.product_by_id_media_list}>
            {product?.media?.map((media, index) => (
              <li key={index}>
                <p>{index + 1}</p>
                <img src={media.productMediaInsert?.compressed} alt='' />
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.product_id_information}>
          <h3>{product?.product?.productInsert?.name}</h3>
          <input
            type='text'
            name='newProductName'
            value={productFields.newProductName}
            onChange={handleChange}
          />
          <button onClick={() => updateProduct('newProductName')}>+</button>
          <h3>{product?.product?.productInsert?.sku}</h3>
          <input type='text' name='newSku' value={productFields.newSku} onChange={handleChange} />
          <button onClick={() => updateProduct('newSku')}>+</button>
          <ul>
            {product?.sizes?.map((size, index) => (
              <li key={index}>{getSizeName(size.sizeId)}</li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};
