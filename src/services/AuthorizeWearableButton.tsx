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
                        // Fitbit OAuth flow
                        const qs = new URLSearchParams({ scope: 'activity heartrate nutrition sleep weight' }).toString()
                        window.location.href = `/api/fitbit/auth?${qs}`
                        return
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
