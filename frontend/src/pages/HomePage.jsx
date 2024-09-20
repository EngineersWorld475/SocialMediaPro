import { Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import Posts from '../components/Posts';

const HomePage = () => {
  const toast = useShowToast();
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedPosts = async () => {
    try {
      const res = await fetch(`/api/posts/feed-posts`);
      const data = await res.json();
      if (data.error) {
        toast('Error', data.error, 'error');
      } else {
        setFeedPosts(data);
      }
    } catch (error) {
      toast('Error', error, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedPosts();
  }, []);

  return (
    <Flex w={'full'} justifyContent={'center'} p={6}>
      <Flex direction={'column'}>
        {loading ? (
          <h1>Loading...</h1>
        ) : feedPosts.length > 0 ? (
          feedPosts.map((p) => (
            <div key={p?._id}>
              <Posts post={p} />
            </div>
          ))
        ) : (
          <h1>please follow some users for feed posts...</h1>
        )}
      </Flex>
    </Flex>
  );
};

export default HomePage;
