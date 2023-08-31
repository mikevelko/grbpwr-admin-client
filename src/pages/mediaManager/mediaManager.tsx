import { FC, useState } from "react";
import UploadedMedia from "./upload";
import styles from 'styles/media-manager.scss';
import { ROUTES } from "constants/routes";
import { useNavigate } from "@tanstack/react-location";
import logo from '../img/tex-text.png';

const MediaManager: FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate({to: ROUTES.login, replace: true})
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setSelectedFiles(Array.from(files));
        }
    };

    const handleUpload = () => {
        setUploadedFiles([...uploadedFiles, ...selectedFiles]);
        setSelectedFiles([]);
    };

    return (
        <div className={styles.media_wrapper}>
            <div className={styles.logo}>
                <img src={logo} alt="LOGO" style={{width: "40px", height: "40px"}} />
            </div>

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

            {/* Link in future */}
            <div className={styles.view_all}>
                <h3 className={styles.view_all_btn}>VIEW ALL</h3>
            </div>
            <div className={styles.loggout}>
                <button onClick={handleLogout} className={styles.loggout_btn}>LOG OUT</button>
            </div>
            
            {/* <UploadedMedia files={uploadedFiles} /> */}
        </div>
    );
};


export default MediaManager;
