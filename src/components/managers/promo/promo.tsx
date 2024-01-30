import React, { FC, useState } from 'react';
import { addPromo } from 'api/promo';
import { AddPromoRequest } from 'api/proto-http/admin';
import { useNavigate } from '@tanstack/react-location';
import { Layout } from 'components/login/layout';
import { ROUTES } from 'constants/routes';
import styles from 'styles/promo.scss';

interface PromoState {
  Code: string;
  freeShipping: boolean;
  discount: number;
  expiration: string;
  allowed: boolean;
  voucher: boolean;
}

export const Promo: FC = () => {
  const [promoState, setPromoState] = useState<PromoState>({
    Code: '',
    freeShipping: false,
    discount: 0,
    expiration: '',
    allowed: false,
    voucher: false,
  });

  const { Code, freeShipping, discount, expiration, allowed, voucher } = promoState;
  const navigate = useNavigate();

  const handleChange = (key: keyof PromoState, value: string | boolean | number) => {
    if (key === 'discount' && typeof value === 'number') {
      // Ensure discount value is within the range of 0 to 99
      if (value < 0) {
        value = 0;
      } else if (value > 99) {
        value = 99;
      }
    }
    setPromoState((prevState) => ({ ...prevState, [key]: value }));
  };

  const createPromo = async () => {
    const formattedExpiration = expiration.endsWith('Z') ? expiration : expiration + ':00Z';

    const promo: AddPromoRequest = {
      promo: {
        code: Code,
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
    <Layout>
      <div className={styles.promo}>
        <div className={styles.promo_fields_container}>
          {Object.entries(promoState).map(([key, value]) => (
            <div key={key} className={styles.promo_fields}>
              <label htmlFor={key}>{key}</label>
              {typeof value === 'boolean' ? (
                <input
                  type='checkbox'
                  checked={value}
                  onChange={() => handleChange(key as keyof PromoState, !value)}
                  id={key}
                />
              ) : (
                <>
                  {key === 'discount' ? (
                    <input
                      type='number' // Set the type to 'number' for the discount input
                      value={value as number} // Ensure value is treated as number
                      onChange={(e) =>
                        handleChange(key as keyof PromoState, parseInt(e.target.value))
                      }
                      id={key}
                    />
                  ) : (
                    <input
                      type={key === 'expiration' ? 'datetime-local' : 'text'}
                      value={key === 'expiration' ? value.slice(0, -1) : value}
                      onChange={(e) =>
                        handleChange(
                          key as keyof PromoState,
                          key === 'expiration' ? e.target.value + ':00Z' : e.target.value,
                        )
                      }
                      id={key}
                    />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div className={styles.promo_btns}>
          <button type='button' onClick={createPromo}>
            Add Promo
          </button>
          <button type='button' onClick={navigateGetPromo}>
            Get Promo
          </button>
        </div>
      </div>
    </Layout>
  );
};
