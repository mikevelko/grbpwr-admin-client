import React, { FC, useEffect, useState } from 'react';
import { getDictionary } from 'api/admin';
import { Layout } from 'components/login/layout';
import {
  common_PaymentMethod,
  common_PaymentMethodNameEnum,
  common_ShipmentCarrierInsert,
} from 'api/proto-http/admin';
import { setPaymentMethod, setShipmentCarrier } from 'api/settings';

export const Settings: FC = () => {
  const [payment, setPayment] = useState<common_PaymentMethod[] | undefined>([]);
  const [carrier, setCarrier] = useState<common_ShipmentCarrierInsert[]>([]);

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const response = await getDictionary({});
        setPayment(response.dictionary?.paymentMethods || []);
        const carrierData = (
          response.dictionary?.shipmentCarriers?.map((carrier) => carrier.shipmentCarrier) || []
        ).filter((c): c is common_ShipmentCarrierInsert => c !== undefined);

        setCarrier(carrierData);
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

  const cutUnusedPartOfPaymentName = (name: string | undefined) => {
    return name?.replace('PAYMENT_METHOD_NAME_ENUM_', '');
  };
  return (
    <Layout>
      <div>
        {payment?.map((m, id) => (
          <div key={id}>
            <h3>{cutUnusedPartOfPaymentName(m.name)}</h3>
            <input
              type='checkbox'
              onChange={(e) => handlerPaymentMethod(m.name, e.target.checked)}
            />
          </div>
        ))}

        {carrier.map((c, id) => (
          <div key={id}>
            <h3>{c.carrier}</h3>
          </div>
        ))}
      </div>
    </Layout>
  );
};
