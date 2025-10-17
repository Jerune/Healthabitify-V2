import { onAuthStateChanged } from 'firebase/auth';

import { localSignIn } from '../../redux/reducers/usersReducer';
import { AppDispatch } from '../../redux/store';
import { auth } from '../firebase';

function CheckIfUserIsAuthenticated(dispatch: AppDispatch): Promise<void> {
  return new Promise(resolve => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        dispatch(localSignIn({ email: user.email, userId: user.uid }));
      }
      // Unsubscribe after first check to avoid multiple calls
      unsubscribe();
      resolve();
    });
  });
}

export default CheckIfUserIsAuthenticated;
