// import React, { FC, useEffect, useState } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import { common_ProductFull, GetProductByIDRequest } from "api/proto-http/admin";
// import { getProdById } from "api";

// export const ProductById: FC = () => {
//   const { productId } = useParams<{ productId: string | undefined }>();
//   const [selectedProduct, setSelectedProduct] = useState<common_ProductFull>();

//   useEffect(() => {
//     // Check if productId is defined before proceeding
//     if (productId !== undefined) {
//       // Parse productId as needed (e.g., converting it to a number)
//       const id = parseInt(productId, 10);

//       const requestParams: GetProductByIDRequest = {
//         id: 5,
//       };

//       // Call the Axios request to get the details of the product
//       getProdById(requestParams)
//         .then((data) => {
//           // Handle the data returned from the API
//           setSelectedProduct(data.product);
//         })
//         .catch((error) => {
//           // Handle errors
//           console.error('Error fetching product details:', error);
//         });
//     }
//   }, [productId]);

//   return (
//     <div>
    
//       {selectedProduct && selectedProduct.product && (
//         <h2>{selectedProduct.product.id}</h2>
//       )}
//       <h3>hello</h3>
//     </div>
//   );
// };
