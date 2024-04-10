import { Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid } from '@mui/x-data-grid';
import { MakeGenerics, useMatch } from '@tanstack/react-location';
import { getDictionary } from 'api/admin';
import { getOrderById } from 'api/orders';
import { common_Dictionary, common_OrderFull } from 'api/proto-http/admin';
import { Layout } from 'components/login/layout';
import { useEffect, useState } from 'react';
import { formatDateTime } from './utility';

// Define the expected params structure
export type OrderDetailsPathProps = MakeGenerics<{
  Params: {
    id: string;
  };
}>;

export const OrderDetails = () => {
  const {
    params: { id },
  } = useMatch<OrderDetailsPathProps>();

  const [orderDetails, setOrderDetails] = useState<common_OrderFull | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [dictionary, setDictionary] = useState<common_Dictionary>();

  const fetchDictionary = async () => {
    const response = await getDictionary({});
    setDictionary(response.dictionary);
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      try {
        const response = await getOrderById({ orderId: parseInt(id) });
        console.log(response.order);
        setOrderDetails(response.order);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
    fetchDictionary();
  }, [id]);

  const orderItemsColumns = [
    {
      field: 'thumbnail',
      headerName: '',
      width: 300,
      renderCell: (params: any) => (
        <img src={params.value} alt='product' style={{ width: '100%', height: 'auto' }} />
      ),
    },
    {
      field: 'productName',
      headerName: 'PRODUCT NAME',
      width: 300,
    },
    {
      field: 'quantity',
      headerName: 'QUANTITY',
      width: 200,
      valueGetter: (_params: any, row: any) => {
        return row.orderItem.quantity;
      },
    },
    {
      field: 'size',
      headerName: 'SIZE',
      width: 200,
      valueGetter: (_params: any, row: any) => {
        return dictionary?.sizes
          ?.find((x) => x.id === row.orderItem.sizeId)
          ?.name?.replace('SIZE_ENUM_', '');
      },
    },
    {
      field: 'productPrice',
      headerName: 'PRICE',
      width: 200,
      valueGetter: (params: any) => `${params} ${dictionary?.baseCurrency}`,
    },
  ];

  if (isLoading)
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </div>
    );

  return (
    <Layout>
      <div style={{ margin: '5% 5%' }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            ORDER ID: {orderDetails?.order?.id}
          </Grid>
          <Grid item xs={3}>
            PLACED: {formatDateTime(orderDetails?.order?.placed)}
          </Grid>
          <Grid item xs={3}>
            MODIFIED: {formatDateTime(orderDetails?.order?.modified)}
          </Grid>
        </Grid>
        <DataGrid
          rows={orderDetails?.orderItems || []}
          columns={orderItemsColumns}
          autoHeight
          rowSelection={false}
          pageSizeOptions={[]}
          sx={{ marginTop: '2rem' }}
        />
      </div>
    </Layout>
  );
};
