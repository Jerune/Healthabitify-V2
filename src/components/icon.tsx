// Import all React icons that are used in the app here
import {
    RiHeartPulseFill,
    RiBodyScanFill,
    RiHotelBedFill,
    RiRunFill,
    RiLungsFill,
    RiFlashlightFill,
    RiMentalHealthFill,
    RiGobletFill,
    RiStarLine,
    RiStarFill,
} from 'react-icons/ri'
import { SlLogout, SlSettings } from 'react-icons/sl'
import {
    MdOutlineModeEditOutline,
    MdModeEdit,
    MdDashboard,
} from 'react-icons/md'
import { TfiReload, TfiCalendar, TfiClose } from 'react-icons/tfi'
import {
    AiOutlineDoubleRight,
    AiOutlineDoubleLeft,
    AiOutlineLeft,
    AiOutlineRight,
    AiOutlineStop,
} from 'react-icons/ai'
import { ImLab } from 'react-icons/im'
import { GiGoalKeeper } from 'react-icons/gi'
import { BsCaretUpFill, BsCaretDownFill } from 'react-icons/bs'
import { TiEquals } from 'react-icons/ti'
import { FaRing } from 'react-icons/fa'
import { SiFitbit } from 'react-icons/si'
import { IoScaleSharp } from 'react-icons/io5'
import { IconProps, IconMapping } from './_types'

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
}

// Returns an icon from the above React icons mapping using the icon name as iconId
export default function Icon({ iconId }: IconProps) {
    if (iconId !== undefined && typeof iconId === 'string') {
        const ReactIcon = iconMapping[iconId]
        return <ReactIcon />
    }

    return <RiHeartPulseFill />
}
