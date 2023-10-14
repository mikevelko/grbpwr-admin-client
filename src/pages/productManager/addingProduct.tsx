import React, { FC, useState, useRef, useEffect } from "react";
import update from 'immutability-helper';
import { Layout } from "components/layout";
import { common_Media, common_Product} from "api/proto-http/admin";
import { addProduct, getAllUploadedFiles, deleteFiles } from "api";
import { ChromePicker } from 'react-color'
import styles from 'styles/addProd.scss'
import { ROUTES } from "constants/routes";
import { useNavigate } from "@tanstack/react-location";



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
  const [color, setColor] = useState('#000000');
  const [showHex, setShowHex] = useState(false);
  const [category, setCategory] = useState('');

  


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
    setCategoryInput(e.target.value);
  }

  const addCategory = () => {
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

        <label htmlFor="">Vendor Code</label>
        <input type="text" name="vendor_code" id="vendor_code"/>

        <label htmlFor="color">Color</label>
        <input type="text" name="color" id="color" />

        <label htmlFor="color_hex">Color Hex</label>
        <input type="text" name="color_hex" value={color} id="color_hex" onClick={handleColorHexClick}/>
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

          <label htmlFor="thhumbnail">Thumbnail</label>
          <div className={styles.thumbnail_container}>
            <button type="button" onClick={handleThumbnail}>By Url</button>
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
            <button type="button" onClick={handleViewAll}>Media Selector</button>
            {showMediaSelector && (
              <>
              <ul>
                {filterUploadedFiles(filesUrl).map((url, index) => (
                  <li key={index}>
                      <button type="button" onClick={() => handleDeleteFile(index)}>X</button>
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
                        // className={styles.uploaded_img} 
                        style={{ width: '100px', height: '100px' }} />
                    </label>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={handleImage}>add</button>
              </>
              )}
            <button onClick={handleMediaManager}>Upload New</button>
          </div>


        <label htmlFor="category">Category Drop Down</label>
        <select
          name="category"
          id="category"
          value={category}
          onChange={handleCategorySelectChange}
        >
          <option value="">Select a category</option>
          <option value="t-shirt">T-Shirt</option>
          <option value="jeans">Jeans</option>
          <option value="dress">Dress</option>
        </select>



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
          {Object.entries(product.availableSizes as Record<string, number | undefined>).map(([size, value]) => (
              <div key={size}>
                <label htmlFor={size}>{size.toUpperCase()}:</label>
                  <input
                    type="number"
                    name={`availableSizes.${size}`}
                    value={value ?? 0} // Use 0 as the default value when value is undefined
                    onChange={handleChange}
                    id={size}
                  />
                  {value && value > 0 ? (
                      <select name={`${size}Type`} id={`${size}Type`}>
                        <option value="waist">waist</option>
                        <option value="height">height</option>
                      </select>
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

        <div className={styles.container}>
            <h3>Categories:</h3>
            <div>
              <input type="text" name="categoryInput" value={categoryInput} onChange={handleCategoryChange} placeholder="Enter a category"/>
              <button type="button" onClick={addCategory}>OK</button>
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