import { IconType } from 'react-icons';

export type CategoryData = {
  id: string;
  name: string;
  iconName: string | React.Component;
};

export type WearablesData = {
  id: string;
  name: string;
  iconName: JSX.Element;
};

// Icons

export type IconMapping = {
  [iconName: string]: IconType;
};

export type IconProps = {
  iconId: string | unknown;
};
