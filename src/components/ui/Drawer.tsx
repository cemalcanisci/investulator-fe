import { Drawer as AntDrawer, type DrawerProps as AntDrawerProps } from 'antd';
import type { JSX } from 'react';

export type DrawerProps = Readonly<AntDrawerProps>;

export function Drawer(props: DrawerProps): JSX.Element {
  return <AntDrawer {...props} />;
}
