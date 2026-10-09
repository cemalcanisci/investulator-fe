import { Switch as AntSwitch, type SwitchProps as AntSwitchProps } from 'antd';
import type { JSX } from 'react';

export type SwitchProps = Readonly<AntSwitchProps>;

export function Switch(props: SwitchProps): JSX.Element {
  return <AntSwitch {...props} />;
}
