import { Button, Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import Posts from '../components/Posts';

const HomePage = () => {
  const toast = useShowToast();
  const [feedPosts, setFeedPosts] = useState([]);
  const fetchFeedPosts = async () => {
    try {
      const res = await fetch(`/api/posts/feed-posts`);
      const data = await res.json();
      if (data.error) {
        toast('Error', data.error, 'error');
      }
      setFeedPosts(data);
    } catch (error) {
      toast('Error', error, 'error');
    }
  };

  useEffect(() => {
    fetchFeedPosts();
  }, []);
  return (
    <Link to="/markzuckerberg">
      <Flex w={'full'} justifyContent={'center'} p={6}>
        <Flex direction={'column'}>
          {feedPosts.length > 0 ? (
            feedPosts.map((p) => {
              return (
                <div key={p._id}>
                  <Posts
                    likes={1504}
                    replies={481}
                    postImg={p.img}
                    postTitle={p.text}
                    profilePic={p.postedBy.profilePic}
                    username={p.postedBy.username}
                  />
                </div>
              );
            })
          ) : (
            <h1>please follow some users for feed posts...</h1>
          )}
        </Flex>
      </Flex>
    </Link>
  );
};

export default HomePage;
