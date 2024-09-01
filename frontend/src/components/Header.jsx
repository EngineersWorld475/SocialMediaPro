import { Avatar, Flex, Link, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import userAtom from '../atoms/userAtom';
import { AiFillHome } from 'react-icons/ai';
import { useRecoilValue } from 'recoil';
const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  return (
    <Flex justifyContent={'space-between'} mt={6} mb="12">
      {user && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>
      )}
      {user && (
        <img
          style={{ cursor: 'pointer' }}
          alt="logo"
          width={20}
          src={colorMode === 'dark' ? '/light-logo.svg' : '/dark-logo.svg'}
          onClick={toggleColorMode}
        />
      )}
      {user && (
        <Link as={RouterLink} to={`/${user.username}`}>
          <Avatar
            name={user.username}
            src={user.profilePic}
            size={{
              base: 'sm',
              md: 'sm',
            }}
          />
        </Link>
      )}
    </Flex>
  );
};

export default Header;
