import { Button } from '@chakra-ui/react';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from '../hooks/useShowToast';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await fetch(`/api/users/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(null);
        localStorage.removeItem('user-threads');
        navigate('/auth');
      } else {
        showToast('Error', data.error, 'error');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      position={'fixed'}
      bottom={'10px'}
      left={'30px'}
      size={'sm'}
      onClick={handleLogout}
    >
      <FiLogOut size={20} />
    </Button>
  );
};

export default LogoutButton;
