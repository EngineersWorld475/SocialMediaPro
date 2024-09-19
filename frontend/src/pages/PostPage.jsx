import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BsAlexa, BsThreeDots } from 'react-icons/bs';
import Actions from '../components/Actions';
import Comment from '../components/Comment';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';

const PostPage = () => {
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState([]);
  const [post, setPost] = useState([]);
  const toast = useShowToast();
  const params = useParams();
  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/users/profile/${params.username}`);
      const data = await res.json();
      if (data.error) {
        toast('Error', data.error, 'error');
        return;
      }
      setUser(data);
    } catch (error) {
      toast('Error', error, 'error');
    }
  };
  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/get-post?postId=${params.pid}`);
      const data = await res.json();
      if (data.error) {
        toast('Error', data.error, 'error');
      }
      setPost(data);
    } catch (error) {
      toast('Error', error, 'error');
    }
  };
  useEffect(() => {
    fetchUser();
  }, [params.username]);

  useEffect(() => {
    fetchPost();
  }, [params.pid]);

  return (
    <>
      <Flex>
        {/* left side */}
        <Flex w={'full'} alignItems={'center'} gap={3}>
          <Avatar src={user.profilePic} name="mark Zuckerberg" />
          <Flex>
            <Text fontSize={'sm'} fontWeight={'bold'}>
              {user.username}
            </Text>
            <Image src="/verified.png" w={4} h={4} />
          </Flex>
        </Flex>
        {/* right side */}
        <Flex gap={4} alignItems={'center'}>
          <Text fontSize={'md'} color={'gray.light'}>
            1d
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>
      <Text my={3}>{post.text}</Text>
      <Box
        borderRadius={6}
        overflow={'hidden'}
        border={'1px solid'}
        borderColor={'gray.light'}
      >
        <Image src={post.img} w={'full'} />
      </Box>
      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>

      <Flex gap={2} alignItems={'center'}>
        <Text color={'gray.light'} fontSize={'sm'}>
          {post && post.replies && post.replies.length} replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
        <Text color={'gray.light'} fontSize={'sm'}>
          {post && post.likes && post.likes.length + (liked ? 1 : 0)} likes
        </Text>
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text fontSize={'2xl'}>
            <BsAlexa />
          </Text>
          <Text color={'gray.light'}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />

      {post &&
        post.replies &&
        post.replies.map((reply) => {
          return (
            <Comment
              key={reply._id}
              comment={reply.text}
              createdAt={'2d'}
              likes={100}
              username={reply.username}
              userAvatar={reply.userProfilePic}
            />
          );
        })}
    </>
  );
};

export default PostPage;
