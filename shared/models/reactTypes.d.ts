export interface childrenProps {
  children: ReactChild | ReactChildren;
}
export interface titleProps extends childrenProps {
  hr?: boolean;
}
export interface objectOfStringsNumberType {
  id: string;
  value: string | number;
  label: string;
  [key: string]: string | number | boolean;
}

interface dataTableElementType {
  [key: string]: string;
}
interface objectOfBooleanType {
  [key: string]: boolean;
}
interface dataTableType {
  rows: dataTableElementType[];
  title: string;
}
