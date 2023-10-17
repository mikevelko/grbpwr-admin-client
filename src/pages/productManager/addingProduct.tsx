import React, { FC, useState, useRef, useEffect } from "react";
import update from 'immutability-helper';
import { Layout } from "components/layout";
import { common_Media, common_Product} from "api/proto-http/admin";
import { addProduct, getAllUploadedFiles, deleteFiles } from "api";
import { ChromePicker } from 'react-color'
import styles from 'styles/addProd.scss'
import { ROUTES } from "constants/routes";
import { useNavigate } from "@tanstack/react-location";

const LOCAL_STORAGE_KEY = "categoryInput";

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
  const colorPickerRef = useRef<any>(null);
  const navigate = useNavigate();
  const [product, setProduct] = useState<common_Product>(initialProductState);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string[]>([]);
  const [displayedImage, setDisplayedImage] = useState<string>(''); // display img when btn 'OK' clicked in by url
  const [thumbnailInput, setThumbnailInput] = useState(false);
  const [filesUrl, setFilesUrl] = useState<string[]>([]);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [categoryInput, setCategoryInput] = useState<string>('');
  const [savedCategories, setSavedCategories] = useState<string[]>([]); 
  const [isInputFocused, setInputFocused] = useState(false);
  const [isUlVisible, setUlVisible] = useState(false);
  const [color, setColor] = useState('#000000');
  const [showHex, setShowHex] = useState(false);
  const [category, setCategory] = useState('');

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

  
  
  const SELECT = (imageUrl: string) => {
    if (selectedImage.includes(imageUrl)) {
      setSelectedImage((prevSelectedImage) => (
        prevSelectedImage.filter((image) => image !== imageUrl)
      ));
    } else {
      setSelectedImage([...selectedImage,imageUrl]);
    }
  }

  function generateStringArray(input: string): string[] {
    // Define a regular expression pattern to match the relevant part of the URL
    const pattern = /https:\/\/files\.grbpwr\.com\/(.+?)(-og\.(jpg|mp4|webm))?$/;
    
    // Use the regular expression to extract the matched parts of the URL
    const match = input.match(pattern);
    
    if (!match) {
      // Return an empty array if the input doesn't match the expected pattern
      return [];
    }
    
    const [, path, , extension] = match; // Note the additional comma to skip the second capturing group
    const resultArray: string[] = [`${path}-og.${extension}`];
    
    if (extension === 'jpg') {
      // If the extension is 'jpg', add the '-compressed.jpg' version to the array
      resultArray.push(`${path}-compressed.jpg`);
    }
    console.log(resultArray)
    return resultArray;
  }

  const handleDeleteFile = async (fileIndex: number) => {
    try {
      const fileToDelete = filesUrl[fileIndex]; // Assuming filesUrl is an array of file URLs
      const objectKeys = generateStringArray(fileToDelete);

      if (objectKeys.length > 0) {
        await deleteFiles(objectKeys);
        const updatedFiles = [...filesUrl];
        updatedFiles.splice(fileIndex, 1);
        setFilesUrl(updatedFiles);
      } else {
        console.error('Invalid file URL:', fileToDelete);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };
  

  const filterUploadedFiles = (files: string[]) => {
    return files.filter((file) => /\.(jpg|jpeg|png)$/i.test(file))
  }

  const handleViewAll = () => {
    setShowMediaSelector(!showMediaSelector)
  }


  useEffect(() => {
    const fetchUploadedFiles = async () => {
      try {
        const response = await getAllUploadedFiles();
        const filesArray = response.entities || [];
        const urls = filesArray.map((file: { url: any; }) => file.url)
        
       setFilesUrl(urls);

      } catch (error) {
        console.error("Error fetching uploaded files:", error);
      }
    };

    fetchUploadedFiles();
  }, []);

  const handleThumbnail = () => {
    setThumbnailInput(!thumbnailInput);
  }

  const handleMediaManager = () => {
    navigate({to: ROUTES.media, replace: true});
  }

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
  
  

  const handleImage = () => {
    if (selectedImage.length > 0) {
      const updatedMedia: common_Media[] = [...(product.productMedia || [])];
  
      selectedImage.forEach((imageUrl) => {
        const compressedUrl = imageUrl.replace(/-og\.jpg$/, '-compressed.jpg');
  
        updatedMedia.push({
          success: undefined,
          error: function (arg0: string, error: any): unknown {
            throw new Error("Function not implemented.");
          },
          fullSize: imageUrl,
          thumbnail: imageUrl,
          compressed: compressedUrl,
          objectIds: [imageUrl]
        });
      });
  
      setProduct((prevProduct: common_Product) => ({
        ...prevProduct,
        productMedia: updatedMedia
      }));
  
      setSelectedImage([]); // Clear the selected images after adding them
    } else if (imageUrl.trim() !== '') {
      // If no selected images, use the single URL input
      setDisplayedImage(imageUrl);
      const compressedUrl = imageUrl.replace(/-og\.jpg$/, '-compressed.jpg');
  
      setProduct((prevProduct: common_Product) => {
        const updatedMedia: common_Media[] = [...(prevProduct.productMedia || [])];
  
        updatedMedia.push({
          success: undefined,
          error: function (arg0: string, error: any): unknown {
            throw Error("Function not implemented.");
          },
          fullSize: imageUrl,
          thumbnail: imageUrl,
          compressed: compressedUrl,
          objectIds: [imageUrl]
        });
  
        return {
          ...prevProduct,
          productMedia: updatedMedia
        };
      });
  
      setImageUrl('');
    }
  };
  

  
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
      setProduct(initialProductState)
      // Handle errors
      console.error('Error adding product:', error);
    }
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
        {/* <input type="text" name="description" value={product.description} onChange={handleChange} id="descrip" className={`${styles.product_input} ${styles.description_input}`}/> */}
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
          <label htmlFor="thhumbnail" className={`${styles.title} ${showMediaSelector ? styles.left : ''}`}>Thumbnail</label>
          <div className={`${styles.thumbnail_container} ${showMediaSelector ? styles.left : ''}`}>
              <button className={styles.thumbnail_btn} type="button" onClick={handleThumbnail}>By Url</button>
              {thumbnailInput && (
                <div>
                  <input type="text" name="productMedia" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                  <button type="button" onClick={handleImage}>OK</button>
                </div>
              )}
              {displayedImage && (
                <div>
                  <img src={displayedImage} alt="lll" style={{width: '40px', height: '40px'}} />
                </div>
              )}
              <button className={styles.thumbnail_btn} type="button" onClick={handleViewAll}>Media Selector</button>
              <button className={styles.thumbnail_btn} onClick={handleMediaManager}>Upload New</button>
          </div>
          {showMediaSelector && (
                  <div className={styles.uploaded_media_container}>
                    <ul className={styles.uploaded_media}>
                      {filterUploadedFiles(filesUrl).map((url, index) => (
                        <li key={index}>
                            <button className={styles.delete_img} type="button" onClick={() => handleDeleteFile(index)}>X</button>
                            <input
                            type="checkbox"
                            checked={selectedImage.includes(url)}
                            onChange={() => SELECT(url)}
                            id={`${index}`}
                            style={{display: 'none'}}
                          />
                          <label htmlFor={`${index}`} className={styles.media_selector_img_wrapper}>
                            <img
                              key={index}
                              src={url}
                              alt={url}
                              className={styles.uploaded_img} 
                            />
                          </label>
                        </li>
                      ))}
                    </ul>
                    <div className={styles.media_selector_add}>
                      <button className={styles.add_btn} type="button" onClick={handleImage}>add</button>
                    </div>
                  </div>
                  )}
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

        {/* <div className={styles.product_container}>
          <h3 className={styles.title}>Price</h3> 
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


        {/* <label htmlFor="media">MEDIA:</label>
        <div className={styles.thumbnail_container}>
          <button type="button" onClick={handleThumbnail}>By Url</button>
          {thumbnailInput && (
            <div>
              <input type="text" name="productMedia" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <button type="button" onClick={handleImage}>OK</button>
            </div>
          )}
          <button type="button" onClick={handleViewAll}>Media Selector</button>
          {showMediaSelector && (
            <div>
              {filterUploadedFiles(filesUrl).map((url, index) => (
                <img 
                  key={index}
                  src={url} 
                  alt={url} 
                  title={`Image ${index}`} 
                  className={styles.uploaded_img} 
                />
              ))}
            </div>
          )}
          <button onClick={handleMediaManager}>Upload New</button>
        </div> */}
        <div className={styles.product_container}>  
          <h3 className={styles.title}>Categories</h3>
          <div>
            <input className={styles.product_input} type="text" name="categoryInput" value={categoryInput} onChange={handleCategoryChange} onFocus={() => {setInputFocused(true); setUlVisible(true)}} placeholder="Enter a category"/>
            <button type="button" onClick={addCategory}>OK</button>
          </div>
          <ul>
          {isInputFocused && isUlVisible &&(
            <ul>
              {savedCategories.map((category, index) => (
                <li key={index} onClick={() => selectCategory(category)}>
                  <button type="button" onClick={() => deleteCategories(index)}>X</button>
                  {category}
                </li>
              ))}
            </ul>
          )}
          </ul>
        </div>

        <button type="submit">SUBMIT</button>

      </form>
    </Layout>
  );
};