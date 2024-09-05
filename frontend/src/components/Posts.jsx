import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Actions from './Actions';

const Posts = ({ postImg, postId, postTitle, profilePic, username, post }) => {
  return (
    <Link to={`/${username}/post/${postId}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={'column'} alignItems={'center'}>
          <Avatar size={'sm'} name={username} src={profilePic} />
          <Box w={'1px'} h={'full'} bg={'gray.light'} my={2}></Box>
          <Box position={'relative'} w={'full'}>
            {post && post.replies && post.replies.length > 0 && (
              <>
                {post.replies.slice(0, 3).map((reply, index) => (
                  <Avatar
                    key={index}
                    size={'xs'}
                    name={reply.username}
                    src={reply.userProfilePic}
                    position={'absolute'}
                    top={index === 0 ? '0px' : undefined}
                    left={
                      index === 1 ? '15px' : index === 2 ? '4px' : undefined
                    }
                    bottom={index === 1 || index === 2 ? '0px' : undefined}
                    right={index === 1 ? '-5px' : undefined}
                    padding={'2px'}
                  />
                ))}
              </>
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={'column'} gap={2}>
          <Flex justifyContent={'space-between'} w={'full'}>
            {/* left side */}
            <Flex w={'full'} alignItems={'center'}>
              <Text fontSize={'sm'} fontWeight={'bold'}>
                {username}
              </Text>
              <Image src={'/verified.png'} w={4} ml={1} />
            </Flex>
            {/* right side */}
            <Flex gap={4} alignItems={'center'}>
              <Text fontSize={'sm'} color={'gray.light'}>
                1d
              </Text>
              <BsThreeDots />
            </Flex>
          </Flex>

          <Text fontSize={'sm'}>{postTitle}</Text>
          {postImg && (
            <Box
              borderRadius={6}
              overflow={'hidden'}
              border={'1px solid'}
              borderColor={'gray.light'}
            >
              <Image src={postImg} w={'full'} />
            </Box>
          )}
          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Posts;
