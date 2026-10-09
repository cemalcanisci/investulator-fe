import { StyleProvider } from '@ant-design/cssinjs';
import {
  ConfigProvider as AntConfigProvider,
  type ConfigProviderProps as AntConfigProviderProps,
} from 'antd';
import type { JSX } from 'react';

export type ConfigProviderProps = Readonly<AntConfigProviderProps>;

// antd's styles go into their own CSS layer (`antd`, ordered in index.css). Unlayered CSS beats
// every layered rule, so without this antd's global styles (e.g. link color) would override
// Tailwind utilities on elements inside antd popups such as Drawer and Popover.
export function ConfigProvider(props: ConfigProviderProps): JSX.Element {
  return (
    <StyleProvider layer>
      <AntConfigProvider {...props} />
    </StyleProvider>
  );
}
