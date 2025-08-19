'use client'

import { AuthorizeApi } from '../types'

function AuthorizeWearableButton({ scope, name }: AuthorizeApi) {
    const textContent = 'Renew Authorization'

    const handleAuth = () => {
        try {
            // Oura OAuth flow
            if (name.toLowerCase() === 'oura') {
                const qs = new URLSearchParams({ scope }).toString()
                window.open(`/api/oura/auth?${qs}`, '_blank')
                return
            }
            
            // Fitbit OAuth flow
            const qs = new URLSearchParams({ scope: 'activity heartrate nutrition sleep weight' }).toString()
            window.open(`/api/fitbit/auth?${qs}`, '_blank')
        } catch (e) {
            console.error('Authorization error:', e)
        }
    }

    return (
        <>
            <button
                className="px-8 py-4 bg-palette-300 text-black"
                type="button"
                onClick={handleAuth}
            >
                {textContent}
            </button>
        </>
    )
}

export default AuthorizeWearableButton
