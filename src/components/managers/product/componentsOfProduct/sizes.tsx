import React, { FC, useState, useEffect } from 'react';
import {
  common_Size,
  common_MeasurementName,
  common_ProductSizeInsert,
  googletype_Decimal,
  common_ProductNew,
} from 'api/proto-http/admin';
import { getDictionary, addMediaByID } from 'api/admin';
import styles from 'styles/addProd.scss';

interface sizeProps {
  product: common_ProductNew;
  setProduct: React.Dispatch<React.SetStateAction<common_ProductNew>>;
}

interface SelectedMeasurements {
  [sizeIndex: number]: number; // Or string, if your measurement IDs are strings
}

export const Sizes: FC<sizeProps> = ({ product, setProduct }) => {
  const [sizeDictionary, setSizeDictionary] = useState<common_Size[]>([]);
  const [measurementEnum, setMeasurementEnum] = useState<common_MeasurementName[]>([]);
  const [selectedMeasurements, setSelectedMeasurements] = useState<SelectedMeasurements>({});

  const handleMeasurementSelection = (sizeIndex: any, measurementId: any) => {
    setSelectedMeasurements((prev) => ({ ...prev, [sizeIndex]: measurementId }));
  };

  const handleMeasurementValueChange = (sizeIndex: any, measurementId: any, value: any) => {
    setProduct((prevProduct) => {
      // Create a deep copy of the prevProduct to avoid direct state mutation
      const updatedProduct = JSON.parse(JSON.stringify(prevProduct));

      // Ensure the sizeMeasurements array exists
      if (!updatedProduct.sizeMeasurements) {
        updatedProduct.sizeMeasurements = [];
      }

      // Ensure there's an entry for this size
      if (!updatedProduct.sizeMeasurements[sizeIndex]) {
        updatedProduct.sizeMeasurements[sizeIndex] = {
          productSize: { sizeId: sizeIndex },
          measurements: [],
        };
      }

      // Find the measurement entry by measurementId, or create a new one if it doesn't exist
      const measurementIndex = updatedProduct.sizeMeasurements[sizeIndex].measurements.findIndex(
        (m: { measurementNameId: number }) => m.measurementNameId === measurementId,
      );
      if (measurementIndex === -1) {
        // Measurement doesn't exist, create a new one
        updatedProduct.sizeMeasurements[sizeIndex].measurements.push({
          measurementNameId: measurementId,
          measurementValue: { value },
        });
      } else {
        // Measurement exists, update its value
        updatedProduct.sizeMeasurements[sizeIndex].measurements[measurementIndex].measurementValue =
          { value };
      }

      return updatedProduct;
    });
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>, sizeIndex: number) => {
    const { name, value } = e.target;

    setProduct((prevProduct) => {
      const updatedSizeMeasurements = [...(prevProduct.sizeMeasurements || [])];
      const sizeQuantity: googletype_Decimal = { value: value };

      if (!updatedSizeMeasurements[sizeIndex]) {
        const sizeId = sizeIndex;

        const productSize: common_ProductSizeInsert = {
          quantity: sizeQuantity,
          sizeId: sizeId + 1,
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

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const response = await getDictionary({});
        const size = response.dictionary?.sizes || [];
        const measurement = response.dictionary?.measurements || [];
        const sortedSizes = size.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
        const sortedMeasurement = measurement.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
        setSizeDictionary(sortedSizes);
        setMeasurementEnum(sortedMeasurement);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDictionary();
  }, []);

  // TODO: create separate file for 2 functions

  const getSizeName = (sizeId: number | undefined): string => {
    const size = sizeDictionary.find((s) => s.id === sizeId);
    if (size && size.name) {
      return size.name.replace('SIZE_ENUM_', '');
    }
    return 'size not found';
  };

  const getMeasurementName = (id: number | undefined): string => {
    const measurement = measurementEnum.find((m) => m.id === id);
    if (measurement && measurement.name) {
      return measurement.name.replace('MEASUREMENT_NAME_ENUM_', '');
    }
    return 'size not found';
  };

  return (
    <div className={styles.product_container}>
      <label className={styles.title}>Sizes</label>
      <ul>
        {sizeDictionary.map((size, sizeIndex) => (
          <li key={sizeIndex}>
            <strong>{getSizeName(size.id)}</strong>
            <input
              type='number'
              id={size.name}
              name='quantity'
              onChange={(e) => handleSizeChange(e, sizeIndex)}
            />
            <div className={styles.sizeMeasurement}>
              <select
                className={styles.measurementSelect}
                onChange={(e) => handleMeasurementSelection(sizeIndex, e.target.value)}
              >
                {measurementEnum.map((measurement, measurementIndex) => (
                  <option key={measurementIndex} value={measurement.id}>
                    {getMeasurementName(measurement.id)}
                  </option>
                ))}
              </select>
              {selectedMeasurements[sizeIndex] && (
                <input
                  type='number'
                  className={styles.measurementInput}
                  onChange={(e) =>
                    handleMeasurementValueChange(
                      sizeIndex,
                      selectedMeasurements[sizeIndex],
                      e.target.value,
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
