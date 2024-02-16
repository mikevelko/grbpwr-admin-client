import React, { FC, useState, useEffect } from 'react';
import styles from 'styles/thumbnail.scss';
import { deleteFiles, getAllUploadedFiles } from 'api/admin';
import { common_ProductNew, common_ProductMediaInsert, common_Media } from 'api/proto-http/admin';
import { useNavigate } from '@tanstack/react-location';
import { ROUTES } from 'constants/routes';

interface ThumbnailProps {
  product: common_ProductNew;
  setProduct: React.Dispatch<React.SetStateAction<common_ProductNew>>;
}

export const Thumbnail: FC<ThumbnailProps> = ({ product, setProduct }) => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string[]>([]);
  const [displayedImage, setDisplayedImage] = useState<string>('');
  const [thumbnailInput, setThumbnailInput] = useState(false);
  const [filesUrl, setFilesUrl] = useState<common_Media[] | undefined>([]);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [mediaNumber, setMediaNumber] = useState<number[]>([]);
  const [imagesAdded, setImagesAdded] = useState(false);

  const select = (imageUrl: string | number | undefined) => {
    if (typeof imageUrl === 'string') {
      if (selectedImage?.includes(imageUrl)) {
        setSelectedImage((prevSelectedImage) =>
          prevSelectedImage?.filter((image) => image !== imageUrl),
        );
      } else {
        setSelectedImage([...(selectedImage || []), imageUrl]);
      }
    } else if (typeof imageUrl === 'number') {
      if (mediaNumber.includes(imageUrl)) {
        setMediaNumber((prevMediaNumber) =>
          prevMediaNumber.filter((imageIndex) => imageIndex !== imageUrl),
        );
      } else {
        setMediaNumber([...mediaNumber, imageUrl]);
      }
    }
  };

  const handleDeleteFile = async (id: number | undefined) => {
    try {
      const response = await deleteFiles({ id });
      console.log(response);
      setFilesUrl((currentFiles) => currentFiles?.filter((file) => file.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewAll = () => {
    setShowMediaSelector(!showMediaSelector);
  };

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      try {
        const response = await getAllUploadedFiles({
          limit: 5,
          offset: 0,
          orderFactor: 'ORDER_FACTOR_ASC',
        });

        const url = response.list || [];

        setFilesUrl(url);
      } catch (error) {
        console.error('Error fetching uploaded files:', error);
      }
    };

    fetchUploadedFiles();
  }, []);

  const handleThumbnail = () => {
    setThumbnailInput(!thumbnailInput);
  };

  const handleMediaManager = () => {
    navigate({ to: ROUTES.media, replace: true });
  };

  const handleImage = () => {
    if (selectedImage && selectedImage.length > 0) {
      const updatedMedia: common_ProductMediaInsert[] = [...(product.media || [])];

      selectedImage?.forEach((imageUrl) => {
        const compressedUrl = imageUrl.replace(/-og\.jpg$/, '-compressed.jpg');

        updatedMedia.push({
          fullSize: imageUrl,
          thumbnail: imageUrl,
          compressed: compressedUrl,
        });
      });

      setProduct((prevProduct: common_ProductNew) => ({
        ...prevProduct,
        media: updatedMedia,
      }));

      setSelectedImage([]);
      setShowMediaSelector(false);
      setImagesAdded(true);
    } else if (imageUrl.trim() !== '') {
      setDisplayedImage(imageUrl);
      const compressedUrl = imageUrl.replace(/-og\.jpg$/, '-compressed.jpg');

      setProduct((prevProduct: common_ProductNew) => {
        const updatedMedia: common_ProductMediaInsert[] = [...(prevProduct.media || [])];

        updatedMedia.push({
          fullSize: imageUrl,
          thumbnail: imageUrl,
          compressed: compressedUrl,
        });

        return {
          ...prevProduct,
          media: updatedMedia,
        };
      });

      setImageUrl('');
      setImagesAdded(true);
    }
  };

  const handleDeleteMedia = (index: number) => {
    if (product.media) {
      const updatedMedia = [...product.media];

      updatedMedia.splice(index, 1);

      setProduct((prevProduct: common_ProductNew) => ({
        ...prevProduct,
        media: updatedMedia,
      }));
    }
  };

  return (
    <div className={styles.thumbnail_wrapper}>
      <label
        htmlFor='thhumbnail'
        className={`${styles.thumbnail_title} ${showMediaSelector ? styles.left : ''}`}
      >
        Media
      </label>
      <div className={`${styles.thumbnail_container} ${showMediaSelector ? styles.left : ''}`}>
        <button
          className={`${styles.thumbnail_btn} ${thumbnailInput ? styles.by_url_left : ''}`}
          type='button'
          onClick={handleThumbnail}
        >
          By Url
        </button>
        {thumbnailInput && (
          <div className={styles.by_url_container}>
            <input
              className={styles.by_url_input}
              type='text'
              name='media'
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <button type='button' onClick={handleImage}>
              OK
            </button>
          </div>
        )}
        <button className={styles.thumbnail_btn} type='button' onClick={handleViewAll}>
          Media Selector
        </button>
        <button className={styles.thumbnail_btn} onClick={handleMediaManager}>
          Upload New
        </button>
      </div>
      {showMediaSelector && (
        <div className={styles.thumbnail_uploaded_media_wrapper}>
          <ul className={styles.thhumbnail_uploaded_media_container}>
            {filesUrl?.map((media) => (
              <li key={media.id}>
                <button
                  className={styles.delete_img}
                  type='button'
                  onClick={() => handleDeleteFile(media.id)}
                >
                  X
                </button>
                <input
                  type='checkbox'
                  checked={selectedImage?.includes(media.media?.fullSize ?? '')}
                  onChange={() => select(media.media?.fullSize ?? '')}
                  id={`${media.id}`}
                  style={{ display: 'none' }}
                />
                <label htmlFor={`${media.id}`}>
                  {selectedImage?.includes(media.media?.fullSize ?? '') ? (
                    <span className={styles.media_number}>
                      {selectedImage.indexOf(media.media?.fullSize ?? '') + 1}
                    </span>
                  ) : null}
                  <img
                    key={media.id}
                    src={media.media?.fullSize}
                    alt='video'
                    className={styles.uploaded_img}
                  />
                </label>
              </li>
            ))}
          </ul>
          <div className={styles.media_selector_add}>
            <button className={styles.add_btn} type='button' onClick={handleImage}>
              add
            </button>
          </div>
        </div>
      )}
      {showMediaSelector ? null : (
        <div className={styles.added}>
          {imagesAdded && product.media && product.media.length > 0 && (
            <div className={styles.added_img_wrapper}>
              <ul className={styles.added_img_container}>
                {product.media.map((media, index) => (
                  <li className={styles.added_img} key={index}>
                    <button
                      type='button'
                      className={styles.delete_img}
                      onClick={() => handleDeleteMedia(index)}
                    >
                      X
                    </button>
                    <img src={media.fullSize} alt={`Media ${index}`} className={styles.imgs} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
