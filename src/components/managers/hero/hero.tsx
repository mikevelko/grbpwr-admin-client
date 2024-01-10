import React, { FC, FormEvent, useEffect, useState } from 'react';
import { addHero, getHero } from 'api/hero';
import { getAllUploadedFiles } from 'api/admin';
import { common_HeroInsert, common_Media } from 'api/proto-http/admin';
import { Layout } from 'components/layout/layout';

export const Hero: FC = () => {
  const [main, setMain] = useState<common_HeroInsert>({
    contentLink: '',
    contentType: '',
    exploreLink: '',
    exploreText: '',
  });
  const [ads, setAds] = useState<common_HeroInsert[]>([
    {
      contentLink: '',
      contentType: '',
      exploreLink: '',
      exploreText: '',
    },
  ]);
  const [productIds, setProductIds] = useState<number[]>([]);
  const [media, setMedia] = useState<string[]>([]);

  const [input, setInput] = useState(false);

  const handleInput = () => {
    setInput(!input);
  };

  const determineContentType = (link: string) => {
    const extension = link.split('.').pop()?.toLowerCase() ?? '';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return 'image';
    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
      return 'video';
    }
    return '';
  };

  const addNewHero = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await addHero({ main: main, ads: ads, productIds: productIds });
      console.log('hero added:', response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newMain = { ...main, [name]: value };

    if (name === 'contentLink') {
      newMain.contentType = determineContentType(value);
    }

    setMain(newMain);
  };

  const handleAdsChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAds = [...ads];
    const { name, value } = e.target;
    newAds[index] = { ...newAds[index], [name]: value };

    if (name === 'contentType') {
      newAds[index].contentType = determineContentType(value);
    }
  };

  const handleProductIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    setProductIds(
      e.target.value
        .split(',')
        .map((id) => parseInt(id.trim(), 10))
        .filter((id) => !isNaN(id)),
    );
  };

  const addNewAds = () => {
    setAds([
      ...ads,
      {
        contentLink: '',
        contentType: '',
        exploreLink: '',
        exploreText: '',
      },
    ]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllUploadedFiles({
          limit: 5,
          offset: 0,
          orderFactor: 'ORDER_FACTOR_ASC',
        });

        const filesArray = response.list || [];
        const urls = filesArray.map((file: common_Media) => file.media?.fullSize || '');

        setMedia(urls);
      } catch (error) {
        console.error;
      }
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <form onSubmit={addNewHero}>
        <div>
          <h3>MAIN</h3>
          {/* <input
            type='text'
            name='contentLink'
            value={main.contentLink}
            onChange={handleChange}
            placeholder='Content Link'
          /> */}

          <div>
            <button type='button' onClick={handleInput}>
              by url
            </button>
            {input && (
              <div>
                <input
                  type='text'
                  name='contentLink'
                  value={main.contentLink}
                  onChange={handleChange}
                  placeholder='Content Link'
                />
              </div>
            )}
            <button>media selector</button>
            <button>add new media</button>
          </div>
          <input
            type='text'
            name='exploreLink'
            value={main.exploreLink}
            onChange={handleChange}
            placeholder='Explore Link'
          />
          <input
            type='text'
            name='exploreText'
            value={main.exploreText}
            onChange={handleChange}
            placeholder='Explore Text'
          />
        </div>

        {ads.map((ad, index) => (
          <div key={index}>
            <h3>ads {index + 1}</h3>
            <input
              type='text'
              name='contentLink'
              value={ad.contentLink}
              onChange={handleAdsChange(index)}
              placeholder='Content Link'
            />
            <input
              type='text'
              name='exploreText'
              value={ad.exploreText}
              onChange={handleAdsChange(index)}
              placeholder='text'
            />
            <input
              type='text'
              name='exploreLink'
              value={ad.exploreLink}
              onChange={handleAdsChange(index)}
              placeholder='link'
            />
            <button type='button' onClick={addNewAds}>
              add new one
            </button>
          </div>
        ))}

        <div>
          <h3>id</h3>
          <input
            type='text'
            name='productIds'
            value={productIds.join(', ')}
            onChange={handleProductIdChange}
            placeholder='Product IDs (comma-separated)'
          />
        </div>

        <ul>
          {media.map((m, id) => (
            <li key={id}>
              <img src={m} alt='img|video' style={{ height: '100px', width: '100px' }} />
            </li>
          ))}
        </ul>

        <button type='submit'>add hero</button>
      </form>
    </Layout>
  );
};
