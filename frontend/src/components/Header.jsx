import {
  Avatar,
  Button,
  Flex,
  Input,
  Link,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import userAtom from '../atoms/userAtom';
import { AiFillHome, AiOutlineSearch } from 'react-icons/ai'; // Import search icon
import { useRecoilState, useRecoilValue } from 'recoil';
import searchAtom from '../atoms/searchAtom';
import useShowToast from '../hooks/useShowToast';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const [searchedItem, setSearchedItem] = useRecoilState(searchAtom);
  const toast = useShowToast();
  const navigate = useNavigate();

  const fetchSearchedUsers = async () => {
    try {
      const res = await fetch(`/api/users/search-user/${searchedItem.keyword}`);
      const data = await res.json();
      if (data.error) {
        toast('Error', data.error, 'error');
      }
      setSearchedItem({
        ...searchedItem,
        result: data,
      });
      navigate('/searched-users');
    } catch (error) {
      toast('Error', error, 'error');
    }
  };
  return (
    <Flex
      justifyContent={'space-between'}
      alignItems={'center'}
      mt={6}
      mb={12}
      px={4}
    >
      {user && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>
      )}

      {user && (
        <Flex alignItems={'center'} w={{ base: '60%', md: '40%' }} maxW="400px">
          <Input
            _placeholder={{ color: 'gray.500' }}
            placeholder="Search..."
            value={searchedItem.keyword}
            onChange={(e) =>
              setSearchedItem({ ...searchedItem, keyword: e.target.value })
            }
            mr={2}
          />
          <Button
            onClick={fetchSearchedUsers}
            bg={useColorModeValue('blue.500', 'gray.900')}
            size="sm"
          >
            <AiOutlineSearch />
          </Button>
        </Flex>
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
            size={{ base: 'sm', md: 'sm' }}
          />
        </Link>
      )}
    </Flex>
  );
};

export default Header;
