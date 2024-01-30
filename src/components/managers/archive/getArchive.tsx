import React, { FC, useEffect, useState } from 'react';
import { getArchive, addArchiveItem } from 'api/archive';
import { common_ArchiveFull, common_ArchiveItemInsert } from 'api/proto-http/admin';

export const GetArchive: FC = () => {
  const [archive, setArchive] = useState<common_ArchiveFull[] | undefined>([]);
  const [newItems, setNewItems] = useState<common_ArchiveItemInsert[]>([]);

  const addNewItem = async (archiveId: number | undefined, newItem: common_ArchiveItemInsert) => {
    try {
      const response = await addArchiveItem({ archiveId: archiveId, items: [newItem] });
      console.log(response.message);
      // Refresh the archive list after adding the new item
      await fetchArchive();
      // Clear the input fields after adding the item
      setNewItems([...newItems, { title: '', media: '', url: '' }]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchArchive = async () => {
    try {
      const response = await getArchive({
        limit: 20,
        offset: 0,
        orderFactor: 'ORDER_FACTOR_ASC',
      });
      setArchive(response.archives);
      // Initialize newItems array with empty objects for each item in the archive list
      setNewItems(Array(response.archives?.length).fill({ title: '', media: '', url: '' }));
    } catch (error) {
      console.error(error); // Log the error for debugging
    }
  };

  useEffect(() => {
    fetchArchive();
  }, []);

  const handleTitleChange = (index: number, value: string) => {
    const updatedItems = [...newItems];
    updatedItems[index] = { ...updatedItems[index], title: value };
    setNewItems(updatedItems);
  };

  const handleMediaChange = (index: number, value: string) => {
    const updatedItems = [...newItems];
    updatedItems[index] = { ...updatedItems[index], media: value };
    setNewItems(updatedItems);
  };

  const handleUrlChange = (index: number, value: string) => {
    const updatedItems = [...newItems];
    updatedItems[index] = { ...updatedItems[index], url: value };
    setNewItems(updatedItems);
  };

  return (
    <ul>
      {archive?.map((it, id) => (
        <li key={id} style={{ border: '2px solid black' }}>
          <h3>{it.archive?.archiveInsert?.description}</h3>
          {it.items?.map((smt, itemId) => (
            <div key={itemId}>
              <img
                src={smt.archiveItemInsert?.media}
                alt=''
                style={{ width: '100px', height: '100px' }}
              />
              <h3>{smt.archiveItemInsert?.title}</h3>
              <button onClick={() => addNewItem(smt.archiveId, newItems[id])}>Add Item</button>
            </div>
          ))}
          <div>
            {/* Input fields for the new item */}
            <input
              type='text'
              value={newItems[id].title}
              onChange={(e) => handleTitleChange(id, e.target.value)}
              placeholder='Title'
            />
            <input
              type='text'
              value={newItems[id].media}
              onChange={(e) => handleMediaChange(id, e.target.value)}
              placeholder='Media URL'
            />
            <input
              type='text'
              value={newItems[id].url}
              onChange={(e) => handleUrlChange(id, e.target.value)}
              placeholder='URL'
            />
            {/* Button to add the new item */}
          </div>
        </li>
      ))}
    </ul>
  );
};
