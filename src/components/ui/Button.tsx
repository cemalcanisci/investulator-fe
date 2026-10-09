import { Button as AntButton, type ButtonProps as AntButtonProps } from 'antd';
import type { JSX } from 'react';

export type ButtonProps = Readonly<AntButtonProps>;

export function Button(props: ButtonProps): JSX.Element {
  return <AntButton {...props} />;
}
