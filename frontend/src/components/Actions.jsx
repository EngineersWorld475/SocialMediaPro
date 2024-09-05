import { Box, Button, Flex, Text, Textarea } from '@chakra-ui/react';
import React, { useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import userAtom from '../atoms/userAtom';
import { useRecoilValue } from 'recoil';

const Actions = ({ post: post_ }) => {
  const user = useRecoilValue(userAtom);
  const [openReply, setOpenReply] = useState(false);
  const [reply, setReply] = useState('');
  const [liked, setLiked] = useState(post_?.likes?.includes(user?._id));
  const [post, setPost] = useState(post_);
  const toast = useShowToast();
  const submitReply = async () => {
    try {
      const res = await fetch(`/api/posts/reply/${post_._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: reply,
        }),
      });
      const data = await res.json();
      if (data.error) {
        toast('Error', data.error, 'error');
      }
      setPost({ ...post, replies: [...post.replies, reply] });
      toast('Success', data.message, 'success');
      setOpenReply(false);
    } catch (error) {
      toast('Error', error, 'error');
    }
  };

  const handleLikeOrUnlike = async () => {
    try {
      const res = await fetch(`/api/posts/like/${post_._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.error) {
        toast('Error', data.error, 'error');
      }
      if (!liked) {
        setPost({ ...post, likes: [...post.likes, user._id] });
      } else {
        setPost({
          ...post,
          likes: post.likes.filter((id) => id !== user._id),
        });
      }
      setLiked(!liked);
    } catch (error) {
      toast('Error', error, 'error');
    }
  };
  return (
    <Flex
      flexDirection={'column'}
      gap={3}
      my={2}
      onClick={(e) => e.preventDefault()}
    >
      {!openReply ? (
        <>
          <Flex flexDirection={'row'} gap={4}>
            <svg
              aria-label="Like"
              color={liked ? 'rgb(237, 73, 86)' : ''}
              fill={liked ? 'rgb(237, 73, 86)' : 'transparent'}
              height="19"
              role="img"
              viewBox="0 0 24 22"
              width="20"
              onClick={handleLikeOrUnlike}
            >
              <path
                d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
                stroke="currentColor"
                strokeWidth="2"
              ></path>
            </svg>

            <svg
              aria-label="Comment"
              color=""
              fill=""
              height="20"
              role="img"
              viewBox="0 0 24 24"
              width="20"
              onClick={() => setOpenReply(true)}
            >
              <title>Comment</title>
              <path
                d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
          </Flex>
          <Flex gap={2} alignItems={'center'}>
            <Text color={'gray.light'} fontSize={'sm'}>
              {post?.likes?.length} likes
            </Text>
            <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
            <Text color={'gray.light'} fontSize={'sm'}>
              {post?.replies?.length} replies
            </Text>
          </Flex>
        </>
      ) : (
        <Flex direction={'column'} position={'relative'}>
          <Textarea
            placeholder="Write a comment..."
            onChange={(e) => setReply(e.target.value)}
          />
          <Flex direction={'row'} justify={'flex-end'} marginTop={'4px'}>
            <Button size={'xs'} onClick={() => setOpenReply(false)}>
              Cancel
            </Button>
            <Button size={'xs'} marginLeft={'2px'} onClick={submitReply}>
              Submit
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default Actions;
