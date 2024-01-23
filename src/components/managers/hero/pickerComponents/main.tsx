import React, { FC, useState } from 'react';
import styles from 'styles/hero.scss';

interface MainProps {
  handleMainByUrlOrFile: (value: string) => void;
  filesUrl: string[];
  handleMainExploreText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  exploreText: string | undefined;
}

export const MainHero: FC<MainProps> = ({
  handleMainByUrlOrFile,
  filesUrl,
  exploreText,
  handleMainExploreText,
}) => {
  const [url, setUrl] = useState('');
  const [inputFieldVisibility, setInputFieldVisibility] = useState(false);
  const [mediaSelectorVisibility, setMediaSelectorVisibility] = useState(false);

  const handleInputFieldVisibility = () => {
    setInputFieldVisibility(!inputFieldVisibility);
  };

  const handleMediaSelectorVisibility = () => {
    setMediaSelectorVisibility(!mediaSelectorVisibility);
  };
  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div className={styles.section}>
        <button type='button' onClick={handleInputFieldVisibility} className={styles.btn}>
          by url
        </button>
        {inputFieldVisibility && (
          <div>
            <input
              type='text'
              placeholder='by url'
              name='contentLink'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button type='button' onClick={() => handleMainByUrlOrFile(url)}>
              ok
            </button>
          </div>
        )}
        <button type='button' onClick={handleMediaSelectorVisibility} className={styles.btn}>
          media selector
        </button>
        <input
          type='text'
          name='exploreText'
          value={exploreText}
          onChange={handleMainExploreText}
        />
      </div>
      {mediaSelectorVisibility && (
        <div>
          <ul>
            {filesUrl.map((media, index) => (
              <li key={index}>
                <img src={media} alt='' style={{ width: '100px', height: '100px' }} />
                <button type='button' onClick={() => handleMainByUrlOrFile(media)}>
                  ok
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// TODO: maybe form instead of btn for each section ?
// TODO: clear inputs after uploading hero
