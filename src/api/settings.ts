import { adminService } from "./admin";
import { SetShipmentCarrierAllowanceRequest, SetShipmentCarrierAllowanceResponse, SetPaymentMethodAllowanceRequest, SetPaymentMethodAllowanceResponse, SetShipmentCarrierPriceRequest, SetShipmentCarrierPriceResponse } from "./proto-http/admin";

export function setShipmentCarrier(request: SetShipmentCarrierAllowanceRequest): Promise<SetShipmentCarrierAllowanceResponse> {
    return adminService.SetShipmentCarrierAllowance(request)
}

export function setPaymentMethod(request: SetPaymentMethodAllowanceRequest): Promise<SetPaymentMethodAllowanceResponse> {
    return adminService.SetPaymentMethodAllowance(request)
}

export function setShipmentCarrierPrice(request: SetShipmentCarrierPriceRequest): Promise<SetShipmentCarrierPriceResponse> {
    return adminService.SetShipmentCarrierPrice(request)
}


