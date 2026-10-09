import { Select as AntSelect, type SelectProps as AntSelectProps } from 'antd';
import type { JSX } from 'react';

export type SelectProps<T extends string | number> = Readonly<
  AntSelectProps<T>
>;

export function Select<T extends string | number>(
  props: SelectProps<T>,
): JSX.Element {
  return <AntSelect<T> {...props} />;
}
