import type { ReactNode } from 'react';

export function SectionHeader({
  title,
  children,
}: {
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mb-4 flex min-h-[36px] w-full items-center justify-between gap-4">
      <h2 className="section-title min-w-0 truncate">{title}</h2>
      {children && (
        <div className="flex shrink-0 items-center gap-1">{children}</div>
      )}
    </div>
  );
}
