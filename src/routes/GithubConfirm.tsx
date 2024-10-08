import { Heading, Spinner, Text, VStack, useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { githubLogin } from "../api";

export default function GithubConfirm() {
    const {search} = useLocation()
    const toast = useToast();
    const QueryClient = useQueryClient();
    const navigate = useNavigate();
    const confirmLogin = async() => {
        const params = new URLSearchParams(search);
        const code = params.get("code");
        if (code) {
            const status = await githubLogin(code);
            if (status == 200) {
                toast({
                    status:"success",
                    title:"Welcom!",
                    position: "bottom-right",
                    description: "Happy to have you back!",
                });
                QueryClient.refetchQueries({queryKey:["me"]});
                navigate("/")
            }
        }
    };

    useEffect(() => {
        confirmLogin();
    }, []);

    return (
        <VStack justifyContent={"center"} mt={40}>
          <Heading>Processing log in...</Heading>
          <Text>Don't go anywhere.</Text>
          <Spinner size="lg" />
        </VStack>
    );
}