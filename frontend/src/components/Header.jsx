import { Flex, useColorMode } from '@chakra-ui/react';
import React from 'react';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex justifyContent={'center'} mt={6} mb="12">
      <img
        style={{ cursor: 'pointer' }}
        alt="logo"
        width={20}
        src={colorMode === 'dark' ? '/light-logo.svg' : '/dark-logo.svg'}
        onClick={toggleColorMode}
      />
    </Flex>
  );
};

export default Header;
