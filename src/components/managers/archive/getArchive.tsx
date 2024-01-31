import React, { FC, useEffect, useState } from 'react';
import { getArchive, addArchiveItem, deleteArchive } from 'api/archive';
import { common_ArchiveFull, common_ArchiveItemInsert, common_Media } from 'api/proto-http/admin';
import styles from 'styles/archiveList.scss';
import { getAllUploadedFiles } from 'api/admin';
import { ArchivePaged } from './archiveComponents/archivePaged';
import { Layout } from 'components/login/layout';
import arrow from 'img/arrow-right.jpg';

export const GetArchive: FC = () => {
  const [archive, setArchive] = useState<common_ArchiveFull[] | undefined>([]);
  const [newItemsByArchiveId, setNewItemsByArchiveId] = useState<{
    [key: number]: common_ArchiveItemInsert;
  }>({});
  const [filesUrl, setFilesUrl] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1); // or whatever page size you want
  const [isLastPage, setIsLastPage] = useState(false);

  const goToNextPage = () => {
    if (!isLastPage) {
      setCurrentPage((page) => page + 1);
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
    if (currentPage > 1) {
      setIsLastPage(false); // Reset the isLastPage when going back
    }
  };

  const fetchArchive = async (page = currentPage) => {
    try {
      const offset = (page - 1) * pageSize;
      const response = await getArchive({
        limit: pageSize,
        offset: offset,
        orderFactor: 'ORDER_FACTOR_ASC',
      });
      setArchive(response.archives);
      const fetchedLength = response.archives?.length ?? 0;
      setIsLastPage(fetchedLength < pageSize || fetchedLength === 0);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchArchive();
  }, [currentPage, pageSize]);

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

  const handleNewItemFieldChange = (
    archiveId: number,
    field: 'title' | 'url' | 'media',
    value: string,
  ) => {
    setNewItemsByArchiveId((currentItems) => ({
      ...currentItems,
      [archiveId]: { ...currentItems[archiveId], [field]: value },
    }));
  };

  const submitNewItem = async (archiveId: number) => {
    try {
      const newItem = newItemsByArchiveId[archiveId];
      const response = await addArchiveItem({
        archiveId: archiveId,
        items: [newItem],
      });
      console.log(response);
      fetchArchive();
    } catch (error) {
      console.error(error);
    }
  };

  const handleMediaSelection = (archiveId: number, mediaUrl: string) => {
    setNewItemsByArchiveId((currentItems) => ({
      ...currentItems,
      [archiveId]: { ...currentItems[archiveId], media: mediaUrl },
    }));
  };

  const removeArchive = async (id: number | undefined) => {
    try {
      const response = await deleteArchive({ id });
      console.log('archive deleted: ', response);
      fetchArchive();
    } catch (error) {
      console.error;
    }
  };

  return (
    <Layout>
      <div className={styles.archive_list_container}>
        <button type='button' onClick={goToPreviousPage} disabled={currentPage === 1}>
          <img src={arrow} style={{ rotate: '180deg' }} />
        </button>
        {archive?.map((archive, archiveIdx) => (
          <div key={archiveIdx} className={styles.list}>
            <button type='button' onClick={() => removeArchive(archive.archive?.id)}>
              delete
            </button>
            <h3>{archive.archive?.archiveInsert?.heading}</h3>

            <ArchivePaged
              filesUrl={filesUrl}
              archive={archive}
              newItemsByArchiveId={newItemsByArchiveId}
              handleMediaSelection={handleMediaSelection}
              handleNewItemFieldChange={handleNewItemFieldChange}
              submitNewItem={submitNewItem}
            />

            <h3>{archive.archive?.archiveInsert?.description}</h3>
          </div>
        ))}
        <button type='button' onClick={goToNextPage} disabled={isLastPage}>
          <img src={arrow} />
        </button>
      </div>
    </Layout>
  );
};
