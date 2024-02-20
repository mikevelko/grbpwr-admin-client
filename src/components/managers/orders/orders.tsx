import React, { FC, useEffect, useState } from 'react';
import { Layout } from 'components/login/layout';
import { ordersByStatus, orderByEmail } from 'api/orders';
import { getDictionary } from 'api/admin';
import { common_OrderFull, common_OrderStatus, common_OrderStatusEnum } from 'api/proto-http/admin';
import { useNavigate } from '@tanstack/react-location';
import { ROUTES } from 'constants/routes';

export const Orders: FC = () => {
  const [status, setStatus] = useState<common_OrderStatus[] | undefined>([]);
  const [selectedStatus, setSelectedStatus] = useState<common_OrderStatusEnum | undefined>(
    'ORDER_STATUS_ENUM_PLACED',
  );
  const [orders, setOrders] = useState<common_OrderFull[] | undefined>([]);
  const [email, setEmail] = useState<string | undefined>('');
  const navigate = useNavigate();

  const navigateOrderId = (id: number | undefined) => {
    navigate({ to: `${ROUTES.ordersById}?orderId=${id}`, replace: true });
  };

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const response = await getDictionary({});
        setStatus(response.dictionary?.orderStatuses);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDictionary();
  }, []);

  useEffect(() => {
    const defineStatus = async () => {
      setOrders([]); // Clear current orders
      if (!email && selectedStatus) {
        // Check if email is not entered and a status is selected
        try {
          const response = await ordersByStatus({ status: selectedStatus });
          setOrders(response.orders);
        } catch (error) {
          console.error(error);
        }
      }
    };
    defineStatus();
  }, [selectedStatus]);
  console.log(orders?.length);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const statusEnum = status?.find((s) => s.id?.toString() === e.target.value)?.name;
    setSelectedStatus(statusEnum);
  };

  const orderByEmailFunction = async () => {
    try {
      setOrders([]);
      const response = await orderByEmail({ email });
      setOrders(response.orders);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Layout>
      <div>
        <div>
          <h3>filter by status</h3>
          <select onChange={handleStatusChange}>
            <option value=''>select</option>
            {status?.map((s) => (
              <option value={s.id} key={s.id}>
                {s.name?.replace('ORDER_STATUS_ENUM_', '')}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type='button' onClick={orderByEmailFunction}>
            ok
          </button>
        </div>
      </div>

      {orders?.map((order) => (
        <div key={order.order?.id}>
          {order.orderItems?.map((item) => (
            <div
              key={item.id}
              style={{ border: '1px solid black' }}
              onClick={() => navigateOrderId(item.orderId)}
            >
              <h3>{item.orderId}</h3>
              <h3>{order.totalPrice?.value}</h3>
            </div>
          ))}
        </div>
      ))}
    </Layout>
  );
};
