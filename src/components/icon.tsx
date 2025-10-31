// Import all React icons that are used in the app here
import {
  AiOutlineDoubleLeft,
  AiOutlineDoubleRight,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineStop,
} from 'react-icons/ai';
import { BsCaretDownFill, BsCaretUpFill } from 'react-icons/bs';
import { FaBurn, FaRing } from 'react-icons/fa';
import {
  GiBrokenHeartZone,
  GiDeathZone,
  GiFireZone,
  GiGoalKeeper,
  GiTennisBall,
} from 'react-icons/gi';
import { ImLab } from 'react-icons/im';
import { IoFootstepsSharp, IoScaleSharp } from 'react-icons/io5';
import {
  MdDashboard,
  MdModeEdit,
  MdOutlineModeEditOutline,
} from 'react-icons/md';
import {
  RiBodyScanFill,
  RiFlashlightFill,
  RiGobletFill,
  RiHeartPulseFill,
  RiHotelBedFill,
  RiLungsFill,
  RiMentalHealthFill,
  RiRunFill,
  RiStarFill,
  RiStarLine,
} from 'react-icons/ri';
import { RxLapTimer, RxTimer } from 'react-icons/rx';
import { SiFitbit } from 'react-icons/si';
import { SlLogout, SlSettings } from 'react-icons/sl';
import { TfiCalendar, TfiClose, TfiReload } from 'react-icons/tfi';
import { TiEquals } from 'react-icons/ti';

import { IconMapping, IconProps } from './_types';

// Add all imported icons to the mapping below
const iconMapping: IconMapping = {
  RiHeartPulseFill,
  RiBodyScanFill,
  RiHotelBedFill,
  RiLungsFill,
  RiRunFill,
  RiFlashlightFill,
  RiMentalHealthFill,
  RiGobletFill,
  RiStarLine,
  RiStarFill,
  SlLogout,
  SlSettings,
  MdOutlineModeEditOutline,
  MdModeEdit,
  MdDashboard,
  TfiReload,
  AiOutlineDoubleRight,
  AiOutlineDoubleLeft,
  ImLab,
  GiGoalKeeper,
  BsCaretUpFill,
  BsCaretDownFill,
  TiEquals,
  FaRing,
  SiFitbit,
  IoScaleSharp,
  TfiCalendar,
  AiOutlineLeft,
  AiOutlineRight,
  TfiClose,
  AiOutlineStop,
  GiTennisBall,
  FaBurn,
  GiDeathZone,
  GiBrokenHeartZone,
  GiFireZone,
  IoFootstepsSharp,
  RxTimer,
  RxLapTimer,
};

// Returns an icon from the above React icons mapping using the icon name as iconId
export default function Icon({ iconId }: IconProps) {
  if (iconId !== undefined && typeof iconId === 'string') {
    const ReactIcon = iconMapping[iconId];
    return <ReactIcon />;
  }

  return <RiHeartPulseFill />;
}
