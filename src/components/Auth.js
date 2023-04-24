import { auth, provider } from '../firebase-config.js';
import { signInWithPopup } from 'firebase/auth';

import '../styles/auth.scss';

export const Auth = (props) => {
  const { setIsAuth } = props;
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem('auth-token', result.user.refreshToken);
      setIsAuth(true);
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="auth">
      <p>Sign In With Google To Continue</p>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
  )
}