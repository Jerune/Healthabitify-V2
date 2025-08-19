import type { PropsWithChildren } from 'react'

function DashBoardContainer({ children }: PropsWithChildren) {
    return (
        <div className="grid justify-center justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 py-8 px-10 xl:px-20 gap-8 w-full ">
            {children}
        </div>
    )
}

export default DashBoardContainer
