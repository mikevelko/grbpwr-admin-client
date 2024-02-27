import React, { FC, useState, useEffect } from 'react';
import {
  common_Size,
  common_MeasurementName,
  common_ProductSizeInsert,
  googletype_Decimal,
  common_ProductNew,
  common_Dictionary,
} from 'api/proto-http/admin';
import { getDictionary } from 'api/admin';
import styles from 'styles/addProd.scss';

interface sizeProps {
  // product: common_ProductNew;
  setProduct: React.Dispatch<React.SetStateAction<common_ProductNew>>;
  dictionary: common_Dictionary | undefined;
}

interface SelectedMeasurements {
  [sizeIndex: number]: number | undefined;
}

export const Sizes: FC<sizeProps> = ({ setProduct, dictionary }) => {
  const [selectedMeasurements, setSelectedMeasurements] = useState<SelectedMeasurements>({});

  const handleMeasurementSelection = (sizeIndex: number | undefined, measurementId: number) => {
    if (typeof sizeIndex === 'undefined') {
      return;
    }
    setSelectedMeasurements((prev) => ({ ...prev, [sizeIndex]: measurementId }));
  };
  const handleMeasurementValueChange = (
    sizeIndex: number | undefined,
    measurementId: number | undefined,
    value: number,
  ) => {
    if (typeof sizeIndex === 'undefined') {
      return;
    }
    setProduct((prevProduct) => {
      const updatedProduct = JSON.parse(JSON.stringify(prevProduct));

      if (!updatedProduct.sizeMeasurements) {
        updatedProduct.sizeMeasurements = [];
      }

      if (!updatedProduct.sizeMeasurements[sizeIndex]) {
        updatedProduct.sizeMeasurements[sizeIndex] = {
          productSize: { sizeId: sizeIndex },
          measurements: [],
        };
      }

      const measurementIndex = updatedProduct.sizeMeasurements[sizeIndex].measurements.findIndex(
        (m: { measurementNameId: number }) => m.measurementNameId === measurementId,
      );
      if (measurementIndex === -1) {
        updatedProduct.sizeMeasurements[sizeIndex].measurements.push({
          measurementNameId: measurementId,
          measurementValue: { value },
        });
      } else {
        updatedProduct.sizeMeasurements[sizeIndex].measurements[measurementIndex].measurementValue =
          { value };
      }

      return updatedProduct;
    });
  };

  const handleSizeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    sizeIndex: number | undefined,
  ) => {
    if (typeof sizeIndex === 'undefined') {
      // Handle the undefined case
      return;
    }

    const { name, value } = e.target;
    setProduct((prevProduct) => {
      const updatedSizeMeasurements = [...(prevProduct.sizeMeasurements || [])];
      const sizeQuantity: googletype_Decimal = { value: value };

      if (!updatedSizeMeasurements[sizeIndex]) {
        const sizeId = sizeIndex;
        const productSize: common_ProductSizeInsert = {
          quantity: sizeQuantity,
          sizeId: sizeId,
        };
        updatedSizeMeasurements[sizeIndex] = {
          productSize: productSize,
          measurements: [],
        };
      } else {
        updatedSizeMeasurements[sizeIndex] = {
          productSize: {
            quantity: sizeQuantity,
            sizeId: updatedSizeMeasurements[sizeIndex].productSize?.sizeId || sizeIndex,
          },
          measurements: [],
        };
      }

      return { ...prevProduct, sizeMeasurements: updatedSizeMeasurements };
    });
  };

  const getSizeName = (sizeId: number | undefined): string => {
    const size = dictionary?.sizes?.find((s) => s.id === sizeId);
    if (size && size.name) {
      return size.name.replace('SIZE_ENUM_', '');
    }
    return 'size not found';
  };

  const getMeasurementName = (id: number | undefined): string => {
    const measurement = dictionary?.measurements?.find((m) => m.id === id);
    if (measurement && measurement.name) {
      return measurement.name.replace('MEASUREMENT_NAME_ENUM_', '');
    }
    return 'size not found';
  };

  return (
    <div className={styles.product_container}>
      <label className={styles.title}>Sizes</label>
      <ul>
        {dictionary?.sizes?.map((size) => (
          <li key={size.id}>
            <strong>{getSizeName(size.id)}</strong>
            <input
              type='number'
              id={size.name}
              name='quantity'
              onChange={(e) => handleSizeChange(e, size.id)}
            />
            <div className={styles.sizeMeasurement}>
              <select
                className={styles.measurementSelect}
                onChange={(e) => handleMeasurementSelection(size.id, parseInt(e.target.value, 10))}
              >
                <option value=''>select measurement</option>
                {dictionary.measurements?.map((measurement) => (
                  <option key={measurement.id} value={measurement.id}>
                    {getMeasurementName(measurement.id)}
                  </option>
                ))}
              </select>
              {selectedMeasurements[size.id as number] && (
                <input
                  type='number'
                  className={styles.measurementInput}
                  onChange={(e) =>
                    handleMeasurementValueChange(
                      size.id,
                      selectedMeasurements[size.id as number],
                      parseInt(e.target.value, 10),
                    )
                  }
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
