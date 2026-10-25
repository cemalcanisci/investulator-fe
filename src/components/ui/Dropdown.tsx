import { Dropdown as AntDropdown, type DropdownProps } from 'antd';
import type { JSX } from 'react';
export function Dropdown(props: Readonly<DropdownProps>): JSX.Element {
  return <AntDropdown {...props} />;
}
