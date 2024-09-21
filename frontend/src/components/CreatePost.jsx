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
import React, { useRef, useState } from 'react';
import usePreviewImg from '../hooks/usePreviewImg';
import { BsFillImageFill } from 'react-icons/bs';
import useShowToast from '../hooks/useShowToast';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

const CreatePost = () => {
  const max_char = 500;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const toast = useShowToast();
  const user = useRecoilValue(userAtom);
  const [postText, setPostText] = useState('');
  const [loading, setLoading] = useState(false);
  const imageRef = useRef(null);
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
        toast('Success', data.message, 'success');
        onClose();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
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
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Write a caption</FormLabel>
              <Textarea
                _placeholder="Post content goes here..."
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
                styles={{ marginLeft: '5px', cursor: 'pointer' }}
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

export default CreatePost;
