'use client'

import { signOut } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth } from '../firebase/firebase'
import { useAppDispatch, useAppSelector } from '../redux/reduxHooks'
import {
    toggleManualDataGrid,
    toggleMenu,
} from '../redux/reducers/utilsReducer'
import logo from '../assets/logo_1b.jpg'
import { localSignOut } from '../redux/reducers/usersReducer'
import Icon from './icon'
import LogoText from './LogoText'
import getCategories from '../firebase/firestore/getCategories'
import { Category } from '../types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

function HeaderNav() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const sideNavOpen = useAppSelector((state) => state.utils.sideNavOpen)
    const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn)
    const manualDataGridOpen = useAppSelector(
        (state) => state.utils.manualDataGridOpen
    )
    const [categories, setCategories] = useState<Category[]>([])
    const sideNavClasses = sideNavOpen ? 'open' : ''
    const sideNavIcon = sideNavOpen ? (
        <Icon iconId="AiOutlineDoubleLeft" />
    ) : (
        <Icon iconId="AiOutlineDoubleRight" />
    )

    useEffect(() => {
        async function initCategories() {
            const categoriesList = await getCategories()
            setCategories(categoriesList)
        }

        initCategories()
    }, [])

    const menuCategories = categories.map((category) => {
        return (
            <Link
                href={`/data/${category.name.toLowerCase()}`}
                key={category.name}
                className="flex flex-row items-center gap-3 py-2"
                onClick={() => dispatch(toggleMenu())}
            >
                <button type="button" className="text-xl">
                    <Icon iconId={category.iconName} />
                </button>
                <span className="text-lg">{category.name}</span>
            </Link>
        )
    })

    function signOutUser() {
        signOut(auth).then(() => {
            dispatch(localSignOut())
            router.push('/')
        })
    }

    return (
        <>
            <header className="flex flex-row fixed top-0 justify-between items-center h-12 w-full bg-palette-600 text-white border-b border-solid border-palette-600 z-20">
                <div className="flex flex-row items-center">
                    <Link href="/">
                        <Image
                            className="h-12 w-16"
                            src={logo}
                            alt="Healthability logo"
                        />
                    </Link>
                    <LogoText />
                    {isLoggedIn && (
                        <button
                            type="button"
                            className="ml-4 md:ml-20 mt-2 text-base"
                            onClick={() => dispatch(toggleMenu())}
                        >
                            {sideNavIcon}
                        </button>
                    )}
                </div>
                {isLoggedIn && (
                    <section className="flex flex-row md:gap-6 md:mr-8 text-lg gap-4 mr-6">
                        <button
                            type="button"
                            className="cursor-pointer"
                            onClick={() => dispatch(toggleManualDataGrid())}
                        >
                            {manualDataGridOpen ? (
                                <Icon iconId="MdOutlineModeEditOutline" />
                            ) : (
                                <Icon iconId="MdModeEdit" />
                            )}
                        </button>
                        <Link href="/settings">
                            <Icon iconId="SlSettings" />
                        </Link>
                        <button
                            type="button"
                            className="cursor-pointer"
                            onClick={() => window.location.reload()}
                        >
                            <Icon iconId="TfiReload" />
                        </button>
                        <button
                            type="button"
                            className="cursor-pointer"
                            onClick={signOutUser}
                        >
                            <Icon iconId="SlLogout" />
                        </button>
                    </section>
                )}
            </header>
            <div className="h-12 w-full" />
            <nav
                className={`w-screen overflow-scroll md:w-auto h-screen flex flex-col fixed top-12 left-0 pb-14 py-5 pl-6 pr-14 bg-white shadow-lg z-50 ${sideNavClasses}`}
            >
                <Link
                    href="/"
                    className="flex flex-row items-center gap-3 py-2"
                    onClick={() => dispatch(toggleMenu())}
                >
                    <button type="button" className="text-xl">
                        <Icon iconId="MdDashboard" />
                    </button>
                    <span className="text-lg">Dashboard</span>
                </Link>
                <div>{menuCategories}</div>
                <div className="mt-6">
                    <Link
                        href="/labs"
                        className="flex flex-row items-center gap-3 py-2"
                        onClick={() => dispatch(toggleMenu())}
                    >
                        <Icon iconId="ImLab" />
                        <span className="text-base">Labs</span>
                    </Link>
                    <Link
                        href="/settings"
                        className="flex flex-row items-center gap-3 py-2"
                        onClick={() => dispatch(toggleMenu())}
                    >
                        <Icon iconId="SlSettings" />
                        <span className="text-base">Settings</span>
                    </Link>
                </div>
            </nav>
        </>
    )
}

export default HeaderNav
