import axios, { AxiosResponse } from 'axios';



// export function addProduct(product: common_ProductNew): Promise<AddProductResponse> {
//     return adminService.AddProduct({ product });
// }

// export function getProductsPaged({
//     limit,
//     offset,
//     orderFactor,
//     sortFactors,
//     filterConditions,
//     showHidden,
// }: GetProductsPagedRequest): Promise<GetProductsPagedResponse> {
//     const request: GetProductsPagedRequest = {
//         limit,
//         offset,
//         orderFactor,
//         sortFactors,
//         filterConditions,
//         showHidden
//     };

//     // Filter out undefined properties
//     Object.keys(request).forEach((key) => {
//         const typedKey = key as keyof GetProductsPagedRequest;
//         if (request[typedKey] === undefined) {
//             delete request[typedKey];
//         }
//     });

//     // Making the API call with the constructed request
//     return adminService.GetProductsPaged(request);
// }

// export function getProductByID(request: GetProductByIDRequest): Promise<GetProductByIDResponse> {
//     return adminService.GetProductByID(request);
// }


// export function addMediaByID(request: AddProductMediaRequest): Promise<AddProductMediaResponse> {
//     return adminService.AddProductMedia(request);
// }

// export function deleteProductByID(
//     request: DeleteProductByIDRequest,
// ): Promise<DeleteProductByIDResponse> {
//     return adminService.DeleteProductByID(request)
// }
