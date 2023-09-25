import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { createAuthClient, LoginRequest, LoginResponse } from './proto-http/auth/index';

import { common_Media, 
        UploadContentImageRequest, 
        UploadContentVideoRequest, 
        createAdminServiceClient, 
        DeleteFromBucketResponse, 
        DeleteFromBucketRequest, 
        common_Order, 
        common_Product,
        common_Price,
        AddProductRequest,
        AddProductResponse 
      } from './proto-http/admin';
import { json } from 'react-router';


const getAuthHeaders = (authToken: string) => ({
  'Grpc-Metadata-Authorization': `Bearer ${authToken}`,
});


export enum MUTATIONS {
  login = 'login',
}

// copy of type inside generated file (no export, need to define explicitly)
type RequestType = {
  path: string;
  method: string;
  body: string | null;
};


export function login(username: string, password: string): Promise<LoginResponse> {
  const authClient = createAuthClient(({ body }: RequestType): Promise<LoginResponse> => {
    return axios
      .post<LoginRequest, AxiosResponse<LoginResponse>>(`${process.env.REACT_APP_API_URL}`, body && JSON.parse(body))
      .then((response) => response.data);
  });

  return authClient.Login({ username, password });

}

// TODO: media section

export function getAllUploadedFiles() {
  const authToken = localStorage.getItem('authToken');

  if (authToken === null) {
    console.error('Auth token is null');
    return Promise.reject('Auth token is null'); 
  }

  axios.defaults.baseURL = 'http://backend.grbpwr.com:8081';

  const authHeaders = getAuthHeaders(authToken);

  axios.defaults.headers.common = { ...axios.defaults.headers.common, ...authHeaders };

  console.log(authToken);
  console.log(axios.defaults.headers.common);

  return axios
    .get('/api/admin/content')
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching uploaded files:', error);
      throw error;
    });
}


export function uploadImage(rawB64Image: string, folder: string, imageName: string): Promise<common_Media> {
  // Retrieve the authentication token from local storage
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    // Handle the case when the authentication token is not available
    alert('lol');
    return Promise.reject(new Error('Authentication token not found'));
  }

  const adminService = createAdminServiceClient(({ body }: RequestType) => {
    return axios
      .post<UploadContentImageRequest, AxiosResponse<common_Media>>(`${process.env.REACT_APP_API_IMG}`, body && JSON.parse(body),
        {
          headers: {
            'Grpc-Metadata-Authorization': `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => response.data);
  });

  return adminService.UploadContentImage({ rawB64Image, folder, imageName });
}

export function uploadVideo(raw: string, folder: string, videoName: string, contentType: string ): Promise<common_Media> {
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    return Promise.reject(new Error('no auth'));
  }

  const adminService = createAdminServiceClient(({ body }: RequestType) => {
    return axios
      .post<UploadContentVideoRequest, AxiosResponse<common_Media>>(`${process.env.REACT_APP_API_V}`, body && JSON.parse(body),
        {
          headers: {
            'Grpc-Metadata-Authorization': `Bearer ${authToken}`,
          },
        }
      )
  });

  return adminService.UploadContentVideo({ raw, folder, videoName, contentType });

}




export function deleteFiles(objectKeys: string[] | undefined) {
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    console.error('Auth token is null');
    return Promise.reject('Auth token is null');
  }

  axios.defaults.baseURL = 'http://backend.grbpwr.com:8081';

  const authHeaders = {
    'Grpc-Metadata-Authorization': `Bearer ${authToken}`,
  };

  axios.defaults.headers.common = { ...axios.defaults.headers.common, ...authHeaders };

  const apiUrl = '/api/admin/content';

  // Construct the query parameters
  const queryParams = objectKeys?.map((key) => `objectKeys=${encodeURIComponent(key)}`).join('&');
  const requestUrl = queryParams ? `${apiUrl}?${queryParams}` : apiUrl;

  console.log(authToken);
  console.log(axios.defaults.headers.common);

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


// TODO: product section

export function addProduct(product: common_Product): Promise<AddProductResponse> {
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    console.error('Auth token is null');
    return Promise.reject('Auth token is null');
  }

  const adminService = createAdminServiceClient(({ body }: RequestType) => {
    try {
      const parsedBody = JSON.parse(body || ''); // Parse the body
      console.log('Request Body:', parsedBody);

      return axios
        .post<AddProductRequest, AxiosResponse<AddProductResponse>>(
          `${process.env.REACT_APP_ADD_PRODUCT}`,
          parsedBody, // Use the parsed body in the request
          {
            headers: {
              'Grpc-Metadata-Authorization': `Bearer ${authToken}`,
            },
          }
        )
        .then((response) => response.data);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return Promise.reject('Error parsing request body');
    }
  });

  return adminService.AddProduct({ product });
}


