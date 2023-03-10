import {
  Avatar,
  Button,
  Container,
  Heading,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  // useChakra,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { RiDeleteBin7Fill } from 'react-icons/ri';
import { fileUploadCss } from '../Auth/Register';
import {
  removeFromPlaylist,
  updateProfilePicture,
} from '../../redux/actions/profile';
import { useDispatch, useSelector } from 'react-redux';
import { cancelSubscription, loadUser } from '../../redux/actions/user';
import toast from 'react-hot-toast';

const Profile = ({ user }) => {
  const dispatch = useDispatch();

  const { loading, message, error } = useSelector(state => state.profile);

  const {
    loading: subLoading,
    message: subMessage,
    error: subError,
  } = useSelector(state => state.subscription);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      dispatch({ type: 'clearError' });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
    }

    if (subError) {
      toast.error("Your time of 7 days of subscription cancelation is over");
      dispatch({ type: 'clearError' });
    }
    if (subMessage) {
      toast.success(subMessage);
      dispatch({ type: 'clearMessage' });

      dispatch(loadUser())
    }
  }, [dispatch, error, message, subError, subMessage]);

  const removeFromPlayListHandler = async id => {
    // console.log(id);
    await dispatch(removeFromPlaylist(id));

    dispatch(loadUser());
  };

  const changeImageSubmitHandler = async (e, image) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.append('file', image);
    await dispatch(updateProfilePicture(myForm));
    dispatch(loadUser());
  };

  const { isOpen, onClose, onOpen } = useDisclosure();

  const cancelSubscriptionHandler = () => {
    dispatch(cancelSubscription());


  };

  return (
    <Container minH={'95vh'} maxW="container.lg" py="8">
      <Heading children="Profile" m="8" textTransform={'uppercase'} />

      <Stack
        justifyContent={'flex-start'}
        direction={['column', 'row']}
        alignItems={'center'}
        spacing={['8', '16']}
        padding="8"
      >
        <VStack>
          <Avatar boxSize={'48'} src={user.avatar.url} />
          <Button onClick={onOpen} colorScheme={'yellow'} varient="ghost">
            Change Photo
          </Button>
        </VStack>

        <VStack spacing={'4'} alignItems={['center', 'flex-start']}>
          <HStack>
            <Text children="Name" fontWeight={'bold'}></Text>
            <Text children={user.name}></Text>
          </HStack>
          <HStack>
            <Text children="Email" fontWeight={'bold'}></Text>
            <Text children={user.email}></Text>
          </HStack>
          <HStack>
            <Text children="CreatedAt" fontWeight={'bold'}></Text>
            <Text children={user.createdAt.split('T')[0]}></Text>
          </HStack>

          {user.role !== 'admin' && (
            <HStack>
              <Text children="Subscription" fontWeight={'bold'} />
              {user.subscription && user.subscription.status === 'active' ? (
                <Button
                  color="yellow.600"
                  varient="unstyle"
                  onClick={cancelSubscriptionHandler}
                  isLoading={subLoading}
                >
                  Cancel Subscription
                </Button>
              ) : (
                <Link to="/subscribe">
                  <Button colorScheme={'yellow'}>Subscribe</Button>
                </Link>
              )}
            </HStack>
          )}

          <Stack direction={['column', 'row']} alignItems={'center'}>
            <Link to="/updateprofile">
              <Button>Update Profile</Button>
            </Link>
            <Link to="/changepassword">
              <Button>Change Password</Button>
            </Link>
          </Stack>
        </VStack>
      </Stack>

      <Heading children="playlist" size={'md'} my="8" />
      {user.playlist.length > 0 && (
        <Stack
          direction={['column', 'row']}
          alignItems={'center'}
          flexWrap="wrap"
          p="4"
        >
          {user.playlist.map((element, index) => (
            <VStack w="48" m="2" key={element.course}>
              <Image
                boxSize={'full'}
                objectFit="contain"
                src={element.poster}
              ></Image>

              <HStack>
                <Link to={`/course/${element.course}`}>
                  <Button varient="ghost" colorScheme={'yellow'}>
                    Watch Now
                  </Button>
                </Link>

                <Button
                  onClick={() => removeFromPlayListHandler(element.course)}
                  isLoading={loading}
                >
                  <RiDeleteBin7Fill></RiDeleteBin7Fill>
                </Button>
              </HStack>
            </VStack>
          ))}
        </Stack>
      )}

      <ChangePhotoBox
        isOpen={isOpen}
        onClose={onClose}
        changeImageSubmitHandler={changeImageSubmitHandler}
        loading={loading}
      />
    </Container>
  );
};

export default Profile;

function ChangePhotoBox({
  isOpen,
  onClose,
  changeImageSubmitHandler,
  loading,
}) {
  const [imagePrv, setImagePrv] = useState('');
  const [image, setImage] = useState('');

  const changeImage = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImagePrv(reader.result);
      setImage(file);
    };
  };

  const closeHandler = () => {
    onClose();
    setImagePrv('');
    setImage('');
  };

  return (
    <Modal isOpen={isOpen} onClose={closeHandler}>
      <ModalOverlay backdropFilter={'blur(10px)'} />
      <ModalContent>
        <ModalHeader>Change Photo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Container>
            <form onSubmit={e => changeImageSubmitHandler(e, image)}>
              <VStack spacing="8">
                {imagePrv && <Avatar src={imagePrv} boxSize={'48'} />}
                <Input
                  type={'file'}
                  css={{ '&::file-selector-button': fileUploadCss }}
                  onChange={changeImage}
                />
                <Button
                  isLoading={loading}
                  w="full"
                  colorScheme={'yellow'}
                  type="submit"
                >
                  Change
                </Button>
              </VStack>
            </form>
          </Container>
        </ModalBody>

        <ModalFooter>
          <Button m="3" onClick={closeHandler}>
            Cancle
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
