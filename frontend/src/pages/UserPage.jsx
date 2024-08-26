import React from 'react';
import UserHeader from '../components/UserHeader';
import UserPost from '../components/UserPost';

const UserPage = () => {
  return (
    <>
      <UserHeader />
      <UserPost
        likes={1504}
        replies={481}
        postImg={'/post1.png'}
        postTitle={`Let's talk about threads.`}
      />
      <UserPost
        likes={4972}
        replies={343}
        postImg={'/post2.png'}
        postTitle={`Jump in. This is great`}
      />
      <UserPost
        likes={1597}
        replies={11}
        postImg={'/post3.png'}
        postTitle={`If you are afraid, don't do it. if you are doing it, don't be afraid`}
      />
      <UserPost
        likes={3331}
        replies={45}
        postTitle={`This is my firt thread`}
      />
    </>
  );
};

export default UserPage;
