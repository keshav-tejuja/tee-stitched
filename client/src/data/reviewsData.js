export const getReviewsForProduct = (productId) => {
  const hash = productId ? productId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 123;
  const numReviews = 8 + (hash % 5); // 8 to 12 reviews
  
  const positiveReasons = ['Comfort', 'Design', 'Quality'];
  const negativeReasons = ['Fit', 'Delivery'];
  
  const dominantPos = positiveReasons[hash % positiveReasons.length];
  const dominantNeg = negativeReasons[hash % negativeReasons.length];
  
  const reviews = [];
  
  // 4-5 dominant positive reviews
  const numPos = 4 + (hash % 2);
  for (let i = 0; i < numPos; i++) {
    reviews.push({ 
      userId: `Customer${i} A.`, 
      rating: 5, 
      comment: `Absolutely loved it! The ${dominantPos} is perfect.`, 
      reason: dominantPos, 
      createdAt: '1 week ago' 
    });
  }
  
  // 2-3 dominant negative reviews
  const numNeg = 2 + (hash % 2);
  for (let i = 0; i < numNeg; i++) {
    reviews.push({ 
      userId: `Customer${i} B.`, 
      rating: 1 + (i % 2), 
      comment: `Disappointed. The ${dominantNeg} wasn't what I expected.`, 
      reason: dominantNeg, 
      createdAt: '2 weeks ago' 
    });
  }
  
  // Remaining reviews (mixed 3-5 star ratings)
  const remaining = numReviews - numPos - numNeg;
  const mixedReasons = ['Fit', 'Quality', 'Comfort', 'Delivery', 'Design'];
  for (let i = 0; i < remaining; i++) {
    const rReason = mixedReasons[(hash + i) % mixedReasons.length];
    const rating = 3 + ((hash + i) % 3); // 3, 4, or 5
    reviews.push({ 
      userId: `Customer${i} C.`, 
      rating, 
      comment: `Decent product, ${rReason} is pretty good.`, 
      reason: rReason, 
      createdAt: '1 month ago' 
    });
  }
  
  return reviews;
};

// Exporting reviewsData for static mapping requests
export const reviewsData = {
  default: getReviewsForProduct('default_id')
};
