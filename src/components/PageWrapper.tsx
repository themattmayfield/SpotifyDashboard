import type { ReactNode } from 'react';

type TReactNode = {
  children: ReactNode;
};
export const PageWrapper = ({ children }: TReactNode) => (
  <div className="w-full xl:max-w-[2000px] xl:mx-auto px-2 md:px-4 no-scrollbar overflow-x-hidden">
    {children}
  </div>
);
