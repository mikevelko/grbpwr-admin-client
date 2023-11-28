import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

import { createAuthServiceClient, LoginRequest, LoginResponse } from './proto-http/auth/index';

import {
  UploadContentImageRequest,
  UploadContentVideoRequest,
  createAdminServiceClient,
  AddProductRequest,
  AddProductResponse,
  common_ProductNew,
  GetProductsPagedRequest,
  GetProductByIDRequest,
  GetProductByIDResponse,
  common_ProductFull,
  ListObjectsPagedRequest,
  ListObjectsPagedResponse,
  UploadContentImageResponse,
  UploadContentVideoResponse,
  AddProductMediaRequest,
  AddProductMediaResponse,
  DeleteProductByIDRequest,
  DeleteProductByIDResponse,

} from './proto-http/admin';

type RequestType = {
  path: string;
  method: string;
  body: string | null;
};

export enum MUTATIONS {
  login = 'login',
}

axios.defaults.baseURL = 'http://backend.grbpwr.com:8081';


axios.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      console.log(authToken);
      config.headers = config.headers || {};
      config.headers['Grpc-Metadata-Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export function login(username: string, password: string): Promise<LoginResponse> {
  const authClient = createAuthServiceClient(({ body }: RequestType): Promise<LoginResponse> => {
    return axios
      .post<LoginRequest, AxiosResponse<LoginResponse>>(`${process.env.REACT_APP_API_URL}`, body && JSON.parse(body))
      .then((response) => response.data);
  });

  return authClient.Login({ username, password });

}

export function getAllUploadedFiles(request: ListObjectsPagedRequest): Promise<ListObjectsPagedResponse> {

  const apiRequest ={
    limit: request.limit,
    offset: request.offset,
    order: request.orderFactor
  }

  const endPoint = 'api/admin/content'

  return axios
    .get(endPoint, {params: apiRequest})
    .then((response) => response.data as ListObjectsPagedResponse)
    .catch((error) => {
      console.error('Error fetching uploaded files:', error);
      throw error;
    });
}


export function uploadImage(rawB64Image: string, folder: string, imageName: string): Promise<UploadContentImageResponse> {

  const adminService = createAdminServiceClient(({ body }: RequestType) => {
    return axios.post<UploadContentImageRequest, AxiosResponse<UploadContentImageResponse>>(
      `${process.env.REACT_APP_API_IMG}`, body && JSON.parse(body),
    );
  });

  return adminService.UploadContentImage({ rawB64Image, folder, imageName });
}


export function uploadVideo(raw: string, folder: string, videoName: string, contentType: string ): Promise<UploadContentVideoResponse> {

  const adminService = createAdminServiceClient(({ body }: RequestType) => {
    return axios
      .post<UploadContentVideoRequest, AxiosResponse<UploadContentVideoResponse>>(`${process.env.REACT_APP_API_V}`, body && JSON.parse(body),
      )
  });

  return adminService.UploadContentVideo({ raw, folder, videoName, contentType });

}

// TODO: try to generate delete request in gpt
export function deleteFiles(objectKeys: string[] | undefined) {

  const apiUrl = '/api/admin/content';

  const queryParams = objectKeys?.map((key) => `objectKeys=${encodeURIComponent(key)}`).join('&');
  const requestUrl = queryParams ? `${apiUrl}?${queryParams}` : apiUrl;


  return axios
    .delete(requestUrl)
    .then((response) => {
      if (response.status === 200) {
  console.log('Successfully deleted objects');
      } else {
  console.error('Failed to delete objects');
      }
    })
    .catch((error) => {
      console.error('Error deleting objects:', error);
      throw error;
    });
}


export function addProduct(product: common_ProductNew): Promise<AddProductResponse> {

  const adminService = createAdminServiceClient(({ body }: RequestType) => {
    try {
      const parsedBody = JSON.parse(body || ''); // Parse the body
      console.log('Request Body:', parsedBody);

      return axios
  .post<AddProductRequest, AxiosResponse<AddProductResponse>>(
    `${process.env.REACT_APP_ADD_PRODUCT}`,
    parsedBody,
  )
  .then((response) => response.data);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return Promise.reject('Error parsing request body');
    }
  });

  return adminService.AddProduct({product});
}


export function getProductsPaged({
  limit,
  offset,
  orderFactor,
  sortFactors,
  filterConditions,
  showHidden,
}: GetProductsPagedRequest) {

  const queryParams: Record<string, string | string[]> = {};

  if (sortFactors) {
    queryParams.sortFactors = sortFactors.map((x) => encodeURIComponent(x.toString()));
  }

  if (filterConditions) {
    const {
      priceFromTo,
      onSale,
      color,
      categoryId,
      sizesIds,
      preorder,
      byTag,
    } = filterConditions;

    if (priceFromTo?.from) {
      queryParams['filterConditions.priceFromTo.from'] = encodeURIComponent(
  priceFromTo.from.toString()
      );
    }

    if (priceFromTo?.to) {
      queryParams['filterConditions.priceFromTo.to'] = encodeURIComponent(
  priceFromTo.to.toString()
      );
    }

    if (onSale !== undefined) {
      queryParams['filterConditions.onSale'] = encodeURIComponent(onSale.toString());
    }

    if (color) {
      queryParams['filterConditions.color'] = encodeURIComponent(color.toString());
    }

    if (categoryId) {
      queryParams['filterConditions.categoryId'] = encodeURIComponent(
  categoryId.toString()
      );
    }

    if (sizesIds) {
      queryParams['filterConditions.sizesIds'] = sizesIds.map((x) =>
  encodeURIComponent(x.toString())
      );
    }

    if (preorder !== undefined) {
      queryParams['filterConditions.preorder'] = encodeURIComponent(
  preorder.toString()
      );
    }

    if (byTag) {
      queryParams['filterConditions.byTag'] = encodeURIComponent(byTag.toString());
    }
  }

    if (showHidden) {
      queryParams.showHidden = encodeURIComponent(showHidden.toString());
    }

  const url = `/api/admin/product/paged/${limit}/${offset}/${orderFactor}`;

  return axios
    .get(url, { params: queryParams })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching products:', error);
      throw error;
    });
}

export function getProductByID(request: GetProductByIDRequest): Promise<GetProductByIDResponse> {

  const axiosConfig: AxiosRequestConfig = {
    method: 'GET',
    url: `/api/admin/product/${request.id}`,
  };

  return axios(axiosConfig)
    .then((response) => {
      const product: common_ProductFull = response.data.product;
      return { product };
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

// export function getProductByID(request: GetProductByIDRequest): Promise<GetProductByIDResponse> {
//   const authToken = localStorage.getItem('authToken');

//   if (!authToken) {
//     return Promise.reject(new Error('no auth'));
//   }

//   const adminService = createAdminServiceClient(({ path, method }: RequestType) => {
//     const axiosConfig: AxiosRequestConfig = {
//       method,
//       url: `api/admin/product/${request.id}`,
//       headers: {
//         'Grpc-Metadata-Authorization': `Bearer ${authToken}`,
//       },
//     };

//     return axios(axiosConfig);
//   });

//   return adminService.GetProductByID(request);
// }

export function addMediaByID(request: AddProductMediaRequest): Promise<AddProductMediaResponse> {
  const { productId, ...rest } = request;

  const apiUrl = `${process.env.REACT_APP_ADD_MEDIA_BY_ID}`.replace('{productId}', productId?.toString() || '');

  const adminService = createAdminServiceClient(({ body }: RequestType) => {
    return axios
      .post<AddProductMediaRequest, AxiosResponse<AddProductMediaResponse>>(apiUrl, body && JSON.parse(body))
      .then((response) => {
        console.log('Response:', response);
        return response.data;
      })
      .catch((error) => {
        console.error('Error:', error);
        throw error;
      });
  });

  return adminService.AddProductMedia(request);
}


export function deleteProductByID(request: DeleteProductByIDRequest): Promise<DeleteProductByIDResponse> {
  const {id, ...rest} = request;

  const apiUrl = `http://backend.grbpwr.com:8081/api/admin/product/${id}`;

  return axios
    .delete(apiUrl)
    .then(response => response.data as DeleteProductByIDResponse)
    .catch(error => {
      throw error;
  });
}








