import React, { useRef, useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  Center,
} from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import usePreviewImg from '../hooks/usePreviewImg';
import useShowToast from '../hooks/useShowToast';

const UpdateProfilePage = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const toast = useShowToast();
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    password: '',
    email: user.email,
    bio: user.bio,
    profilePic: user.profilePic,
  });
  const { handleImageChange, imgUrl } = usePreviewImg();
  const fileRef = useRef(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, profilePic: imgUrl }),
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        setLoading(false);
        toast('Error', data.error, 'error');
        return;
      }
      setLoading(false);
      toast('Success', 'Profile updated successfully', 'success');
      setUser(data);
      localStorage.setItem('user-threads', JSON.stringify(data));
    } catch (error) {
      toast('Error', error.message, 'error');
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Flex align={'center'} justify={'center'}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.dark')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size="xl" src={imgUrl || user.profilePic} />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Avatar
                </Button>
              </Center>
              <Input
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={handleImageChange}
                hidden
              />
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="David luis"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              value={formData.name}
            />
          </FormControl>
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="davidluis"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              value={formData.username}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="davidluis@example.com"
              _placeholder={{ color: 'gray.500' }}
              type="email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              value={formData.email}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Your Bio..."
              _placeholder={{ color: 'gray.500' }}
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              value={formData.bio}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="********"
              _placeholder={{ color: 'gray.500' }}
              type="password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              value={formData.password}
              disabled
            />
          </FormControl>
          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              bg={'green.700'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'blue.500',
              }}
              type="submit"
            >
              {loading ? 'loading...' : 'Submit'}
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
};

export default UpdateProfilePage;
