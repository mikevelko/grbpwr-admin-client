import React, { FC, useEffect, useState } from 'react';
import { getDictionary } from 'api/admin';
import { Layout } from 'components/login/layout';
import {
  common_PaymentMethod,
  common_PaymentMethodNameEnum,
  common_ShipmentCarrierInsert,
} from 'api/proto-http/admin';
import {
  setPaymentMethod,
  setShipmentCarrier,
  setShipmentCarrierPrice,
  setSiteAvailability,
} from 'api/settings';
import styles from 'styles/settings.scss';

export const Settings: FC = () => {
  const [payment, setPayment] = useState<common_PaymentMethod[] | undefined>([]);
  const [carrier, setCarrier] = useState<common_ShipmentCarrierInsert[]>([]);
  const [price, setPrice] = useState<{ [name: string]: string }>({});
  const [siteEnabled, setSiteEnabled] = useState<boolean>();

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const response = await getDictionary({});
        setPayment(response.dictionary?.paymentMethods || []);
        const carrierData = (
          response.dictionary?.shipmentCarriers?.map((carrier) => carrier.shipmentCarrier) || []
        ).filter((c): c is common_ShipmentCarrierInsert => c !== undefined);

        setCarrier(carrierData);
        setSiteEnabled(response.dictionary?.siteEnabled);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDictionary();
  }, []);

  const handlerPaymentMethod = async (paymentMethod: string | undefined, allow: boolean) => {
    try {
      const response = await setPaymentMethod({
        paymentMethod: paymentMethod as common_PaymentMethodNameEnum,
        allow,
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShipmentCarrier = async (carrier: string | undefined, allow: boolean) => {
    try {
      const response = await setShipmentCarrier({
        carrier: carrier,
        allow,
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShipmentCarrierPrice = async (carrier: string | undefined) => {
    if (!carrier) {
      console.log('error');
      return;
    }
    const newPrice = price[carrier];
    if (newPrice) {
      try {
        const response = await setShipmentCarrierPrice({
          carrier: carrier,
          price: { value: newPrice },
        });
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handlePriceChange = (carrier: string | undefined, price: string) => {
    if (carrier) {
      setPrice((prev) => ({ ...prev, [carrier]: price }));
    } else {
      console.log('carrier not founf');
    }
  };

  const handleSiteAvailability = async (available: boolean) => {
    try {
      const response = await setSiteAvailability({
        available,
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const cutUnusedPartOfPaymentName = (name: string | undefined) => {
    return name?.replace('PAYMENT_METHOD_NAME_ENUM_', '');
  };
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.payment_methods}>
          <h2>payment methods</h2>
          {payment?.map((m, id) => (
            <div key={id} className={styles.payment_wrapper}>
              <h3>{cutUnusedPartOfPaymentName(m.name)}</h3>
              <input
                type='checkbox'
                onChange={(e) => handlerPaymentMethod(m.name, e.target.checked)}
              />
            </div>
          ))}
        </div>

        <div className={styles.carrier_container}>
          <h2>shipment carrier</h2>
          {carrier.map((c, id) => (
            <div key={id} className={styles.carrier_wrapper}>
              <div className={styles.carrier_allowance}>
                <h3>{c.carrier}</h3>
                <input
                  type='checkbox'
                  checked={c.allowed}
                  onChange={(e) => handleShipmentCarrier(c.carrier, e.target.checked)}
                />
              </div>
              <div className={styles.carrier_price}>
                <input
                  type='number'
                  defaultValue={c.price?.value}
                  onChange={(e) => handlePriceChange(c.carrier, e.target.value)}
                />
                <button type='button' onClick={() => handleShipmentCarrierPrice(c.carrier)}>
                  upload
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.site}>
          <h2>site available</h2>
          <input
            type='checkbox'
            checked={siteEnabled}
            onChange={(e) => handleSiteAvailability(e.target.checked)}
          />
        </div>
      </div>
    </Layout>
  );
};
