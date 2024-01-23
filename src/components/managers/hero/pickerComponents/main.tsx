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
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const startId = (currentPage - 1) * itemsPerPage;
  const endId = startId + itemsPerPage;
  const totalItems = filesUrl.slice(startId, endId);

  const handleInputFieldVisibility = () => {
    setInputFieldVisibility(!inputFieldVisibility);
  };

  const handleMediaSelectorVisibility = () => {
    setMediaSelectorVisibility(!mediaSelectorVisibility);
  };

  const nextPage = () => {
    setCurrentPage((prevPage) =>
      prevPage < Math.ceil(filesUrl.length / itemsPerPage) ? prevPage + 1 : prevPage,
    );
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
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
        <>
          <ul className={styles.files_list}>
            <div>
              <button type='button' onClick={prevPage}>
                1
              </button>
            </div>
            {totalItems.map((media, index) => (
              <li key={index}>
                <img src={media} alt='' />
                <button type='button' onClick={() => handleMainByUrlOrFile(media)}>
                  ok
                </button>
              </li>
            ))}
            <div>
              <button type='button' onClick={nextPage}>
                2
              </button>
            </div>
          </ul>
        </>
      )}
    </div>
  );
};
