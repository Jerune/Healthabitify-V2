'use client';

import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import logo from '../assets/logo_1b.jpg';
import LogoText from '../components/LogoText';
import { auth } from '../firebase/firebase';
import { localSignIn } from '../redux/reducers/usersReducer';
import { useAppDispatch } from '../redux/reduxHooks';
import type { FormSubmit, InputEvent, SignInData } from '../types';
import { capitalizeFirstLetterFromArray } from '../utils/capitalizeFirstLetter';
const IntroVideo = '/videos/login_video_alt.webm';
const IntroVideoMP4 = '/videos/login_video_alt.mp4';

function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const rememberCheckbox = useRef<HTMLInputElement>(null);
  const [errorIsShowing, setErrorIsShowing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    errorMessage: '',
  });

  function handleChange(event: InputEvent) {
    if (errorIsShowing) setErrorIsShowing(false);
    setFormData(prevformData => {
      return {
        ...prevformData,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function handleSubmit(event: FormSubmit) {
    event.preventDefault();
    let SignInDbResponse: SignInData = {
      email: '',
      userId: '',
      errorMessage: '',
    };
    // Set Firebase Auth persistence based on "Stay logged in" checkbox
    await setPersistence(
      auth,
      rememberCheckbox.current?.checked
        ? browserLocalPersistence
        : browserSessionPersistence
    );
    await signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then(userCredential => {
        // Signed in
        const { user } = userCredential;
        SignInDbResponse = {
          ...SignInDbResponse,
          email: user.email,
          userId: user.uid,
        };
      })
      .catch(error => {
        const errorMessage = error.code;
        SignInDbResponse = {
          ...SignInDbResponse,
          errorMessage,
        };
      });

    if (SignInDbResponse.userId) {
      dispatch(
        localSignIn({
          email: SignInDbResponse.email,
          userId: SignInDbResponse.userId,
        })
      );
      setFormData({
        email: '',
        password: '',
        errorMessage: '',
      });
      router.push('/dashboard');
    } else if (SignInDbResponse.errorMessage) {
      const errorMessageArray = SignInDbResponse.errorMessage
        .split('/')[1]
        .split('-');
      const errorMessageCapitalized =
        capitalizeFirstLetterFromArray(errorMessageArray);
      setFormData({
        ...formData,
        errorMessage: errorMessageCapitalized,
      });
      setErrorIsShowing(true);
    }
  }

  return (
    <div className='h-screen w-screen overflow-hidden'>
      <video
        className='w-auto min-h-full h-full max-w-screen-md object-cover md:w-full md:max-w-[100%]'
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={IntroVideo} type='video/webm' />
        <source src={IntroVideoMP4} type='video/mp4' />
      </video>
      <section className='w-screen h-screen z-50 fixed top-0 left-0 right-0 flex flex-col justify-center items-center'>
        <div className='w-80 h-16 flex flex-row items-center rounded-t-lg bg-palette-600'>
          <div className='h-16 w-16'>
            <Image
              className='rounded-t-lg'
              src={logo}
              alt='Healthabitify logo'
            />
          </div>
          <LogoText />
        </div>
        <div className='mx-auto w-80 bg-white opacity-90 p-6 rounded-b-lg'>
          <form className='space-y-5' onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor='email'
                className='mb-1 block text-sm font-medium text-gray-700'
              >
                Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                className='block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500'
                placeholder='you@email.com'
                onChange={handleChange}
                value={formData.email}
                required
              />
            </div>
            <div>
              <label
                htmlFor='password'
                className='mb-1 block text-sm font-medium text-gray-700'
              >
                Password
              </label>
              <input
                type='password'
                id='password'
                name='password'
                className='block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500'
                placeholder='Password'
                onChange={handleChange}
                value={formData.password}
                required
              />
            </div>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='stay-logged-in'
                className='h-4 w-4 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400'
                ref={rememberCheckbox}
              />
              <label
                htmlFor='stay-logged-in'
                className='text-sm font-medium text-gray-700'
              >
                Stay logged in
              </label>
            </div>
            <button
              type='submit'
              className='w-full rounded-lg bg-palette-500 opacity-70 hover:italic hover:opacity-100 hover:font-bold hover:transition-all px-5 py-2.5 text-center text-base font-medium text-white shadow-sm '
            >
              Submit
            </button>
            {errorIsShowing && (
              <p className='text-red-500 text-sm'>{formData.errorMessage}</p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;
