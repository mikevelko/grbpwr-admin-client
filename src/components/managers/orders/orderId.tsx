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
      <table>
        <thead>
          <tr>
            <th>product</th>
            <th>quantity</th>
            <th>size</th>
          </tr>
        </thead>
        <tbody>
          {orders?.orderItems?.map((item) => (
            <tr key={item.orderId}>
              <td>
                <img src={item.thumbnail} alt='' style={{ width: '30px', height: '30px' }} />
              </td>
              <td>{item.orderItem?.quantity}</td>
              <td>{item.orderItem?.sizeId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
