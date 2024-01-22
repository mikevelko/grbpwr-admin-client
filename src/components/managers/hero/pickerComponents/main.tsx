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
  return (
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
      <input type='text' name='exploreText' value={exploreText} onChange={handleMainExploreText} />
    </div>
  );
};
