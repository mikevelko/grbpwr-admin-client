import React, { ChangeEvent, FC, useState } from 'react';

interface MainProps {
  handleMainByUrlOrFile: (value: string) => void;
  filesUrl: string[];
  handleMainExploreText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  exploreText: string | undefined;
}

// TODO: fix issue: after click on btn intendet for add files exploreText content deleted

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
    <div>
      <button type='button' onClick={handleInputFieldVisibility}>
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
      <button type='button' onClick={handleMediaSelectorVisibility}>
        media selector
      </button>
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
      <input type='text' name='exploreText' value={exploreText} onChange={handleMainExploreText} />
    </div>
  );
};
