// import React, { ChangeEvent } from 'react';

// export const main = () => {
//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     onChange(e.target.value);
//   };
//   return (
//     <div>
//       <label htmlFor='thhumbnail'>main</label>
//       <div>
//         <button type='button' onClick={handleThumbnail}>
//           by url
//         </button>
//         {thumbnailInput && (
//           <div>
//             <input
//               type='text'
//               name='contentLink'
//               value={value}
//               onChange={(e) => setNewAdUrl(e.target.value)}
//             />
//             <button type='button' onClick={handleAddByUrl}>
//               Add by URL
//             </button>
//           </div>
//         )}
//       </div>
//       <div>
//         <button type='button' onClick={handleViewAll}>
//           Media Selector
//         </button>
//       </div>
//       {showMediaSelector && (
//         <div>
//           <ul>
//             {filesUrl.map((url, index) => (
//               <li key={index}>
//                 <input
//                   type='checkbox'
//                   checked={selectedImage.includes(url)}
//                   onChange={() => select(url)}
//                   id={`${index}`}
//                   style={{ display: 'none' }}
//                 />
//                 <label htmlFor={`${index}`}>
//                   {selectedImage.includes(url) ? (
//                     <span>{selectedImage.indexOf(url) + 1}</span>
//                   ) : null}
//                   <img
//                     key={index}
//                     src={url}
//                     alt={url}
//                     style={{ width: '100px', height: '100px' }}
//                   />
//                   {selectedImage.includes(url) && (
//                     <input
//                       type='text'
//                       placeholder='Explore Text'
//                       value={exploreTextMap[url] || ''}
//                       onChange={(e) => handleExploreTextChange(url, e.target.value)}
//                     />
//                   )}
//                 </label>
//               </li>
//             ))}
//           </ul>
//           <div>
//             <button type='button' onClick={handleAddToAds}>
//               add
//             </button>
//           </div>
//         </div>
//       )}
//       <button type='button' onClick={addNewHero}>
//         ok
//       </button>
//     </div>
//   );
// };
