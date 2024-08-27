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
import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';

const Comment = ({
  comment,
  createdAt,
  username,
  userAvatar,
  commentId,
  setPost,
  userId,
}) => {
  const params = useParams();
  const toast = useShowToast();
  const onDelete = async () => {
    try {
      const res = await fetch(
        `/api/posts/remove-reply?pid=${params.pid}&cid=${commentId}&uid=${userId}`
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
  return (
    <>
      <Flex gap={4} py={2} my={2} w={'full'}>
        <Avatar src={userAvatar} size={'sm'} />
        <Flex gap={1} w={'full'} flexDirection={'column'}>
          <Flex
            w={'full'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Text fontSize={'sm'} fontWeight={'bold'}>
              {username}
            </Text>
            <Flex gap={2} alignItems={'center'}>
              <Text fontSize={'sm'} color={'gray.500'}>
                {createdAt}
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
          <Text>{comment}</Text>
        </Flex>
      </Flex>
      <Divider />
    </>
  );
};

export default Comment;
