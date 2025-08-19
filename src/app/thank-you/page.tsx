'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ThankYouPage() {
  const router = useRouter()

  useEffect(() => {
    // If this page is opened in a new tab (from OAuth callback)
    // Send a message to the opener and close this tab
    if (window.opener) {
      // Send success message to the original tab
      window.opener.postMessage({ type: 'AUTH_SUCCESS' }, window.location.origin)
      
      // Close this tab after a short delay
      setTimeout(() => {
        window.close()
      }, 500)
    }
  }, [])

  // If opened in a new tab, show closing message
  if (window.opener) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authorization Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for authorizing access to your wearable data. Your account has been successfully connected.
          </p>
          
          <div className="text-sm text-gray-500 mb-4">
            Closing tab and redirecting to main app...
          </div>
          
          <div className="mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Authorization Successful!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for authorizing access to your wearable data. Your account has been successfully connected.
        </p>
        
        <div className="text-sm text-gray-500 mb-4">
          {window.opener ? 'Closing tab and redirecting to main app...' : 'Authorization completed successfully!'}
        </div>
        
        <button
          onClick={() => {
            if (window.opener) {
              window.close()
            } else {
              router.push('/dashboard')
            }
          }}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {window.opener ? 'Close Tab' : 'Go to Dashboard'}
        </button>
      </div>
    </div>
  )
}
