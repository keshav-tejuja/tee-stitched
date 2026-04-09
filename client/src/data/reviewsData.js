export const reviewPool = [
  { userId: 'Alex P.', rating: 5, comment: 'Amazing fit and quality. Best t-shirt I own.', reason: 'Fit', createdAt: '2 days ago' },
  { userId: 'Sanya K.', rating: 4, comment: 'Fabric is good but delivery was a day late.', reason: 'Delivery', createdAt: '1 week ago' },
  { userId: 'Ritesh V.', rating: 5, comment: 'Super comfortable all day long.', reason: 'Comfort', createdAt: '1 week ago' },
  { userId: 'Dev D.', rating: 2, comment: 'A bit tight around the shoulders for my liking.', reason: 'Fit', createdAt: '2 weeks ago' },
  { userId: 'Anita V.', rating: 5, comment: 'Love the minimalist design!', reason: 'Design', createdAt: '2 weeks ago' },
  { userId: 'Priya M.', rating: 4, comment: 'Good quality, very soft feel.', reason: 'Quality', createdAt: '3 weeks ago' },
  { userId: 'John S.', rating: 3, comment: 'Decent, but I expected more from the fabric.', reason: 'Quality', createdAt: '3 weeks ago' },
  { userId: 'Sarah T.', rating: 2, comment: 'Stitching quality could be slightly better.', reason: 'Quality', createdAt: '1 month ago' },
  { userId: 'Amit J.', rating: 4, comment: 'Nice fit, looks great.', reason: 'Fit', createdAt: '2 months ago' },
  { userId: 'Kavita R.', rating: 5, comment: 'Fast delivery and excellent packaging.', reason: 'Delivery', createdAt: '2 months ago' },
  { userId: 'Manu P.', rating: 1, comment: 'Terrible fit, very uncomfortable.', reason: 'Fit', createdAt: '2 months ago' },
  { userId: 'Jasprit B.', rating: 5, comment: 'Absolutely amazing design.', reason: 'Design', createdAt: '2 months ago' },
  { userId: 'Suresh N.', rating: 4, comment: 'Good comfort, recommend it.', reason: 'Comfort', createdAt: '3 months ago' },
  { userId: 'Neetu K.', rating: 2, comment: 'Colors faded quickly.', reason: 'Quality', createdAt: '3 months ago' },
  { userId: 'Rajesh G.', rating: 5, comment: 'Perfect fit! Highly recommend.', reason: 'Fit', createdAt: '3 months ago' },
  { userId: 'Tina L.', rating: 2, comment: 'Delayed delivery, ruined my plans.', reason: 'Delivery', createdAt: '4 months ago' },
  { userId: 'Vijay R.', rating: 5, comment: 'Incredible feeling fabric.', reason: 'Quality', createdAt: '4 months ago' },
  { userId: 'Meera M.', rating: 4, comment: 'Slightly tight but looks nice.', reason: 'Fit', createdAt: '5 months ago' },
  { userId: 'Oscar D.', rating: 5, comment: 'Top tier comfort.', reason: 'Comfort', createdAt: '5 months ago' },
  { userId: 'Lily W.', rating: 1, comment: 'The design print faded after one wash.', reason: 'Design', createdAt: '6 months ago' },
  { userId: 'Rahul S.', rating: 5, comment: 'My go-to store for custom designs!', reason: 'Design', createdAt: '6 months ago' },
  { userId: 'Vikram C.', rating: 4, comment: 'Comfortable, delivery was fine.', reason: 'Comfort', createdAt: '7 months ago' }
];

// Raw reviewsData map object structure for potential static mapping
export const reviewsData = {
  default: reviewPool.slice(0, 10)
};

// Expose a consistent dynamic mapping so every product gets 8-12 reviews
export const getReviewsForProduct = (productId) => {
  if (!productId) return reviewsData.default;
  
  // Deterministically generate a subset based on productId hash
  const hash = productId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const count = 8 + (hash % 5); // 8 to 12 reviews
  
  // Calculate start index to slice a window of reviews
  const maxStartIndex = reviewPool.length - count;
  const startIndex = hash % maxStartIndex;
  
  return reviewPool.slice(startIndex, startIndex + count);
};
