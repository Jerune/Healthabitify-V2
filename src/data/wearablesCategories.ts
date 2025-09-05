import { FitbitLogo, OuraLogo, PolarLogo } from '../assets/Logos';
import { WearablesData } from '../components/_types';

const wearablesCategories: WearablesData[] = [
  {
    id: 'oura',
    name: 'Oura',
    iconName: OuraLogo,
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    iconName: FitbitLogo,
  },
  {
    id: 'polar',
    name: 'Polar',
    iconName: PolarLogo,
  },
];

export default wearablesCategories;
