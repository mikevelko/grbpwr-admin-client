import React, { FC, useState, useRef, useEffect,} from "react";
import update from 'immutability-helper';
import { Layout } from "components/layout";
import { common_Product} from "api/proto-http/admin";
import { addProduct } from "api";
import { ChromePicker } from 'react-color'
import styles from 'styles/addProd.scss'
import { Thumbnail } from "./productManagerComponents/thumbnail";



const LOCAL_STORAGE_KEY = "categoryInput";

 export const initialProductState: common_Product = {
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
  const [product, setProduct] = useState<common_Product>({...initialProductState, productMedia: []});

  // Category
  const [categoryInput, setCategoryInput] = useState<string>('');
  const [savedCategories, setSavedCategories] = useState<string[]>([]); 
  const [isInputFocused, setInputFocused] = useState(false);
  const [isUlVisible, setUlVisible] = useState(false);
  const [color, setColor] = useState('#000000');

  // Color HEX
  const [showHex, setShowHex] = useState(false);
  const [category, setCategory] = useState('');
  const colorPickerRef = useRef<any>(null);



  const deleteCategories = (index: number) => {
    const copyCategories = [...savedCategories];
    copyCategories.splice(index, 1);
    setSavedCategories(copyCategories);
  }


  useEffect(() => {
    // Load data from local storage when the component mounts
    const storedCategoryInput = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedCategoryInput) {
      setCategoryInput(storedCategoryInput);
    }

    // Load saved categories from local storage
    const savedCategoriesJson = localStorage.getItem("savedCategories");
    if (savedCategoriesJson) {
      setSavedCategories(JSON.parse(savedCategoriesJson));
    }
  }, []);

  
  const handleCategorySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };
  

  const handleColorHexClick = () => {
    // Toggle the visibility of the color picker
    setShowHex(!showHex);
  };
  
  const onColorPickerInfoChange = (color: any) => {
    setColor(color.hex);
  }

  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setCategoryInput(inputValue);

    // Save the input value to local storage
    localStorage.setItem(LOCAL_STORAGE_KEY, inputValue);
  };

  const addCategory = () => {
    if (categoryInput.trim() !== '') {
      setProduct((prevProduct: common_Product) => {
        return update(prevProduct, {
          categories: { $push: [categoryInput] }
        });
      });

      // Clear the input field
      // setCategoryInput('');

      if (!savedCategories.includes(categoryInput)) {
        // Save the updated categories to local storage
        localStorage.setItem(LOCAL_STORAGE_KEY, '');

        // Save the updated categories array
        setSavedCategories((prevSavedCategories) => {
          const updatedCategories = [...prevSavedCategories, categoryInput];
          localStorage.setItem("savedCategories", JSON.stringify(updatedCategories));
          return updatedCategories;
        });
      }
      setUlVisible(false);
    }
  }

  const selectCategory = (selectedCategory: string) => {
    setCategoryInput(selectedCategory);
    // setUlVisible(!isUlVisible);
  }
  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const [subName, subFieldName] = name.split('.');
  
    if (subName && subFieldName) {
      // Handle price properties as strings
      if (subName === 'price') {
        setProduct((prevProduct: common_Product) => {
          return update(prevProduct, {
            [subName]: {
              [subFieldName]: { $set: value }
            }
          });
        });
      } else {
        // Handle availableSizes properties as numbers
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
      // Convert the categoryText to an array before submitting
      const response = await addProduct(product);
      // Handle the response
      console.log('Product added:', response);
      // Reset the form state
      setCategoryInput('');
      setProduct(initialProductState);
    } catch (error) {
      setCategoryInput('');
      setProduct(initialProductState);
      // Handle errors
      console.error('Error adding product:', error);
    }
  };

  const updateProductMedia = (updatedMedia: any) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      productMedia: updatedMedia,
    }));
  };


  return (
    <Layout>
      <form onSubmit={handleSubmit} className={styles.form}>

        <div className={styles.product_container}>
        <label htmlFor="name" className={styles.title}>NAME</label>
        <input type="text" name="name" value={product.name} onChange={handleChange} id="name" className={styles.product_input}/>
        </div>

        <div className={styles.product_container}>
        <label htmlFor="preorder" className={styles.title}>PREORDER</label>
        <input type="text" name="preorder" value={product.preorder} onChange={handleChange} id="preorder" className={styles.product_input}/>
        </div>


        <div className={styles.product_container}>
        <label htmlFor="descrip" className={styles.title}>DESCRIPTION</label>
        <textarea name="description" id="descrip" value={product.description} cols={30} rows={10} onChange={handleChange}></textarea>
        </div>

        <div className={styles.product_container}>
        <label htmlFor="" className={styles.title}>Vendor Code</label>
        <input type="text" name="vendor_code" id="vendor_code" className={styles.product_input}/>
        </div>

        <div className={styles.product_container}>
        <label htmlFor="color" className={styles.title}>Color</label>
        <input type="text" name="color" id="color" className={styles.product_input}/>
        </div>


        <div className={styles.product_container}>
          <label htmlFor="color_hex" className={styles.title}>Color Hex</label>
          <input type="text" name="color_hex" value={color} id="color_hex" onClick={handleColorHexClick} className={styles.product_input}/>
          <div ref={colorPickerRef} className={styles.color}>
            {showHex && ( 
            <ChromePicker
                className={styles.color_picker}
                color={ color }
                onChangeComplete={ onColorPickerInfoChange }
                disableAlpha={true}
            />
          )}
          </div>
        </div>

        <div className={styles.product_container}>
          <label htmlFor="category" className={styles.title}>Category Drop Down</label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={handleCategorySelectChange}
            className={styles.product_input}
          >
            <option value="">Select a category</option>
            <option value="t-shirt">T-Shirt</option>
            <option value="jeans">Jeans</option>
            <option value="dress">Dress</option>
          </select>
        </div>

        <Thumbnail updateProductMedia={updateProductMedia}/>

        {/* <div className={styles.product_container}>
          <h3 className={styles.title}>Price</h3> 
          <label htmlFor="usd">USD:</label>
          <input type="number" name="price.usd" value={product.price?.usd}  onChange={handleChange} id="usd" />
        </div> */}
        
        <div className={styles.product_container}>
          <h3 className={styles.title}>AVAILABLE SIZES</h3>
          {Object.entries(product.availableSizes as Record<string, number | undefined>).map(([size, value]) => (
              <div key={size}>
                <label htmlFor={size}>{size.toUpperCase()}:</label>
                  <input
                    type="number"
                    name={`availableSizes.${size}`}
                    value={value ?? 0} // Use 0 as the default value when value is undefined
                    onChange={handleChange}
                    id={size}
                    className={styles.product_input}
                  />
                  {value && value > 0 ? (
                  <>
                    <select className={styles.product_input}>
                      <option value="waist">waist</option>
                      <option value="height">height</option>
                    </select>
                    <input type="text" className={styles.product_input}/>
                    <button type="button">ok</button>
                  </>
                  ) : null}
              </div>
          ))}
         </div>


        <div className={`${styles.product_container} ${styles.product_container_tags}`}>  
          <h3 className={styles.title}>TAG</h3>
          <div className={styles.tag_container}>
            <input className={styles.product_input} type="text" name="categoryInput" value={categoryInput} onChange={handleCategoryChange} onFocus={() => {setInputFocused(true); setUlVisible(true)}} placeholder="Enter a category"/>
            <button type="button" onClick={addCategory}>OK</button>
          </div>
          {isInputFocused && isUlVisible &&(
            <ul className={styles.tags_board}>
              {savedCategories.map((category, index) => (
                <li key={index} onClick={() => selectCategory(category)} className={styles.tag}>
                  <button type="button" onClick={() => deleteCategories(index)} className={styles.delete_tag}>X</button>
                  {category}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit">SUBMIT</button>

      </form>
    </Layout>
  );
};
