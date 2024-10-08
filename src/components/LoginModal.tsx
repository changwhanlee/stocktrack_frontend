import {useForm} from "react-hook-form"
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
    Text,
    VStack,
    useToast,
  } from "@chakra-ui/react";
  import { FaUserNinja, FaLock } from "react-icons/fa";
import SocialLogin from "./SocialLogin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IUsernameLoginError, IUsernameLoginSuccess, IUsernameLoginVariables, usernameLogIn } from "../api";
import { error } from "console";

interface LoginModalProps {
    isOpen : boolean;
    onClose: () => void;
}

interface IForm {
  username: string;
  password: string;
}

export default function LoginModal({isOpen, onClose} : LoginModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IForm>();
  const toast = useToast()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: usernameLogIn,
    onSuccess: () => {
      console.log("mutation succecss")
      toast({
        title: "welcome back!",
        status: "success",
      });
      onClose();
      queryClient.refetchQueries({queryKey:["me"]});
      reset();
    },
    onError: (error) => {
      console.log("mutationa has an error");
    }
  });

  const onSubmit = ({username, password}: IForm) => {
    mutation.mutate({username, password});
  };
  return(
      <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Log in</ModalHeader>
        <ModalCloseButton />
        <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
          <VStack>
            <InputGroup size={"md"}>
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
                required: "Please write a username",
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
              type="password"
              isInvalid={Boolean(errors.password?.message)}
              {...register("password", {
                required: "Please write a password",
              })}
              variant={"filled"} placeholder="Password" />
            </InputGroup>
          </VStack>
          {mutation.isError ? (
            <Text color="red.500" textAlign={"center"} fontSize="sm">
              Username or Password are wrong
            </Text>
          ): null}
          <Button type="submit" mt={4} colorScheme={"red"} w="100%">
            Log in
          </Button>
          <SocialLogin />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
