import { Modal as AntModal, type ModalProps as AntModalProps } from 'antd';
import type { JSX } from 'react';

export type ModalProps = Readonly<AntModalProps>;

export function Modal(props: ModalProps): JSX.Element {
  return <AntModal {...props} />;
}
