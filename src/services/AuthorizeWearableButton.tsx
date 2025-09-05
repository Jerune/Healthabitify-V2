'use client';

import { AuthorizeApi } from '../types';

function AuthorizeWearableButton({ scope, name }: AuthorizeApi) {
  const textContent = 'Renew Authorization';

  const handleAuth = () => {
    try {
      const path = `/api/${name}/auth`;
      const params = new URLSearchParams({ scope }).toString();
      const url = params ? `${path}?${params}` : path;
      window.open(url, '_blank');
    } catch (e) {
      console.error('Authorization error:', e);
    }
  };

  return (
    <>
      <button
        className='px-8 py-4 bg-palette-300 text-black'
        type='button'
        onClick={handleAuth}
      >
        {textContent}
      </button>
    </>
  );
}

export default AuthorizeWearableButton;
