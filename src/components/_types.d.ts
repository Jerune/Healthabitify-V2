// Imports
import { IconType } from 'react-icons'

// Icons

export type IconMapping = {
    [iconName: string]: IconType
}

export type IconProps = {
    iconId: string | unknown
}

// Loading
export type LoadingProps = {
    size: number
}