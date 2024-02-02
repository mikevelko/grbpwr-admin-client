import { common_ArchiveFull, common_ArchiveItemInsert } from 'api/proto-http/admin';
import { deleteItemFromArchive } from 'api/archive';
import React, { FC, useState } from 'react';

interface ArchiveList {
  archive: common_ArchiveFull;
  newItemsByArchiveId: { [key: number]: common_ArchiveItemInsert };
  handleNewItemFieldChange: (
    archiveId: number,
    field: 'title' | 'url' | 'media',
    value: string,
  ) => void;
  handleMediaSelection: (archiveId: number, mediaUrl: string) => void;
  submitNewItem: (archiveId: number) => void;
  filesUrl: string[];
  fetchArchive: () => void;
}

export const ArchivePaged: FC<ArchiveList> = ({
  archive,
  newItemsByArchiveId,
  handleNewItemFieldChange,
  handleMediaSelection,
  submitNewItem,
  filesUrl,
  fetchArchive,
}) => {
  const [urlVisibility, setUrlVisibility] = useState(false);
  const [mediaVisibility, setMediaVisibility] = useState(false);

  const handleUrlVisibility = () => {
    setUrlVisibility(!urlVisibility);
  };

  const handleMediaVisibility = () => {
    setMediaVisibility(!mediaVisibility);
  };

  const deleteItem = async (id: number | undefined) => {
    try {
      const response = await deleteItemFromArchive({ itemId: id });
      console.log('iteme deleted: ', response);
      fetchArchive();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <ul style={{ width: '800px' }}>
      {archive.items?.map((item, itemId) => (
        <>
          <p>{itemId}</p>
          <li key={itemId}>
            <button type='button' onClick={() => deleteItem(item.id)}>
              delete
            </button>
            <img
              src={item.archiveItemInsert?.media}
              alt='media'
              style={{ width: '200px', height: '200px' }}
            />
            <p>{item.archiveItemInsert?.title}</p>
            <p>{item.archiveItemInsert?.url}</p>
          </li>
        </>
      ))}

      <li>
        <input
          type='text'
          placeholder='Title'
          value={newItemsByArchiveId[archive.archive?.id ?? 0]?.title || ''}
          onChange={(e) =>
            handleNewItemFieldChange(archive.archive?.id ?? 0, 'title', e.target.value)
          }
        />
        <div style={{ display: 'grid' }}>
          <button type='button' onClick={handleUrlVisibility}>
            by url
          </button>
          {urlVisibility && (
            <input
              type='text'
              placeholder='Media URL'
              value={newItemsByArchiveId[archive.archive?.id ?? 0]?.media || ''}
              onChange={(e) =>
                handleNewItemFieldChange(archive.archive?.id ?? 0, 'media', e.target.value)
              }
            />
          )}
          <button type='button' onClick={handleMediaVisibility}>
            media selector
          </button>
          {mediaVisibility && (
            <ul>
              {filesUrl.map((media, id) => (
                <li key={id} style={{ display: 'inline-block', margin: '5px' }}>
                  <img src={media} alt='' style={{ width: '100px', height: '100px' }} />
                  <button
                    type='button'
                    onClick={() => handleMediaSelection(archive.archive?.id ?? 0, media)}
                  >
                    ok
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          type='text'
          placeholder='Item URL'
          value={newItemsByArchiveId[archive.archive?.id ?? 0]?.url || ''}
          onChange={(e) =>
            handleNewItemFieldChange(archive.archive?.id ?? 0, 'url', e.target.value)
          }
        />
        <button onClick={() => submitNewItem(archive.archive?.id ?? 0)}>submit</button>
      </li>
    </ul>
  );
};
