import { getAllUploadedFiles } from 'api/admin';
import { addHero } from 'api/hero';
import { common_HeroInsert, common_Media } from 'api/proto-http/admin';
import { Ads } from './pickerComponents/ads';
import React, { FC, useState, useEffect } from 'react';

const determineContentType = (link: string) => {
  const extension = link.split('.').pop()?.toLowerCase() ?? '';
  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
    return 'image';
  } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
    return 'video';
  }
  return '';
};

export const MediaPicker: FC = () => {
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
  const [newAdUrl, setNewAdUrl] = useState('');
  const [newMainUrl, setNewMainUrl] = useState('');

  const handleMainSelect = (url: string) => {
    const newMain = {
      contentLink: url,
      contentType: determineContentType(url),
      exploreLink: '',
      exploreText: exploreTextMap[url] || '',
    };
    setMain(newMain);
  };

  const handleAddByUrl = () => {
    const newAd = {
      contentLink: newAdUrl,
      contentType: determineContentType(newAdUrl),
      exploreLink: '',
      exploreText: '',
    };
    setAds((prevAds) => [...prevAds, newAd]);
    setNewAdUrl('');
    setThumbnailInput(false);
  };

  const handleMainByUrl = () => {
    const newMain = {
      contentLink: newMainUrl,
      contentType: determineContentType(newMainUrl),
      exploreLink: '',
      exploreText: '',
    };
    setMain(newMain);
  };

  const handleAddToAds = () => {
    const newAds = selectedImage.map((imageUrl) => ({
      contentLink: imageUrl,
      contentType: determineContentType(imageUrl),
      exploreLink: '',
      exploreText: exploreTextMap[imageUrl],
    }));

    setAds((prevAds) => [...prevAds, ...newAds]);

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
      <input
        type='text'
        placeholder='by url'
        name='contentLink'
        value={newMainUrl}
        onChange={(e) => setNewMainUrl(e.target.value)}
      />
      <button type='button' onClick={handleMainByUrl}>
        ok
      </button>
      <ul>
        {filesUrl.map((media, index) => (
          <li key={index}>
            <img src={media} alt='' style={{ width: '100px', height: '100px' }} />
            <input
              type='text'
              name='contentLink'
              value={exploreTextMap[media] || ''}
              onChange={(e) => handleExploreTextChange(media, e.target.value)}
            />
          </li>
        ))}
      </ul>
      <Ads
        filesUrl={filesUrl}
        selectedImage={selectedImage}
        handleThumbnail={handleThumbnail}
        thumbnailInput={thumbnailInput}
        newAdUrl={newAdUrl}
        setNewAdUrl={setNewAdUrl}
        handleAddByUrl={handleAddByUrl}
        handleViewAll={handleViewAll}
        showMediaSelector={showMediaSelector}
        select={select}
        exploreTextMap={exploreTextMap}
        handleExploreTextChange={handleExploreTextChange}
        handleAddToAds={handleAddToAds}
        addNewHero={addNewHero}
      />
    </div>
  );
};
