import {
  Popover as AntPopover,
  type PopoverProps as AntPopoverProps,
} from 'antd';
import type { JSX } from 'react';

export type PopoverProps = Readonly<AntPopoverProps>;

export function Popover(props: PopoverProps): JSX.Element {
  return <AntPopover {...props} />;
}
