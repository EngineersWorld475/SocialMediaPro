import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { BsInstagram } from 'react-icons/bs';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { CgMoreO } from 'react-icons/cg';
import useShowToast from '../hooks/useShowToast';

const UserHeader = ({ user }) => {
  const currentUser = useRecoilValue(userAtom);
  const toast = useShowToast();

  const [following, setFollowing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleFollowOrUnfollow = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        if (following) {
          user.followers.pop(); // simulate removing from followers
        } else {
          user.followers.push(currentUser._id); // simulates adding to followers
        }
        setFollowing(!following);
      } else {
        toast('Error', data.error, 'error');
      }
    } catch (error) {
      toast('Error', error, 'error');
    } finally {
      setUpdating(false);
    }
  };

  const copyUrl = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({ description: 'Copied' });
    });
  };

  useEffect(() => {
    if (user && currentUser) {
      setFollowing(user.followers && user.followers.includes(currentUser._id));
    }
  }, [user, currentUser]);
  console.log(following);

  return (
    <VStack gap={4} alignItems={'start'}>
      <Flex justifyContent={'space-between'} width={'full'}>
        <Box>
          <Text fontSize={'2xl'} fontWeight={'bold'}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={'center'}>
            <Text fontSize={'sm'}>{user.username}</Text>
            <Text
              fontSize={'xs'}
              bg={'gray.dark'}
              color={'gray.light'}
              p={1}
              borderRadius={'full'}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            name={user.username}
            src={user.profilePic}
            size={{
              base: 'md',
              md: 'xl',
            }}
          />
        </Box>
      </Flex>
      <Text>{user.bio}</Text>
      {currentUser._id === user._id && (
        <Link as={RouterLink} to="/update-profile">
          <Button size={'sm'}>Update profile</Button>
        </Link>
      )}
      {currentUser._id !== user._id && (
        <Button
          bg={'blue.600'}
          size={'sm'}
          onClick={handleFollowOrUnfollow}
          isLoading={updating}
        >
          {following ? 'Unfollow' : 'Follow'}
        </Button>
      )}
      <Flex w={'full'} justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text color={'gray.light'}>
            {user && user.followers && user.followers.length}{' '}
            {`${
              user && user.followers && user.followers.length <= 1
                ? 'follower'
                : 'followers'
            }  `}
          </Text>
          <Box w={1} h={1} bg={'gray.light'} borderRadius={'full'}></Box>
          <Link color={'gray.light'}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={'pointer'} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={'pointer'} />
              </MenuButton>
              <Portal>
                <MenuList bg={'gray.dark'}>
                  <MenuItem bg={'gray.dark'} onClick={copyUrl}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={'full'}>
        <Flex
          flex={1}
          borderBottom={'1.5px solid white'}
          justifyContent={'center'}
          pb="3"
          cursor={'pointer'}
        >
          <Text fontWeight={'bold'}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={'1px solid gray'}
          justifyContent={'center'}
          color={'gray.light'}
          pb="3"
          cursor={'pointer'}
        >
          <Text fontWeight={'bold'}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
