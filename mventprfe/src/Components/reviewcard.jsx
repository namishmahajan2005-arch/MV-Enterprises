function StarRating({ rating }) {
  return (
    <div className="text-yellow-500">
      {"★".repeat(rating)}
      <span className="text-gray-300">
        {"★".repeat(5 - rating)}
      </span>
    </div>
  );
}

export default function ReviewCard({ review }) {
  return (
    <div className="border-b py-4">
      <StarRating rating={review.rating} />
      <p className="mt-1">{review.comment}</p>
      <p className="text-sm text-gray-500">
        — {review.user}
      </p>
    </div>
  );
}