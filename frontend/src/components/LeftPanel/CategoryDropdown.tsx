import { useAppStore } from '../../store/useAppStore';
import { CATEGORIES } from '../../store/constants';
import type { Category } from '../../store/types';

export default function CategoryDropdown() {
  const category = useAppStore((s) => s.params.category);
  const setParams = useAppStore((s) => s.setParams);

  return (
    <div>
      <label className="control-label">非遗类别</label>
      <select
        className="select-custom"
        value={category}
        onChange={(e) => setParams({ category: e.target.value as Category })}
      >
        {CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
    </div>
  );
}
