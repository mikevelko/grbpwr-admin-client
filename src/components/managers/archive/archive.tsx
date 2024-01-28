import React, { FC, useEffect, useState } from 'react';
import { addArchive } from 'api/archive';
import { AddArchiveRequest } from 'api/proto-http/admin';
import { common_Media } from 'api/proto-http/admin';
import { getAllUploadedFiles } from 'api/admin';

export const Archive: FC = () => {
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newMediaByUrl, setNewMediaByUrl] = useState('');
  const [newMediaBySelector, setNewMediaBySelector] = useState('');
  const [filesUrl, setFilesUrl] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [itemTitle, setItemTitle] = useState('');

  const createArchive = async () => {
    const newArchive: AddArchiveRequest = {
      archiveNew: {
        archive: {
          title: newTitle,
          description: newDescription,
        },
        items: [
          {
            media: newMediaByUrl || newMediaBySelector,
            url: newUrl,
            title: itemTitle,
          },
        ],
      },
    };
    try {
      const response = await addArchive(newArchive);
      console.log('archive added: ', response);
    } catch (error) {
      console.error(error);
    }
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

  const handleSelectedMedia = (media: string) => {
    setNewMediaBySelector(media);
  };

  return (
    <form>
      <input type='text' value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
      <input
        type='text'
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
      />
      <div>
        <button>by url</button>
        <input
          type='text'
          value={newMediaByUrl}
          onChange={(e) => setNewMediaByUrl(e.target.value)}
        />
        <button>media selector</button>
        <ul>
          {filesUrl.map((media, id) => (
            <li key={id}>
              <img src={media} alt='' style={{ width: '100px', height: '100px' }} />
              <button type='button' onClick={() => handleSelectedMedia(media)}>
                ok
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button type='button' onClick={createArchive}>
        add archive
      </button>
    </form>
  );
};
