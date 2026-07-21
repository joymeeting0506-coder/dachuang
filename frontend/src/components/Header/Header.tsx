import Logo from './Logo';
import ActionButtons from './ActionButtons';

export default function Header() {
  return (
    <header className="h-14 bg-cream-50 border-b border-[#E8DDD0] flex items-center justify-between px-6 shrink-0 select-none">
      <Logo />
      <ActionButtons />
    </header>
  );
}
