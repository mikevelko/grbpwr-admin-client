import React, { FC, FormEvent, useEffect, useState } from 'react';
import { addHero } from 'api/hero';
import { getAllUploadedFiles } from 'api/admin';
import { common_HeroInsert, common_Media } from 'api/proto-http/admin';
import { Layout } from 'components/login/layout';

const determineContentType = (link: string) => {
  const extension = link.split('.').pop()?.toLowerCase() ?? '';
  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
    return 'image';
  } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
    return 'video';
  }
  return '';
};

export const Hero: FC = () => {
  const [selectedImage, setSelectedImage] = useState<string[]>([]);
  const [thumbnailInput, setThumbnailInput] = useState(false);
  const [filesUrl, setFilesUrl] = useState<string[]>([]);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [mediaNumber, setMediaNumber] = useState<number[]>([]);
  const [exploreTextMap, setExploreTextMap] = useState<Record<string, string>>({});

  const [main, setMain] = useState<common_HeroInsert>({
    contentLink: '',
    contentType: '',
    exploreLink: '',
    exploreText: '',
  });

  const [ads, setAds] = useState<common_HeroInsert[]>([]);

  const handleAddToAds = () => {
    // Create a new ad object with the selected images
    const newAds = selectedImage.map((imageUrl, index) => ({
      contentLink: imageUrl,
      contentType: determineContentType(imageUrl),
      exploreLink: '',
      exploreText: exploreTextMap[imageUrl],
    }));

    // Add the new ad object to the ads array
    setAds((prevAds) => [...prevAds, ...newAds]);

    // Clear the selected images
    setSelectedImage([]);
    setExploreTextMap({});
  };

  const handleExploreTextChange = (url: string, value: string) => {
    setExploreTextMap((prevExploreTextMap) => ({
      ...prevExploreTextMap,
      [url]: value,
    }));
  };

  const addNewHero = async () => {
    try {
      const response = await addHero({ main, ads, productIds: [] });
      console.log('hero added:', response);
    } catch (error) {
      console.error(error);
    }
  };

  const select = (imageUrl: string | number) => {
    if (typeof imageUrl === 'string') {
      if (selectedImage.includes(imageUrl)) {
        setSelectedImage((prevSelectedImage) =>
          prevSelectedImage.filter((image) => image !== imageUrl),
        );
      } else {
        setSelectedImage([...selectedImage, imageUrl]);
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

        const filesArray = response.list || [];
        const urls = filesArray.map((file: common_Media) => file.media?.fullSize || '');

        setFilesUrl(urls);
      } catch (error) {
        console.error('Error fetching uploaded files:', error);
      }
    };

    fetchUploadedFiles();
  }, []);

  const handleThumbnail = () => {
    setThumbnailInput(!thumbnailInput);
  };

  return (
    <div>
      <label htmlFor='thhumbnail'>Media</label>
      <div>
        <button type='button' onClick={handleViewAll}>
          Media Selector
        </button>
      </div>
      {showMediaSelector && (
        <div>
          <ul>
            {filesUrl.map((url, index) => (
              <li key={index}>
                <input
                  type='checkbox'
                  checked={selectedImage.includes(url)}
                  onChange={() => select(url)}
                  id={`${index}`}
                  style={{ display: 'none' }}
                />
                <label htmlFor={`${index}`}>
                  {selectedImage.includes(url) ? (
                    <span>{selectedImage.indexOf(url) + 1}</span>
                  ) : null}
                  <img
                    key={index}
                    src={url}
                    alt={url}
                    style={{ width: '100px', height: '100px' }}
                  />
                  {selectedImage.includes(url) && (
                    <input
                      type='text'
                      placeholder='Explore Text'
                      value={exploreTextMap[url] || ''}
                      onChange={(e) => handleExploreTextChange(url, e.target.value)}
                    />
                  )}
                </label>
              </li>
            ))}
          </ul>
          <div>
            <button type='button' onClick={handleAddToAds}>
              add
            </button>
          </div>
        </div>
      )}
      <button type='button' onClick={addNewHero}>
        ok
      </button>
    </div>
  );
};
