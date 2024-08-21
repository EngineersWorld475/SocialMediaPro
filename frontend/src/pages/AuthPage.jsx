import React from 'react';
import SignupCard from '../components/SignupCard';
import Login from '../components/Login';
import { useRecoilValue } from 'recoil';
import authScreenAtom from '../atoms/authAtom';

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  return <div>{authScreenState === 'login' ? <Login /> : <SignupCard />}</div>;
};

export default AuthPage;
