'use client';

import { usePathname, useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect, useState } from 'react';

import CheckIfUserIsAuthenticated from '../firebase/authentication/isUserAuthenticated';
import { useAppDispatch, useAppSelector } from '../redux/reduxHooks';

function AuthGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(state => state.user.isLoggedIn);

  const [hasCheckedFirebase, setHasCheckedFirebase] = useState(false);
  const isLoginPage = pathname === '/';

  useEffect(() => {
    const checkAuthentication = async () => {
      // First check: Redux state
      if (isLoggedIn) {
        if (isLoginPage) {
          router.push('/dashboard');
        }
        return;
      }

      // Second check: Firebase authentication (only if not already checked)
      if (!hasCheckedFirebase) {
        setHasCheckedFirebase(true);
        try {
          await CheckIfUserIsAuthenticated(dispatch);
        } catch (error) {
          console.error('Error checking Firebase authentication:', error);
        }
        return;
      }

      if (!isLoginPage) {
        router.push('/');
      }
    };

    checkAuthentication();
  }, [isLoggedIn, isLoginPage, hasCheckedFirebase, dispatch, router]);

  // Only render children if user is authenticated or on login page
  if (isLoggedIn || isLoginPage) {
    return <>{children}</>;
  }

  // Show nothing if user is not authenticated and not on login page
  return null;
}

export default AuthGuard;
