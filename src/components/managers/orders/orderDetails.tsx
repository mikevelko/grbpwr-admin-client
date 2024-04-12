import LaunchIcon from '@mui/icons-material/Launch';
import { Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import { DataGrid, GridCallbackDetails, GridPaginationModel } from '@mui/x-data-grid';
import { MakeGenerics, useMatch, useNavigate } from '@tanstack/react-location';
import { getDictionary } from 'api/admin';
import { getOrderById } from 'api/orders';
import { common_Dictionary, common_OrderFull } from 'api/proto-http/admin';
import { Layout } from 'components/login/layout';
import { ROUTES } from 'constants/routes';
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
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(1);

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

  const navigate = useNavigate();

  const orderItemsColumns = [
    {
      field: 'thumbnail',
      headerName: '',
      width: 300,
      renderCell: (params: any) => (
        <img src={params.value} alt='product' style={{ height: '100px', width: 'auto' }} />
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
      valueGetter: (params: any, row: any) =>
        `${params * row.orderItem.quantity} ${dictionary?.baseCurrency}`,
    },
    {
      field: 'productLink',
      headerName: 'LINK',
      width: 100,
      valueGetter: (_params: any, row: any) => {
        return row.orderItem.productId;
      },
      renderCell: (params: any) => (
        <IconButton
          aria-label='explore product'
          onClick={() => {
            navigate({ to: `${ROUTES.singleProduct}/${params.value}` });
          }}
        >
          <LaunchIcon />
        </IconButton>
      ),
    },
  ];

  const onPaginationChange = (model: GridPaginationModel, details: GridCallbackDetails) => {
    setPage(model.page);
    setPageSize(model.pageSize);
  };

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
          rowSelection={false}
          paginationModel={{ page: page, pageSize: pageSize }}
          onPaginationModelChange={onPaginationChange}
          pageSizeOptions={[1, 5, 10]}
          sx={{ marginTop: '2rem' }}
          rowHeight={100}
        />
      </div>
    </Layout>
  );
};
