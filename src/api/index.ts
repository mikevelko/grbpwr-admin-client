import axios, { AxiosResponse } from 'axios';

import { createAuthServiceClient, LoginRequest, LoginResponse } from './proto-http/auth/index';

import {
  UploadContentImageRequest,
  UploadContentVideoRequest,
  createAdminServiceClient,
  DeleteFromBucketResponse,
  // AddProductRequest,
  AddProductResponse,
  GetProductsPagedResponse,
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
  DeleteFromBucketRequest,
} from './proto-http/admin';

type RequestType = {
  path: string;
  method: string;
  body: string | null;
};

export enum MUTATIONS {
  login = 'login',
}

export function login(username: string, password: string): Promise<LoginResponse> {
  const request: LoginRequest = {
    username,
    password,
  };
  return authService.Login(request)
}

export function getAllUploadedFiles(
  request: ListObjectsPagedRequest,
): Promise<ListObjectsPagedResponse> {
  return adminService.ListObjectsPaged(request)
}

export function uploadImage(
  rawB64Image: string,
  folder: string,
  imageName: string,
): Promise<UploadContentImageResponse> {
  const adminService = createAdminServiceClient(({ body }: RequestType) => {
    return axios.post<UploadContentImageRequest, AxiosResponse<UploadContentImageResponse>>(
      `${process.env.REACT_APP_API_IMG}`,
      body && JSON.parse(body),
    );
  });

  return adminService.UploadContentImage({ rawB64Image, folder, imageName });
}

export function uploadVideo(
  raw: string,
  folder: string,
  videoName: string,
  contentType: string,
): Promise<UploadContentVideoResponse> {
  const adminService = createAdminServiceClient(({ body }: RequestType) => {
    return axios.post<UploadContentVideoRequest, AxiosResponse<UploadContentVideoResponse>>(
      `${process.env.REACT_APP_API_V}`,
      body && JSON.parse(body),
    );
  });

  return adminService.UploadContentVideo({ raw, folder, videoName, contentType });
}

export function deleteFiles(request: DeleteFromBucketRequest): Promise<DeleteFromBucketResponse> {
  return adminService.DeleteFromBucket(request)
}

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://backend.grbpwr.com:8081',
  headers: {
    'Content-Type': 'application/json'
  }
});


axiosInstance.interceptors.request.use(config => {
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    config.headers = config.headers || {};
    config.headers['Grpc-Metadata-Authorization'] = `Bearer ${authToken}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

interface AxiosRequestConfig {
  path: string;
  method: string;
  body?: any;
}

const axiosRequestHandler = async ({ path, method, body }: AxiosRequestConfig) => {
  try {
    const response = await axiosInstance({
      method: method as 'GET' | 'POST' | 'PUT' | 'DELETE',
      url: path,
      data: body,
    });
    return response.data;
  } catch (error) {
    console.error('api call error:', error);
    throw error;
  }
};

const adminService = createAdminServiceClient(axiosRequestHandler);
const authService = createAuthServiceClient(axiosRequestHandler)

export function addProduct(product: common_ProductNew): Promise<AddProductResponse> {
  return adminService.AddProduct({ product });
}

export function getProductsPaged({
  limit,
  offset,
  orderFactor,
  sortFactors,
  filterConditions,
  showHidden,
}: GetProductsPagedRequest): Promise<GetProductsPagedResponse> {
  const request: GetProductsPagedRequest = {
    limit,
    offset,
    orderFactor,
    sortFactors,
    filterConditions,
    showHidden
  };

  // Filter out undefined properties
  Object.keys(request).forEach((key) => {
    const typedKey = key as keyof GetProductsPagedRequest;
    if (request[typedKey] === undefined) {
      delete request[typedKey];
    }
  });

  // Making the API call with the constructed request
  return adminService.GetProductsPaged(request);
}

export function getProductByID(request: GetProductByIDRequest): Promise<GetProductByIDResponse> {
  return adminService.GetProductByID(request);
}


export function addMediaByID(request: AddProductMediaRequest): Promise<AddProductMediaResponse> {
  return adminService.AddProductMedia(request);
}

export function deleteProductByID(
  request: DeleteProductByIDRequest,
): Promise<DeleteProductByIDResponse> {
  return adminService.DeleteProductByID(request)
}
