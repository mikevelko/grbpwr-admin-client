import { getAllUploadedFiles, deleteFiles} from 'api';
import { Layout } from 'components/layout';
import React, { FC, useEffect, useState } from 'react';
import styles from 'styles/upload.scss';

interface UploadedFile {
  url: string;
  lastModified: string;
}

function copyToClipboard(text: string) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}


export const UploadPage: FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [order, setOrder] = useState<'plus' | 'minus'>('plus');
  const [filter, setFilter] = useState<string | null>(null);

  const handlePictures = () => {
    setFilter("PICTURES");
  }

  const handleVideo = () => {
    setFilter("VIDEO");
  }


  // DATE 
  function formatDate(dateString: string | number | Date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options as Intl.DateTimeFormatOptions);
  }

  const sortByDate = () => {
    const sortedFiles = [...uploadedFiles];
    sortedFiles.sort((a, b) => {
      const dateA = new Date(a.lastModified).getTime();
      const dateB = new Date(b.lastModified).getTime();
      if (order === 'plus') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
    setUploadedFiles(sortedFiles);
  }

  const dateSorter = () => {
    setOrder(order === 'plus' ? 'minus' : 'plus');
    sortByDate(); // Sort when the order changes
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
  

// DELETE FUNCTION

const handleDeleteFile = async (fileIndex: number) => {

  try {
    const fileToDelete = uploadedFiles[fileIndex];
    const url = fileToDelete.url;
    
    const objectKeys = generateStringArray(url);

    // Check if objectKeys is not empty (i.e., the URL matched the pattern)
    if (objectKeys.length > 0) {
      await deleteFiles(objectKeys);
      const updatedFiles = [...uploadedFiles];
      updatedFiles.splice(fileIndex, 1);
      setUploadedFiles(updatedFiles);
    } else {
      console.error('Invalid file URL:', url);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

// ....
  useEffect(() => {
    const fetchUploadedFiles = async () => {
      try {
        const response = await getAllUploadedFiles();
        const filesArray = response.entities || [];
        
        // Set uploaded files without sorting when initially fetched
        setUploadedFiles(filesArray);

      } catch (error) {
        console.error("Error fetching uploaded files:", error);
      }
    };

    fetchUploadedFiles();
  }, []);

  return (
    <Layout>
      <h1 className={styles.media_name}>MEDIA MANAAGER</h1>
      <div className={styles.files_container}>
      <div className={styles.sorter_container}>
          <p className={styles.sort_btn_title}>SORT</p>
          <button onClick={dateSorter} className={styles.sort_btn}>
            DATE {order === 'plus' ? '+' : '-'}
          </button>
          <button onClick={handlePictures}  className={styles.sort_btn} >PICTURES</button>
          <button onClick={handleVideo} className={styles.sort_btn}>VIDEOS</button>
      </div>
        <ul className={styles.uploaded_files}>
          {uploadedFiles.filter((file) => {
            if (filter === "PICTURES") {
              return (
                file.url.toLowerCase().endsWith('.jpg') ||
                file.url.toLowerCase().endsWith('.jpeg') ||
                file.url.toLowerCase().endsWith('.png')
              );
            } else if (filter === "VIDEO") {
              return (
                file.url.toLowerCase().endsWith('.mp4') ||
                file.url.toLowerCase().endsWith('.webm')
              );
            } else {
              return true;
            }
          }).map((file, index) => (
            <li key={index} className={styles.uploaded_file}>
              <button onClick={() => handleDeleteFile(index)} className={styles.delete_btn}>X</button>
              <div className={styles.date}>{formatDate(file.lastModified)}</div>
              <div className={styles.url_container}>
                <div className={styles.urlText}>{file.url}</div>
                <button onClick={() => copyToClipboard(file.url)} className={styles.copy_btn}>Copy Link</button>
              </div>
              {file.url.toLowerCase().endsWith('.jpg') || file.url.toLowerCase().endsWith('.jpeg') || file.url.toLowerCase().endsWith('.png') ? (
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={file.url} 
                    alt={file.url.replace("-og.jpg", "-compressed.jpg")} 
                    title={`${file.lastModified}`} 
                    className={`${styles.uploaded_img}`} />
                </a>
              ) : file.url.toLowerCase().endsWith('.mp4') || file.url.toLowerCase().endsWith('.webm') ? (
                <a href={file.url} target='_blank' rel='noopener noreferrer'>
                  <video className={styles.video}>
                    <source src={file.url} type="video/mp4"  />
                    {/* Your browser does not support the video tag. */}
                  </video>
                </a>
              ) : (
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.lastModified}
                </a>
              )}
            </li>
          ))}
        </ul>
        </div>
    </Layout>
  );
};


{/* <button onClick={() => handleDeleteFile(index)} className={styles.delete_btn}>X</button> */}

