import { getAllUploadedFiles } from 'api/admin';
import { addHero } from 'api/hero';
import { common_HeroInsert, common_Media } from 'api/proto-http/admin';
import { Ads } from './pickerComponents/ads';
import { MainHero } from './pickerComponents/main';
import { HeroPageProduct } from './heroPageProduct';
import styles from 'styles/hero.scss';
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
  const [productIds, setProductIds] = useState<number[]>([]);

  const [main, setMain] = useState<common_HeroInsert>({
    contentLink: '',
    contentType: '',
    exploreLink: '',
    exploreText: '',
  });

  const [ads, setAds] = useState<common_HeroInsert[]>([]);
  const [newAdUrl, setNewAdUrl] = useState('');
  const [newExploreText, setNewExploreText] = useState('');

  const handleAddByUrl = () => {
    const newAd = {
      contentLink: newAdUrl,
      contentType: determineContentType(newAdUrl),
      exploreLink: '',
      exploreText: newExploreText,
    };
    setAds((prevAds) => [...prevAds, newAd]);
    setNewAdUrl('');
    setThumbnailInput(false);
  };

  const handleMainExploreTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMain({ ...main, exploreText: e.target.value });
  };

  const handleMainByUrlOrFile = (url: string) => {
    const newMain = {
      contentLink: url,
      contentType: determineContentType(url),
      exploreLink: '',
      exploreText: main.exploreText,
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
      const response = await addHero({ main, ads, productIds });
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
    <div className={styles.hero}>
      <MainHero
        filesUrl={filesUrl}
        handleMainByUrlOrFile={handleMainByUrlOrFile}
        handleMainExploreText={handleMainExploreTextChange}
        exploreText={main.exploreText}
      />
      {/* TODO: remove unnessary properties in ads file */}
      <Ads
        filesUrl={filesUrl}
        selectedImage={selectedImage}
        handleThumbnail={handleThumbnail}
        thumbnailInput={thumbnailInput}
        newAdUrl={newAdUrl}
        setNewAdUrl={setNewAdUrl}
        newExploreText={newExploreText}
        setNewExploreText={setNewExploreText}
        handleAddByUrl={handleAddByUrl}
        handleViewAll={handleViewAll}
        showMediaSelector={showMediaSelector}
        select={select}
        exploreTextMap={exploreTextMap}
        handleExploreTextChange={handleExploreTextChange}
        handleAddToAds={handleAddToAds}
        addNewHero={addNewHero}
      />

      <HeroPageProduct
        addNewHero={addNewHero}
        productIds={productIds}
        setProductIds={setProductIds}
      />
    </div>
  );
};
