import React, { useEffect, useRef, useState } from 'react';
import UserHeader from '../components/UserHeader';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import usePreviewImg from '../hooks/usePreviewImg';
import { BsFillImageFill } from 'react-icons/bs';
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Posts from '../components/Posts';

const UserPage = () => {
  const [userProfile, setUserProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const toast = useShowToast();
  const { username } = useParams();
  const user = useRecoilValue(userAtom);
  const [postText, setPostText] = useState('');
  const [loading, setLoading] = useState(false);
  const imageRef = useRef(null);
  const max_char = 500;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const [remainingChar, setRemainingChar] = useState(max_char);

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > max_char) {
      const truncatedText = inputText.slice(0, max_char);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(max_char - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          img: imgUrl,
        }),
      });
      const data = await res.json();
      if (data.error) {
        toast('Error', data.error, 'error');
      } else {
        fetchPosts();
        toast('Success', data.message, 'success');
        setPostText('');
        setImgUrl('');
        onClose();
      }
    } catch (error) {
      toast('Error', error.message || 'An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`/api/users/profile/${username}`);
      const data = await res.json();
      if (res.ok) {
        setUserProfile(data);
      } else {
        toast('Error', data.error, 'error');
      }
    } catch (error) {
      toast('Error', error.message || 'An unexpected error occurred', 'error');
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/posts/get-post?userId=${userProfile._id}`);
      const data = await res.json();
      if (data.error) {
        toast('Error', data.error, 'error');
      } else {
        setPosts(data);
      }
    } catch (error) {
      toast('Error', error.message || 'An unexpected error occurred', 'error');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  useEffect(() => {
    if (userProfile._id) {
      fetchPosts();
    }
  }, [userProfile._id]);
  return (
    <>
      <UserHeader user={userProfile} />
      {posts.length > 0 ? (
        posts.map((p) => (
          <Posts
            key={p._id} // Assuming each post has a unique _id
            likes={1504}
            replies={481}
            postImg={p.img}
            postTitle={p.text}
            profilePic={p.postedBy.profilePic}
            username={p.postedBy.username}
          />
        ))
      ) : (
        <Text>No posts available</Text>
      )}
      <Button
        position={'fixed'}
        bottom={'10px'}
        right={'10px'}
        leftIcon={<AddIcon />}
        bg={useColorModeValue('gray.300', 'gray.dark')}
        onClick={onOpen}
      >
        Post
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a New Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Write a caption</FormLabel>
              <Textarea
                placeholder="Post content goes here..."
                onChange={handleTextChange}
                value={postText}
                mb={'10px'}
              />
              <Text
                fontSize={'xs'}
                fontWeight={'bold'}
                textAlign={'right'}
                m={1}
                color={'gray.800'}
              >
                {remainingChar}/{max_char}
              </Text>
              <Input
                type={'file'}
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />
              <BsFillImageFill
                style={{ marginLeft: '5px', cursor: 'pointer' }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>
            {imgUrl && (
              <Flex mt={5} w={'full'} position={'relative'}>
                <Image src={imgUrl} alt={'selected image'} />
                <CloseButton
                  onClick={() => setImgUrl('')}
                  bg={'gray.800'}
                  position={'absolute'}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserPage;
