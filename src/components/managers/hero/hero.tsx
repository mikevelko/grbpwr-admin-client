import React, { FC, FormEvent, useEffect, useState } from 'react';
import { addHero } from 'api/hero';
import { getAllUploadedFiles } from 'api/admin';
import { common_HeroInsert, common_Media } from 'api/proto-http/admin';
import { Layout } from 'components/layout/layout';

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
  const [main, setMain] = useState<common_HeroInsert>({
    contentLink: '',
    contentType: '',
    exploreLink: '',
    exploreText: '',
  });
  const [files, setFiles] = useState<string[]>([]);
  const [toggleMediaSelector, setToggleMediaSelector] = useState(false);
  const [toggleByUrlMain, setToggleByUrl] = useState(false);

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

        setFiles(urls);
      } catch (error) {
        console.error('Error fetching uploaded files:', error);
      }
    };

    fetchUploadedFiles();
  }, []);

  const handleAddHero = async () => {
    try {
      const response = await addHero({ main, ads: [], productIds: [] });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'contentLink') {
      const contentType = determineContentType(value);
      setMain({ ...main, contentLink: value, contentType });
    } else {
      setMain({ ...main, [name]: value });
    }
  };

  const handleMediaSelectorFiles = (mediaURL: string) => {
    const contentType = determineContentType(mediaURL);
    setMain({ ...main, contentLink: mediaURL, contentType });
  };
  const handleMainByUrlVisibility = () => {
    setToggleByUrl(!toggleByUrlMain);
  };

  const mediaSelectorVisibility = () => {
    setToggleMediaSelector(!toggleMediaSelector);
  };

  return (
    <Layout>
      <h3>Main</h3>
      <div>
        <button type='button' onClick={handleMainByUrlVisibility}>
          by url
        </button>
        {toggleByUrlMain && (
          <input
            type='text'
            name='contentLink'
            value={main?.contentLink}
            onChange={handleMainChange}
          />
        )}
        <button type='button' onClick={mediaSelectorVisibility}>
          media selector
        </button>
        {toggleMediaSelector && (
          <ul>
            {files.map((media, index) => (
              <li key={index} onClick={() => handleMediaSelectorFiles(media)}>
                <img src={media} alt='' style={{ width: '100px', height: '100px' }} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <button type='button' onClick={handleAddHero}>
        ok
      </button>
    </Layout>
  );
};
