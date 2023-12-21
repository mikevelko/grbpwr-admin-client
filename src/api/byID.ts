import { adminService } from './admin';
import {
  UpdateProductNameRequest,
  UpdateProductNameResponse,
  UpdateProductSKURequest,
  UpdateProductSKUResponse,
  UpdateProductPreorderRequest,
  UpdateProductPreorderResponse,
  UpdateProductColorAndColorHexRequest,
  UpdateProductColorAndColorHexResponse,
  UpdateProductCountryOfOriginRequest,
  UpdateProductCountryOfOriginResponse,
  UpdateProductBrandRequest,
  UpdateProductBrandResponse,
  UpdateProductTargetGenderRequest,
  UpdateProductTargetGenderResponse,
  UpdateProductThumbnailRequest,
  UpdateProductThumbnailResponse,
} from './proto-http/admin';

export function updateName(request: UpdateProductNameRequest): Promise<UpdateProductNameResponse> {
  return adminService.UpdateProductName(request);
}

export function updateSku(request: UpdateProductSKURequest): Promise<UpdateProductSKUResponse> {
  return adminService.UpdateProductSKU(request);
}

export function updatePreorder(
  request: UpdateProductPreorderRequest,
): Promise<UpdateProductPreorderResponse> {
  return adminService.UpdateProductPreorder(request);
}

export function updateColors(
  request: UpdateProductColorAndColorHexRequest,
): Promise<UpdateProductColorAndColorHexResponse> {
  return adminService.UpdateProductColorAndColorHex(request);
}

export function updateCountry(
  request: UpdateProductCountryOfOriginRequest,
): Promise<UpdateProductCountryOfOriginResponse> {
  return adminService.UpdateProductCountryOfOrigin(request);
}

export function updateBrand(
  request: UpdateProductBrandRequest,
): Promise<UpdateProductBrandResponse> {
  return adminService.UpdateProductBrand(request);
}

export function updateGender(
  request: UpdateProductTargetGenderRequest,
): Promise<UpdateProductTargetGenderResponse> {
  return adminService.UpdateProductTargetGender(request);
}

export function updateThumbnail(
  request: UpdateProductThumbnailRequest,
): Promise<UpdateProductThumbnailResponse> {
  return adminService.UpdateProductThumbnail(request);
}
