import React, { FC, useState } from 'react';

interface UpdateColors {
  label: string;
  productInfo: string | undefined;
  productInfoHEX: string | undefined;
  colorName: string;
  hexName: string;
  colorValue: string | number | undefined;
  hexValue: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateFunction: () => void;
  type?: 'text';
}

export const UpdateColors: FC<UpdateColors> = ({
  label,
  productInfo,
  productInfoHEX,
  colorName,
  hexName,
  colorValue,
  hexValue,
  onChange,
  updateFunction,
  type = 'text',
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async () => {
    await updateFunction();
    setIsEditing(false);
  };
  return (
    <div>
      <label htmlFor={colorName}>
        {label}: {productInfo}({productInfoHEX})
      </label>
      {isEditing && (
        <>
          <input type={type} name={colorName} value={colorValue} onChange={onChange} />
          <input type={type} name={hexName} value={hexValue} onChange={onChange} />
          <button onClick={handleUpdate}>UPDATE</button>
        </>
      )}
      {!isEditing && <button onClick={() => setIsEditing(true)}>+</button>}
    </div>
  );
};
