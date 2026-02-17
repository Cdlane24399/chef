import { memo } from 'react';
import type { JSX } from 'react';

export const genericMemo: <T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>>(
  component: T,
  propsAreEqual?: (prevProps: React.ComponentProps<T>, nextProps: React.ComponentProps<T>) => boolean,
) => T & { displayName?: string } = memo;
