import {
  AutoComplete as AntAutoComplete,
  type AutoCompleteProps as AntAutoCompleteProps,
} from 'antd';
import type { JSX } from 'react';

export type AutoCompleteProps = Readonly<AntAutoCompleteProps>;

export function AutoComplete(props: AutoCompleteProps): JSX.Element {
  return <AntAutoComplete {...props} />;
}
