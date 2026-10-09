import { Input as AntInput, type InputProps as AntInputProps } from 'antd';
import type { JSX } from 'react';

export type InputProps = Readonly<AntInputProps>;

export function Input(props: InputProps): JSX.Element {
  return <AntInput {...props} />;
}
