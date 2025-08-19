import type { PropsWithChildren } from 'react'

function SettingsMenuContainer({ children }: PropsWithChildren) {
    return (
        <div className="flex flex-row justify-start w-screen h-full">
            {children}
        </div>
    )
}

export default SettingsMenuContainer
