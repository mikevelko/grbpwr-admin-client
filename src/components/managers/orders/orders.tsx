import React, { FC, useEffect, useState } from 'react';
import { Layout } from 'components/login/layout';
import { ordersByStatus, orderByEmail } from 'api/orders';
import { getDictionary } from 'api/admin';
import { common_OrderFull, common_OrderStatus, common_OrderStatusEnum } from 'api/proto-http/admin';
import { useNavigate } from '@tanstack/react-location';
import { ROUTES } from 'constants/routes';
import styles from 'styles/order.scss';

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
      <div className={styles.order_main}>
        <div className={styles.order_by}>
          <div className={styles.filter_status}>
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
          <div className={styles.filter_email}>
            <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type='button' onClick={orderByEmailFunction}>
              ok
            </button>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Payment Received</th>
              <th>Payment Method</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {orders?.flatMap((order) =>
              order.orderItems?.map((item) => (
                <tr key={item.orderId} onClick={() => navigateOrderId(item.orderId)}>
                  <td>{item.orderId}</td>
                  <td>{order.modified}</td>
                  <td>{order.payment?.modifiedAt}</td>
                  <td>{order.paymentMethod?.name?.replace('PAYMENT_METHOD_NAME_ENUM_', '')}</td>
                  <td>{order.totalPrice?.value}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
