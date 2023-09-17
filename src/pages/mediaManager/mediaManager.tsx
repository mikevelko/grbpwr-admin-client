import { FC, useState } from "react";
// import { useHistory } from "react-router-dom";
import styles from 'styles/media-manager.scss';
import { ROUTES } from "constants/routes";
import { useNavigate } from "@tanstack/react-location";
import { uploadImage, getAllUploadedFiles, uploadVideo } from "api";
import { Layout } from "components/layout";



export const MediaManager: FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const navigate = useNavigate();



    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setSelectedFiles(Array.from(files));
        }
    };

    const handleViewAll = async () => {
        try {
          const authToken = localStorage.getItem('authToken');
      
          if (!authToken) {
            console.log('fuck off')
            alert('Authentication token not found');
            return;
          }
      
        //   get all uploaded files 
          const files = await getAllUploadedFiles();

          const queryParams = new URLSearchParams();
          queryParams.append('uploadedFiles', JSON.stringify(files));
          navigate({ to: `${ROUTES.all}?${queryParams.toString()}`, replace: true });
      
          setUploadedFiles(files);
          navigate({ to: ROUTES.all, replace: true })
        } catch (error) {
          console.error("Error fetching uploaded files:", error);
        }
    }
      

    
    const handleUpload = async () => {
        // Check if there are selected files and a name entered
        if (selectedFiles.length === 0) {
            alert("Please select a file to upload.");
            return;
        }
    
        const nameInput = document.getElementById("file_name") as HTMLInputElement;
        const fileName = nameInput.value.trim();
        if (!fileName) {
            alert("Please enter a name for the file.");
            return;
        }
    
        // Read the selected file as Base64 data
        const selectedFile = selectedFiles[0];
        const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase() || "";
    
        if (!fileExtension) {
            alert("Invalid file format.");
            return;
        }
    
        const reader = new FileReader();
        reader.onload = async (event) => {
            if (event.target && event.target.result) {
                const base64Data = event.target.result as string;
    
                try {
                    let contentType = "image"; // Default content type
    
                    // Check the file extension to determine the content type
                    if (["svg", "png", "jpg"].includes(fileExtension)) {
                        contentType = "image";
                    } else if (["webm", "mp4"].includes(fileExtension)) {
                        contentType = "video";
                    }
    
                    if (contentType === "image") {
                        // Call the uploadImage function with the Base64 data, folder, and image name
                        const response = await uploadImage(base64Data, "your-folder-name", fileName);
                        console.log("Image uploaded:", response);
                    } else if (contentType === "video") {
                        // Call the uploadVideo function with the Base64 data, folder, video name, and content type
                        const response = await uploadVideo(base64Data, "your-folder-name", fileName, "video");
                        console.log("Video uploaded:", response);
                    }
    
                    setUploadedFiles([...uploadedFiles, selectedFile]);
                    setSelectedFiles([]);
                } catch (error) {
                    alert(`Error uploading file. Please try again.`);
                }
            }
        };
    
        reader.readAsDataURL(selectedFile);
    };


    return (
        <Layout>
            <div className={styles.media_wrapper}>
            <div className={styles.media_container}>
                <h2 className={styles.media_title}>MEDIA MANAGER</h2>
                <div className={styles.drop_container}>
                    <label htmlFor="files" className={styles.drop_title}>DRAG AND DROP</label>
                    <input type="file" multiple onChange={handleFileChange} id="files" className={styles.files} />
                </div>
                <div className={styles.name_upload}>
                    <div className={styles.name_container} >
                        <label htmlFor="file_name" className={styles.name}>NAME</label>
                        <input type="text" placeholder="TEXT FIELD" id="file_name" className={styles.name_input} />
                    </div>
                    <div className={styles.upload_container}>
                        <button onClick={handleUpload} className={styles.upload_btn}>UPLOAD</button>
                    </div>
                </div>
            </div>
            <div className={styles.view_all}>
                <h3 className={styles.view_all_btn} onClick={handleViewAll}>VIEW ALL</h3>
            </div>
        </div>
        </Layout>
       
    );
};

