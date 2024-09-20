import {
  Avatar,
  Divider,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';

const Comment = ({ reply, setPost }) => {
  const [user, setUser] = useState([]);
  const params = useParams();
  const toast = useShowToast();
  const onDelete = async () => {
    try {
      const res = await fetch(
        `/api/posts/remove-reply?pid=${params.pid}&cid=${reply?._id}&uid=${reply?.userId}`
      );
      const data = await res.json();
      if (data.error) {
        toast('Error', data.error, 'error');
        return;
      }
      setPost((prevPost) => ({ ...prevPost, replies: [...data.replies] }));
      toast('Success', data.message, 'success');
    } catch (error) {
      toast('Error', error, 'error');
    }
  };

  const getUser = async () => {
    try {
      const res = await fetch(`/api/users/get-user/${reply?.userId}`);
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      }
    } catch (error) {
      toast('Error', error, 'error');
    }
  };

  useEffect(() => {
    getUser();
  }, [reply?.userId]);
  console.log(user);
  return (
    <>
      <Flex gap={4} py={2} my={2} w={'full'}>
        <Avatar src={user?.profilePic} size={'sm'} />
        <Flex gap={1} w={'full'} flexDirection={'column'}>
          <Flex
            w={'full'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Text fontSize={'sm'} fontWeight={'bold'}>
              {user?.username}
            </Text>
            <Flex gap={2} alignItems={'center'}>
              <Text fontSize={'sm'} color={'gray.500'}>
                2d
              </Text>
              <Menu>
                <MenuButton as={Flex} alignItems={'center'} cursor={'pointer'}>
                  <BsThreeDots />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={onDelete}>Delete</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>
          <Text>{reply?.text}</Text>
        </Flex>
      </Flex>
      <Divider />
    </>
  );
};

export default Comment;
