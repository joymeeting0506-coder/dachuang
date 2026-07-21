export default function StarRating({ rating, onChange }: { rating: number; onChange: (r: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className="cursor-pointer transition-all duration-150 hover:scale-110"
          onClick={() => onChange(star === rating ? 0 : star)}
          title={`${star} 星`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={star <= rating ? '#C9A96E' : 'none'}
            stroke={star <= rating ? '#B8944F' : '#D4CEBF'}
            strokeWidth="1.5"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
      {rating > 0 && (
        <span className="text-xs text-gold-500 ml-1 font-medium">{rating} / 5</span>
      )}
    </div>
  );
}
