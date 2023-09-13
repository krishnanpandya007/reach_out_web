import { Button, FormControl, FormLabel, Input, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, Flex, Skeleton, Center, Badge, IconButton, useToast } from '@chakra-ui/react'
import {IoIosImages} from 'react-icons/io'
import {FaTrash} from 'react-icons/fa'
import React from 'react'
import { UserInfoContext } from '../WebApp'
import { ANONYMOUS_AVATAR_URL, BACKEND_ROOT_URL } from '../constants'
import axios from './configs/customAxios'

function UpdateProfile({ isOpen, onClose }) {

    const { name, bio, avatar, update_user_info } = React.useContext(UserInfoContext);
    const [staleData, setStaleData] = React.useState({ name, bio, avatar })
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const toast = useToast();
    // const [formInfo, setFormInfo] = React.useState({ name, bio, avatar })

    const handleSubmit = async () => {
      // TODO: basic error handling checks like if name is empty or not

      if(!/^[A-Za-z]+ [A-Za-z]+$/.test(staleData.name)){

        toast({
          description: 'Try "Firstname Lastname" format!',
          status: 'error',
          isClosable: true,
        }); 

        return;

      } 

      setIsSubmitting(true);

      axios.put('/api/profile/', {name: staleData.name, bio: staleData.bio, profilePicUrl: staleData.avatar}).then((res) => {

        if(res.status === 201){

            // Assert the setter function uses functional updation! (✔)
    
            window.location.reload()
            
          }


      });

      setIsSubmitting(false);

    }

  return (
    <Modal
        
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Your Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>

            <AvatarInput staleAvatar={staleData.avatar} setStaleAvatar={(newAvatar) => {setStaleData(c => ({...c, avatar: newAvatar}))}} />
            
            <FormControl>
              <FormLabel>Display Name</FormLabel>
              <Input value={staleData.name} onChange={(e) => {setStaleData({...staleData, name: e.target.value})}} placeholder='Sen Tenz' />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Bio</FormLabel>
              <Textarea maxLength={100} value={staleData.bio} onChange={(e) => {setStaleData({...staleData, bio: e.target.value})}} placeholder='A professional Gamer | Streamer | PROD , lol a lot more...' resize={'vertical'} />
            </FormControl>
          </ModalBody>

          <ModalFooter>

            <Button isLoading={isSubmitting} onClick={handleSubmit} colorScheme='blue' mr={3}>
              Update
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  )
}

function AvatarInput({ staleAvatar, setStaleAvatar }){

    const [socials, setSocials] = React.useState({avatars: {}, loading: true});
    const [uploading, setUploading] = React.useState(false); // Updated one but not commited one!
    const { profile_id } = React.useContext(UserInfoContext);

    const toast = useToast();
    const selectorRef = React.useRef(null);

    React.useEffect(() => {

        axios.get('/api/social/profile_pics').then((res) => {
          setSocials({loading: false, avatars: res.data['profilePics']})
        }).catch((err) => {
          setSocials({loading: false, avatars: {}})
        })

    }, [])

    const toggleAnonymousAvatar = () => {

        setStaleAvatar(ANONYMOUS_AVATAR_URL);

    }

    const uploadDroppedFile = (e) => {
        e.preventDefault();
        const target_file = (e.target.files || e.dataTransfer.files)[0]

        setUploading(true);

        const formData = new FormData();
     
        // Update the formData object
        formData.append(
          "upload_file",
          target_file,
          target_file.name
        );

        axios.post(`/api/upload/?key=images:profile_pic&identifier=${profile_id}`, formData, {headers: {'Content-Type': 'multipart/form-data'}}).then((res) => {

          setUploading(false);

          if(res.status === 201){

            setStaleAvatar(res.data['upload_path'] + '?t=' + new Date().getTime())// For diffing url for image

          } else {

            toast({
              title: 'Failed to upload',
              description: 'Try again later after some time!',
              status: 'error',
              isClosable: true,
            }); 

          }

        })

    }

    return (
        <>
            <Flex mb='0.8rem' gap='0.8rem'>
                <div style={{position: 'relative'}}>
                    <Image key={staleAvatar} objectFit={'cover'} src={staleAvatar.slice(0, 4) === 'http' ? staleAvatar : `${BACKEND_ROOT_URL}${staleAvatar}`} borderRadius='8px' w='80px' h='80px' />
                    <IconButton onClick={toggleAnonymousAvatar} position={'absolute'} bgColor='#ffffff' color={'#F37878'} top='45px' p='1px' right='5px' size='sm'><FaTrash /></IconButton>

                </div>
                <input type="file" onChange={uploadDroppedFile} style={{display: 'none'}} ref={selectorRef} name="myImage" accept="image/*" />
                <Center _hover={{cursor: 'pointer'}} onDrop={uploadDroppedFile} onDragOver={(e) => {e.preventDefault();e.stopPropagation();}} onClick={() => {selectorRef.current?.click()}} flex='1' border='2px dashed #59CE8F50'><IoIosImages size={30} opacity='0.7' /> <p style={{fontSize: '0.8rem', width: '60%', marginLeft: '0.5rem'}}>{uploading ? <b>Uploading...</b> : 'Select / Drop your avatar pic here.'}</p></Center>
            </Flex>
            <Badge fontSize='0.7em' colorScheme='green'>
                Social Avatars
            </Badge>
            <Flex flexWrap={'wrap'} mb='1.4rem'>
                {
                    socials.loading ?<>
                        <Skeleton w='50px' h='50px' mr='0.5rem'></Skeleton>
                        <Skeleton w='50px' h='50px' mr='0.5rem'></Skeleton>
                        <Skeleton w='50px' h='50px' mr='0.5rem'></Skeleton>
                        <Skeleton w='50px' h='50px' mr='0.5rem'></Skeleton>
                        <Skeleton w='50px' h='50px' mr='0.5rem'></Skeleton>
                        <Skeleton w='50px' h='50px' mr='0.5rem'></Skeleton></>:
                        Object.keys(socials.avatars).length > 0 && Object.values(socials.avatars).map((social_avatar) => <Image objectFit={'cover'} src={social_avatar.slice(0, 4) === 'http' ? social_avatar : `${BACKEND_ROOT_URL}${social_avatar}`} mr='0.5rem' borderRadius='5px' w='50px' h='50px' />)


                }
            </Flex>

        </>


    )

}

export default UpdateProfile