import React, { FC, useState } from 'react';
import { addPromo } from 'api/promo';
import { AddPromoRequest } from 'api/proto-http/admin';
import { useNavigate } from '@tanstack/react-location';
import { ROUTES } from 'constants/routes';

export const Promo: FC = () => {
  const [promoCode, setPromoCode] = useState('');
  const [freeShipping, setFreeShipping] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [expiration, setExpiration] = useState('');
  const [allowed, setAllowed] = useState(false);
  const [voucher, setVoucher] = useState(false);
  const navigate = useNavigate();

  const createPromo = async () => {
    const formattedExpiration = expiration.endsWith('Z') ? expiration : expiration + ':00Z';

    const promo: AddPromoRequest = {
      promo: {
        code: promoCode,
        freeShipping,
        discount: { value: discount.toString() },
        expiration: formattedExpiration,
        allowed,
        voucher,
      },
    };

    try {
      const response = await addPromo(promo);
      console.log('promo added:', response);
    } catch (error) {
      console.error(error);
    }
  };

  const navigateGetPromo = () => {
    navigate({ to: ROUTES.getPromo, replace: true });
  };

  return (
    <div>
      <h2>Add Promo</h2>
      <form>
        <label>
          Promo Code:
          <input type='text' value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
        </label>
        <br />

        <label>
          Free Shipping:
          <input
            type='checkbox'
            checked={freeShipping}
            onChange={() => setFreeShipping(!freeShipping)}
          />
        </label>
        <br />

        <label>
          Discount:
          <input
            type='number'
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
        </label>
        <br />

        <label>
          Expiration:
          <input
            type='datetime-local'
            value={expiration.slice(0, -1)} // remove 'Z' at the end for the input
            onChange={(e) => setExpiration(e.target.value + ':00Z')}
          />
        </label>
        <br />

        <label>
          Allowed:
          <input type='checkbox' checked={allowed} onChange={() => setAllowed(!allowed)} />
        </label>
        <br />

        <label>
          Voucher:
          <input type='checkbox' checked={voucher} onChange={() => setVoucher(!voucher)} />
        </label>
        <br />

        <button type='button' onClick={createPromo}>
          Add Promo
        </button>
        <button type='button' onClick={navigateGetPromo}>
          get promo
        </button>
      </form>
    </div>
  );
};
