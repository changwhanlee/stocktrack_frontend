import { Button, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getTransUpdate } from "../api";


export default function RegisterComplete() {
    const {data, isLoading} = useQuery({queryKey: ['update_complete'], queryFn: getTransUpdate})

    if (isLoading) {
        return(
            <VStack spacing={4} align="center">
                <Heading>업데이트 중입니다........</Heading>
                <Spinner size="xl"/>
            </VStack>

        )
    } else if (data) {
        return (
            <VStack spacing={4} align="center">
                <Heading mt={10}>업데이트 완료!!</Heading>
                <Link to={"/"}>
                    <Button bg="red.500" color="white">
                        확인
                    </Button>
                </Link>
            </VStack>
        )
    } else {
        return(
            <div>
                에러
            </div>
        )
    }
}