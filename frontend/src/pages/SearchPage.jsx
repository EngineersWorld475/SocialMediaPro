import React from 'react';
import { Avatar, Box, Container, Flex, Stack, Text } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import searchAtom from '../atoms/searchAtom';
import { Link } from 'react-router-dom';

const SearchPage = () => {
  const users = useRecoilValue(searchAtom);

  return (
    <Container maxW="container.md" p={4}>
      <Text mb={6}>Search Results...</Text>
      <Stack spacing={4}>
        {users &&
          users.result &&
          users.result.map((user) => (
            <Box key={user._id}>
              <Link to={`/${user.username}`}>
                <Flex direction="row" align="center" gap={6}>
                  <Avatar size="sm" src={user.profilePic} alt={user.username} />
                  <Flex direction={'column'}>
                    <Text fontWeight="bold">{user.username}</Text>
                    <Text fontSize={'sm'} fontWeight={'thin'} color="gray.600">
                      {user.name}
                    </Text>
                  </Flex>
                </Flex>
              </Link>
            </Box>
          ))}
      </Stack>
    </Container>
  );
};

export default SearchPage;
