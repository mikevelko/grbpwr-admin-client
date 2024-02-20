import queryString from 'query-string';
import React, { FC, useEffect, useState } from 'react';
import { orderById } from 'api/orders';
import { common_OrderFull } from 'api/proto-http/admin';
import { useNavigate } from '@tanstack/react-location';
import { ROUTES } from 'constants/routes';

export const OrderId: FC = () => {
  const query = queryString.parse(window.location.search);
  const orderId = query.orderId as string;
  const [orders, setOrders] = useState<common_OrderFull | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderId = async () => {
      try {
        const response = await orderById({ orderId: Number(orderId) });
        setOrders(response.order);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrderId();
  }, []);

  const back = () => {
    navigate({ to: ROUTES.orders, replace: true });
  };

  return (
    <div>
      <h4 onClick={back}>back</h4>
      <div>
        <h3>{orders?.order?.id}</h3>
        <h3>{orders?.orderStatus?.name}</h3>
      </div>
    </div>
  );
};
