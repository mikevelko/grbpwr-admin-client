import { FC } from "react";

interface UploadedMediaProps {
    files: File[];
}

const UploadedMedia: FC<UploadedMediaProps> = ({ files }) => {
    return (
        <div>
            <h4>Uploaded Media</h4>
            <ul>
                {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                ))}
            </ul>
            <div>
                {files.map((file, index) => (
                    <img key={index} src={URL.createObjectURL(file)} alt={`Uploaded ${file.name}`} />
                ))}
            </div>
        </div>
    );
};

export default UploadedMedia;
