import React, { FC, FormEvent, useState } from "react";
import update from 'immutability-helper';
import { useNavigate } from "@tanstack/react-location";
import { ROUTES } from "constants/routes";
import { Layout } from "components/layout";
import { common_Media, common_Product} from "api/proto-http/admin";
import { addProduct } from "api";
// import { v4 as uuidv4 } from "uuid";
import styles from 'styles/addProd.scss'


const initialProductState: common_Product = {
    name: '',
    preorder: '',
    description: '',
    price: {
        usd: 0,
        eur: 0,
        usdc: 0,
        eth: 0,
        sale: 0,
    },
    availableSizes: {
        xxs: 0,
        xs: 0,
        s: 0,
        m: 0,
        l: 0,
        xl: 0,
        xxl: 0,
        os: 0,
    },
    categories: [],
    productMedia: [],
    id: undefined,
    created: undefined
};

export const AddProducts: FC = () => {
  
  const[product, setProduct] = useState<common_Product>(initialProductState);
  const[imageUrl, setImageUrl] = useState<string>('');
  const [categoryInput, setCategoryInput] = useState<string>(''); // Step 1

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Step 2
    setCategoryInput(e.target.value);
}

const addCategory = () => {
    // Step 3
    if (categoryInput.trim() !== '') {
        setProduct((prevProduct: common_Product) => {
            return update(prevProduct, {
                categories: { $push: [categoryInput] }
            });
        });
        setCategoryInput(''); 
    }
}
  
  

  const handleImage = () => {
    if (imageUrl.trim() !== '') {

      const compressedUrl = imageUrl.replace(/-og\.jpg$/, '-compressed.jpg');


      setProduct((prevProduct: common_Product) => {
        const updatedMedia: common_Media[] = [...(prevProduct.productMedia || [])];

        updatedMedia.push({
          success: undefined,
          error: function (arg0: string, error: any): unknown {
            throw new Error("Function not implemented.");
          },
          fullSize: imageUrl,
          thumbnail: imageUrl,
          compressed: compressedUrl,
          objectIds: [imageUrl, compressedUrl]
        })
        return {
          ...prevProduct,
          productMedia: updatedMedia
        }
      })

      setImageUrl('');
    }
  }

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const [subName, subFieldName] = name.split('.');
  
    if (subName && subFieldName) {
      if (subName === 'price') {
        setProduct((prevProduct: common_Product) => {
          return update(prevProduct, {
            [subName]: {
              [subFieldName]: { $set: value }
            }
          });
        });
      } else {
        setProduct((prevProduct: common_Product) => {
          return update(prevProduct, {
            [subName]: {
              [subFieldName]: { $set: parseFloat(value) }
            }
          });
        });
      }
    } else {
      setProduct((prevProduct: common_Product) => {
        // Handle other properties as strings
        return update(prevProduct, {
          [name]: { $set: value },
        });
      });
    }
  }
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      const response = await addProduct(product);
      // Handle the response
      console.log('Product added:', response);
      // Reset the form state
      setProduct(initialProductState);
    } catch (error) {
      setProduct(initialProductState)
      // Handle errors
      console.error('Error adding product:', error);
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit} className={styles.form}>

        <label htmlFor="name">NAME:</label>
        <input type="text" name="name" value={product.name} onChange={handleChange} id="name" />

        <label htmlFor="preorder">PREORDER:</label>
        <input type="text" name="preorder" value={product.preorder} onChange={handleChange} id="preorder" />

        <label htmlFor="descrip">DESCRIPTION:</label>
        <input type="text" name="description" value={product.description} onChange={handleChange} id="descrip" />

        <div className={styles.container}>
          <h3>Price:</h3> 
          <label htmlFor="usd">USD:</label>
          <input type="number" name="price.usd" value={product.price?.usd}  onChange={handleChange} id="usd" />
          <label htmlFor="eur">EUR:</label>
          <input type="number" name="price.eur" value={product.price?.eur}  onChange={handleChange} id="eur" />
          <label htmlFor="usdc">USDC:</label>
          <input type="number" name="price.usdc" value={product.price?.usdc}  onChange={handleChange} id="usdc" />
          <label htmlFor="sale">SALE:</label>
          <input type="number" name="price.sale" value={product.price?.sale}  onChange={handleChange} id="sale" />
          <label htmlFor="eth">ETH:</label>
          <input type="number" name="price.eth" value={product.price?.eth}  onChange={handleChange} id="eth" />
        </div>

        

        <div className={styles.container}>
          <h3>AVAILABLE SIZES:</h3>
          <label htmlFor="xxs">XXS:</label>
          <input type="number" name="availableSizes.xxs" value={product.availableSizes?.xxs} onChange={handleChange} id="xxs" />
          <label htmlFor="xs">XS:</label>
          <input type="number" name="availableSizes.xs" value={product.availableSizes?.xs} onChange={handleChange} id="xs" />
          <label htmlFor="s">s:</label>
          <input type="number" name="availableSizes.s" value={product.availableSizes?.s} onChange={handleChange} id="s" />
          <label htmlFor="m">M:</label>
          <input type="number" name="availableSizes.m" value={product.availableSizes?.m} onChange={handleChange} id="m" />
          <label htmlFor="l">L:</label>
          <input type="number" name="availableSizes.l" value={product.availableSizes?.l} onChange={handleChange} id="l" />
          <label htmlFor="xl">XL:</label>
          <input type="number" name="availableSizes.xl" value={product.availableSizes?.xl} onChange={handleChange} id="xl" />
          <label htmlFor="xxl">XXL:</label>
          <input type="number" name="availableSizes.xxl" value={product.availableSizes?.xxl} onChange={handleChange} id="xxl" />
          <label htmlFor="os">OS:</label>
          <input type="number" name="availableSizes.os" value={product.availableSizes?.os} onChange={handleChange} id="os" />
        </div>

        <div className={styles.media_container}>
          <label htmlFor="media">MEDIA:</label>
          <input type="text" name="productMedia" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          <button type="button" onClick={handleImage}>OK</button>
        </div>

        <div className={styles.container}>
                    <h3>Categories:</h3>
                    <div>
                        <input
                            type="text"
                            name="categoryInput"
                            value={categoryInput}
                            onChange={handleCategoryChange}
                            placeholder="Enter a category"
                        />
                        <button type="button" onClick={addCategory}>Add</button>
                    </div>
                    <ul>
                        {product.categories?.map((category, index) => (
                            <li key={index}>{category}</li>
                        ))}
                    </ul>
                </div>

        

        <button type="submit">SUBMIT</button>

      </form>
    </Layout>
  );
};


