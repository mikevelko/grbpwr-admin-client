import React, { FC, useEffect, useState } from 'react';
import { getArchive, addArchiveItem, deleteArchive, updateArchive } from 'api/archive';
import {
  common_ArchiveFull,
  common_ArchiveInsert,
  common_ArchiveItemInsert,
  common_Media,
} from 'api/proto-http/admin';
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
  const [pageSize, setPageSize] = useState(4); // or whatever page size you want
  const [isLastPage, setIsLastPage] = useState(false);
  const [editingArchive, setEditingArchive] = useState<common_ArchiveInsert | null>(null);
  const [editItemId, setEditItemId] = useState<number | undefined>();

  const handleEditClick = (archive: common_ArchiveFull) => {
    setEditItemId(archive.archive?.id);
    setEditingArchive(archive.archive?.archiveInsert || null); // Initialize editingArchive with current data
  };

  const handleEditingFieldChange = (field: 'heading' | 'description', value: string) => {
    setEditingArchive((currentEditingArchive) => {
      if (currentEditingArchive) {
        return { ...currentEditingArchive, [field]: value };
      }
      return null;
    });
  };

  const handleSaveClick = async () => {
    if (editingArchive && editItemId) {
      try {
        await updateArchive({
          id: editItemId,
          archive: editingArchive,
        });
        setEditItemId(undefined); // Exit edit mode
        setEditingArchive(null); // Reset editing archive
        fetchArchive(); // Refresh the list
      } catch (error) {
        console.error(error);
      }
    }
  };

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
            {editItemId === archive.archive?.id ? (
              <>
                <input
                  type='text'
                  value={editingArchive?.heading || ''}
                  onChange={(e) => handleEditingFieldChange('heading', e.target.value)}
                />
                <input
                  type='text'
                  value={editingArchive?.description || ''}
                  onChange={(e) => handleEditingFieldChange('description', e.target.value)}
                />
                <button type='button' onClick={handleSaveClick}>
                  save
                </button>
              </>
            ) : (
              <>
                <h3>{archive.archive?.archiveInsert?.heading}</h3>
                <h3>{archive.archive?.archiveInsert?.description}</h3>
                <button type='button' onClick={() => handleEditClick(archive)}>
                  edit
                </button>
              </>
            )}

            <ArchivePaged
              filesUrl={filesUrl}
              archive={archive}
              newItemsByArchiveId={newItemsByArchiveId}
              handleMediaSelection={handleMediaSelection}
              handleNewItemFieldChange={handleNewItemFieldChange}
              submitNewItem={submitNewItem}
              fetchArchive={fetchArchive}
            />
          </div>
        ))}
        <button type='button' onClick={goToNextPage} disabled={isLastPage}>
          <img src={arrow} />
        </button>
      </div>
    </Layout>
  );
};
