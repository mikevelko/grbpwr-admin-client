import { adminService } from './admin';
import {
  GetOrderByIdRequest,
  GetOrderByIdResponse,
  ListOrdersRequest,
  ListOrdersResponse,
} from './proto-http/admin';

export function getOrdersList(request: ListOrdersRequest): Promise<ListOrdersResponse> {
  return adminService.ListOrders(request);
}

export function getOrderById(request: GetOrderByIdRequest): Promise<GetOrderByIdResponse> {
  return adminService.GetOrderById(request);
}
