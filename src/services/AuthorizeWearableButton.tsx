'use client'

import { AuthorizeApi } from '../types'
import { toast } from 'react-toastify'

function AuthorizeWearableButton({ scope, name }: AuthorizeApi) {
    const textContent = 'Renew Authorization'

    return (
        <>
            <button
                className="px-8 py-4 bg-palette-300 text-black"
                type="button"
                onClick={async () => {
                    try {
                        if (name.toLowerCase() === 'oura') {
                            const qs = new URLSearchParams({ scope }).toString()
                            window.location.href = `/api/oura/auth?${qs}`
                            return
                        }
                        // Fitbit or others fall back to previous token flow
                        const response = await fetch('/api/fitbit/profile', {
                            method: 'GET',
                        })
                        if (!response.ok) throw new Error('Auth init failed')
                    } catch (e) {
                        toast.error(`Error: ${e}`)
                    }
                }}
            >
                {textContent}
            </button>
        </>
    )
}

export default AuthorizeWearableButton
