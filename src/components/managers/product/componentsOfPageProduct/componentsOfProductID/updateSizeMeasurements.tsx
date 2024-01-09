import { common_ProductMeasurement, common_ProductSize } from 'api/proto-http/admin';
import React, { FC } from 'react';
import styles from 'styles/productID.scss';

interface ProductSizeMeasurements {
  sizes: common_ProductSize[] | undefined;
  measurements: common_ProductMeasurement[] | undefined;
  sizeUpdates: { [sizeId: string]: number };
  measurementUpdates: { [key: string]: string };
  getSizeName: (sizeId: number | undefined) => string;
  getMeasuremntName: (measurementId: number | undefined) => string;
  handleSizeChange: (sizeId: number | undefined, quantity: number) => void;
  updateSizeQuantity: (sizeId: number | undefined, quantity: number | undefined) => void;
  handleMeasurementChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    sizeId: number,
    measurementNameId: number,
  ) => void;
  updateMeasurementValue: (sizeId: number, measurementNameId: number) => void;
}

export const UpdateSizeMeasurements: FC<ProductSizeMeasurements> = ({
  sizes,
  measurements,
  sizeUpdates,
  measurementUpdates,
  getSizeName,
  getMeasuremntName,
  handleSizeChange,
  updateSizeQuantity,
  handleMeasurementChange,
  updateMeasurementValue,
}) => {
  return (
    <div className={styles.update_info_container}>
      {sizes
        ?.filter((size) => typeof size.sizeId !== 'undefined')
        .map((size, index) => (
          <div key={index}>
            <label>
              {getSizeName(size.sizeId)}: {size.quantity?.value}
            </label>
            <input
              type='number'
              value={size.sizeId !== undefined ? sizeUpdates[size.sizeId] : 0}
              onChange={(e) => handleSizeChange(size.sizeId!, Number(e.target.value))}
            />
            <button
              onClick={() =>
                size.sizeId !== undefined &&
                updateSizeQuantity(size.sizeId, sizeUpdates[size.sizeId])
              }
            >
              Update Quantity
            </button>
          </div>
        ))}
      <ul>
        {sizes?.map((size, sizeIndex) =>
          measurements?.map((m, measurementIndex) => {
            const key = `${size.sizeId}-${m.measurementNameId}`;
            return (
              <li key={`${sizeIndex}-${measurementIndex}`}>
                <label>
                  {getMeasuremntName(m.measurementNameId)}:{m.measurementValue?.value}
                </label>
                <input
                  type='text'
                  value={measurementUpdates[key] || ''}
                  onChange={(e) => handleMeasurementChange(e, size.sizeId!, m.measurementNameId!)}
                />
                <button onClick={() => updateMeasurementValue(size.sizeId!, m.measurementNameId!)}>
                  Update
                </button>
              </li>
            );
          }),
        )}
      </ul>
    </div>
  );
};
