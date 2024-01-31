import React, { FC, useEffect, useState } from 'react';
import { getArchive, addArchiveItem } from 'api/archive';
import { common_ArchiveFull, common_ArchiveItemInsert } from 'api/proto-http/admin';
import styles from 'styles/archiveList.scss';

export const GetArchive: FC = () => {
  const [archive, setArchive] = useState<common_ArchiveFull[] | undefined>([]);
  const [newItems, setNewItems] = useState<common_ArchiveItemInsert[]>([]);

  const fetchArchive = async () => {
    try {
      const response = await getArchive({
        limit: 20,
        offset: 0,
        orderFactor: 'ORDER_FACTOR_ASC',
      });
      setArchive(response.archives);
      setNewItems(Array(response.archives?.length).fill({ title: '', media: '', url: '' }));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchArchive();
  }, []);

  const handleFieldChange = (
    id: number,
    field: 'title' | 'url' | 'media',
    value: string | undefined,
  ) => {
    setNewItems((currentItmes) =>
      currentItmes.map((item, idx) => (idx === id ? { ...item, [field]: value } : item)),
    );
  };

  return (
    <div className={styles.archive_list_container}>
      {archive?.map((archive, id) => (
        <div key={id} className={styles.list}>
          <h3>{archive.archive?.archiveInsert?.heading}</h3>
          <ul>
            {archive.items?.map((item, id) => (
              <li key={id}>
                <img
                  src={item.archiveItemInsert?.media}
                  alt='media'
                  style={{ width: '200px', height: '200px' }}
                />
                <p>{item.archiveItemInsert?.title}</p>
                <p>{item.archiveItemInsert?.url}</p>
              </li>
            ))}
          </ul>
          <h3>{archive.archive?.archiveInsert?.description}</h3>
        </div>
      ))}
    </div>
  );
};
