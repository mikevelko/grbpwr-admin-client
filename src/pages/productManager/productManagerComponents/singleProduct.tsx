// import React, { FC, useEffect, useState } from "react";
// import { useParams } from "react-router";
// import { common_ProductFull, GetProductByIDRequest } from "api/proto-http/admin";
// import { getProdById } from "api";
// import { Layout } from "components/layout";
// import { useNavigate } from "@tanstack/react-location";
// import { ROUTES } from "constants/routes";


// export const ProductDetails: FC = () => {
//     const { productId } = useParams(); // Get the productId from the URL
//     const [product, setProduct] = useState<common_ProductFull | null>(null);
  
//     useEffect(() => {
//         console.log('hui')
//         console.log("productId:", productId);
//       const fetchData = async () => {
//         try {
//           const response = await getProdById({ id: productId } as GetProductByIDRequest);
//           setProduct(response.product);
//         } catch (error) {
//           console.error('Error fetching product details:', error);
//         }
//       };
  
//       fetchData();
//     }, [productId]);
  
//     return (
//       <Layout>
//         <h1>hello</h1>
//         {product ? (
//           <div>
//             <h2>{product.product?.productInsert?.name}</h2>
//             {/* Display other product details as needed */}
//           </div>
//         ) : (
//           <p>Loading...</p>
//         )}
//       </Layout>
//     );
//   };
