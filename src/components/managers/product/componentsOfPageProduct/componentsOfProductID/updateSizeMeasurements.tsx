import {
  common_ProductFull,
  common_ProductMeasurement,
  common_ProductMeasurementInsert,
  common_ProductSize,
  common_ProductSizeInsert,
} from 'api/proto-http/admin';
import React, { FC } from 'react';

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
    <div>
      {sizes
        ?.filter((size) => typeof size.sizeId !== 'undefined')
        .map((size, index) => (
          <div key={index}>
            <span>
              {getSizeName(size.sizeId)}: {size.quantity?.value}
            </span>
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
                {getMeasuremntName(m.measurementNameId)}:{m.measurementValue?.value}
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
