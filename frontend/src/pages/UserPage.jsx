import React, { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import UserPost from '../components/UserPost';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';

const UserPage = () => {
  const [userProfile, setUserProfile] = useState({});
  const [user, setUser] = useRecoilState(userAtom);
  const toast = useShowToast();
  const { username } = useParams();
  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`/api/users/profile/${username}`);
      const data = await res.json();

      if (res.ok) {
        setUserProfile(data);
      } else {
        toast('Error', data.error, 'error');
        return;
      }
    } catch (error) {
      toast('Error', error, 'error');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [username]);
  console.log(userProfile);
  return (
    <>
      <UserHeader user={userProfile} />
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
