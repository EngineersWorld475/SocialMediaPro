import { Button, Flex, Textarea } from '@chakra-ui/react';
import React, { useState } from 'react';
import useShowToast from '../hooks/useShowToast';

const Actions = ({ liked, setLiked, postId }) => {
  const [openReply, setOpenReply] = useState(false);
  const [reply, setReply] = useState('');
  const toast = useShowToast();
  const submitReply = async () => {
    try {
      const res = await fetch(`/api/posts/reply/${postId}`, {
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
      toast('Success', data.message, 'success');
      setOpenReply(false);
    } catch (error) {
      toast('Error', error, 'error');
    }
  };
  return (
    <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
      {!openReply ? (
        <>
          <svg
            aria-label="Like"
            color={liked ? 'rgb(237, 73, 86)' : ''}
            fill={liked ? 'rgb(237, 73, 86)' : 'transparent'}
            height="19"
            role="img"
            viewBox="0 0 24 22"
            width="20"
            onClick={() => setLiked(!liked)}
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
