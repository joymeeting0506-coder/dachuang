import { useAppStore } from '../../store/useAppStore';
import ImageCard from './ImageCard';

export default function ResultGrid() {
  const generatedImages = useAppStore((s) => s.generatedImages);
  const count = generatedImages.length;

  const gridClass =
    count === 1 ? 'grid-cols-1 max-w-md mx-auto' :
    count === 2 ? 'grid-cols-2 max-w-2xl' :
    count === 3 ? 'grid-cols-2 max-w-2xl' :
    'grid-cols-2 max-w-2xl'; // 4 = 2x2

  return (
    <div className={`grid ${gridClass} gap-4 p-4 animate-fade-slide-in`}>
      {generatedImages.map((img) => (
        <ImageCard key={img.id} imageId={img.id} />
      ))}
    </div>
  );
}
