import {
  Segmented as AntSegmented,
  type SegmentedProps as AntSegmentedProps,
} from 'antd';
import type { JSX } from 'react';

export type SegmentedProps<T extends string | number> = Readonly<
  AntSegmentedProps<T>
>;

export function Segmented<T extends string | number>(
  props: SegmentedProps<T>,
): JSX.Element {
  return <AntSegmented<T> {...props} />;
}
