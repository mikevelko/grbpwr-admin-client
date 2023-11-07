import React, {FC, useState, useEffect} from "react";
import { common_ProductNew, common_ProductTagInsert } from "api/proto-http/admin";
import { initialProductState } from "../addingProduct";
import update from 'immutability-helper';
import styles from 'styles/tag.scss';

const LOCAL_STORAGE_KEY = "categoryInput";

interface tagProps {
    updateTag: (updatedTag: common_ProductNew) => void;
}

const newTag: common_ProductTagInsert = {
  tag: '',
}
export const Tags: FC<tagProps> = ({ updateTag }) => {
    const [product, setProduct] = useState<common_ProductNew>({...initialProductState});
    const [categoryInput, setCategoryInput] = useState<string>('');
    const [savedCategories, setSavedCategories] = useState<string[]>([]); 
    const [isInputFocused, setInputFocused] = useState(false);
    const [isUlVisible, setUlVisible] = useState(false);


    const deleteCategories = (index: number) => {
        const copyCategories = [...savedCategories];
        copyCategories.splice(index, 1);
        setSavedCategories(copyCategories);
    }

    useEffect(() => {
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

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setCategoryInput(inputValue);
    
        // Save the input value to local storage
        localStorage.setItem(LOCAL_STORAGE_KEY, inputValue);
    };

    const addCategory = () => {
        if (categoryInput.trim() !== '') {
            setProduct((prevProduct: common_ProductNew) => {
                const updatedProduct = update(prevProduct, {
                  tags: { $push: [{ tag: categoryInput }] }
                });
    
                if (!savedCategories.includes(categoryInput)) {
    
                    const updatedCategories = [...savedCategories, categoryInput];
                    localStorage.setItem("savedCategories", JSON.stringify(updatedCategories));
                    setSavedCategories(updatedCategories);
                }
                
                updateTag(updatedProduct); // Call updateTag after updating the state
                setUlVisible(false);
                setCategoryInput('');
                setProduct(initialProductState);
                return updatedProduct;
            });
        }
    };

    const selectCategory = (selectedCategory: string) => {
        setCategoryInput(selectedCategory);
    }

    
    return (

        <div className={styles.tag_wrapper}>  
          <h3 className={styles.tag_title}>TAG</h3>
          <div className={styles.tag_container}>
            <input className={styles.tag_input} type="text" name="categoryInput" value={categoryInput} onChange={handleCategoryChange} onFocus={() => {setInputFocused(true); setUlVisible(true)}} placeholder="Enter a category"/>
            <button className={styles.tag_container_btn} type="button" onClick={addCategory}>OK</button>
          </div>
          {isInputFocused && isUlVisible &&(
            <ul className={styles.tags_popup}>
              {savedCategories.map((category, index) => (
                <li key={index} onClick={() => selectCategory(category)} className={styles.tag}>
                  <button type="button" onClick={() => deleteCategories(index)} className={styles.tag_delete_btn}>X</button>
                  {category}
                </li>
              ))}
            </ul>
          )}
        </div>
    )
}

