import { adminService } from "./admin";
import { AddPromoRequest, AddPromoResponse } from "./proto-http/admin";

export function addPromo(request: AddPromoRequest): Promise<AddPromoResponse> {
    return adminService.AddPromo(request)
}