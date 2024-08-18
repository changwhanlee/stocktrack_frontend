import {
    Box,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    VStack,
    useToast,
  } from "@chakra-ui/react";
  import { FaUserNinja, FaLock, FaEnvelope, FaUserSecret } from "react-icons/fa";
  import SocialLogin from "./SocialLogin";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { usernameSignUp } from "../api";
import { useNavigate } from "react-router-dom";
  
  interface SignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

  interface IForm {
    name : string;
    email : string;
    username: string;
    password: string;
  }

  export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
    const {
      register,
      handleSubmit,
      formState: {errors},
      reset,
    } = useForm<IForm>();
    const toast = useToast()

    const navigate = useNavigate();
    const mutation = useMutation({
      mutationFn: usernameSignUp,
      onSuccess: () => {
        toast({
          title: "Welcome!!!!",
          status: "success"
        })
        onClose();
        reset();
        navigate("/")
      },
      onError: (error) => {
        console.log(error)
        toast({
          title: "Sign up Error",
          status : "error",
        })
      }
    })

    const onSubmit = ({name, email, username, password} : IForm) => {
      console.log({name, email, username, password})
      mutation.mutate({name, email, username, password})
    }
    return (
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign up</ModalHeader>
          <ModalCloseButton />
          <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
            <VStack>
              <InputGroup>
                <InputLeftElement
                  children={
                    <Box color="gray.500">
                      <FaUserSecret />
                    </Box>
                  }
                />
                <Input 
                isInvalid={Boolean(errors.name?.message)}
                {...register("name", {
                  required: "Please write a username",
                })}
                variant={"filled"} placeholder="Name" />
              </InputGroup>
              <InputGroup>
                <InputLeftElement
                  children={
                    <Box color="gray.500">
                      <FaEnvelope />
                    </Box>
                  }
                />
                <Input 
                isInvalid={Boolean(errors.password?.message)}
                {...register("email", {
                  required: "Please write a email"
                })}
                variant={"filled"} placeholder="Email" />
              </InputGroup>
              <InputGroup>
                <InputLeftElement
                  children={
                    <Box color="gray.500">
                      <FaUserNinja />
                    </Box>
                  }
                />
                <Input
                isInvalid={Boolean(errors.username?.message)}
                {...register("username", {
                  required: "Please write a username"
                })} 
                variant={"filled"} placeholder="Username" />
              </InputGroup>
              <InputGroup>
                <InputLeftElement
                  children={
                    <Box color="gray.500">
                      <FaLock />
                    </Box>
                  }
                />
                <Input 
                isInvalid={Boolean(errors.password?.message)}
                {...register("password", {
                  required: "Please write a password"
                })} 
                variant={"filled"} placeholder="Password" />
              </InputGroup>
            </VStack>
            <Button type="submit" mt={4} colorScheme={"red"} w="100%">
              Sign Up
            </Button>
            <SocialLogin />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }