import { FaAirbnb, FaMoon } from "react-icons/fa";
import { AiOutlineStock } from "react-icons/ai";
import {
    Avatar,
  Box,
  Button,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Toast,
  ToastId,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import useUser from "../lib/useUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategoryName, logOut } from "../api";
import { useRef } from "react";
import CategoryList from "./CategoryList";


interface IcategoryName {
    pk: number;
    name: string;
    classification: string;
  }

export default function Header() {
    const { userLoading, isLoggedIn, user} = useUser();
    const toast = useToast();
    const {
        isOpen : isLoginOpen,
        onClose : onLoginClose,
        onOpen : onLoginOepn,
    } = useDisclosure();
    const {
        isOpen: isSignUpOpen,
        onClose: onSignUpClose,
        onOpen: onSignUpOpen
    } = useDisclosure();
    const queryClient = useQueryClient();
    const toastId = useRef<ToastId>();
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn : logOut,
        onMutate: () => {
            toastId.current = toast({
                title: "Login out...",
                description: "Sad to see you go ...",
                status: "loading",
                position: "bottom-right",
            });
        },
        onSuccess: () => {
            if (toastId.current) {
                queryClient.refetchQueries({queryKey:["me"]});
                toast.update(toastId.current, {
                    status: "success",
                    title: "Done!",
                    description: "See you later!",
                })
            }
        }
    })
    const onLogOut = async () => {
        mutation.mutate();
    }

    const {data: categoryName, isLoading: nameLoading} = useQuery<IcategoryName[]>({queryKey: ['category_name'], queryFn: getCategoryName});



    return (
        
        <HStack
            justifyContent={"space-between"}
            py={2}
            px={10}
            borderBottomWidth={1}
        >
            <Box color="red.500">
                <Link to={"/"}>
                    <AiOutlineStock size={"48"} />
                </Link>
            </Box>
            <CategoryList categoryName={categoryName}/>

            <HStack spacing={2}>
                {!userLoading ? (
                    !isLoggedIn ? (
                        <>
                            <Button onClick={onLoginOepn}>Log in</Button>
                            <Button onClick={onSignUpOpen} colorScheme={"red"}>Sign up</Button>                          
                        </>       
                    ) : (
                        <Menu>
                            <MenuButton>
                                <Avatar size={"md"}/>
                            </MenuButton>
                            <MenuList>
                                <MenuItem onClick={onLogOut}>Log out</MenuItem>
                            </MenuList>
                            
                        </Menu>                         
                    )
                ) : (
                    <>
                        <Button onClick={onLoginOepn}>Log in</Button>
                        <Button onClick={onSignUpOpen} colorScheme={"red"}>Sign up</Button>
                    </> 
                )}              
            </HStack>
            <LoginModal isOpen={isLoginOpen} onClose={onLoginClose}/>
            <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose}  />

        </HStack>
        
    );
}