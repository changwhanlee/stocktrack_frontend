import { Box, Button, Container, FormControl, FormHelperText, FormLabel, Grid, GridItem, Heading, Input, Select, VStack, useToast } from "@chakra-ui/react";
import useUser from "../lib/useUser";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IRegisterCategory, IRegisterStockVariales, createCategory, createStock, getCategoryName, getTotalAsset, logOut, usernameLogIn } from "../api";
import TotalAssetGraph from "../components/TotalAsset";
import { Link, useNavigate } from "react-router-dom";
import ProtectedPage from "../components/ProtectedPage";
import { useForm } from "react-hook-form";

export default function RegisterCategory() {
    const {register, handleSubmit} = useForm<IRegisterCategory>();
    const toast = useToast();
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn : createCategory,
        onSuccess: (data) => {
            toast({
                status: "success",
                title: "stock created",
                position : "bottom-right"
            });
            navigate(`/read/categorystocks/${data.result}/register`)
        }
    })

    const onSubmit = (data: IRegisterCategory) => {
        mutation.mutate(data);
    }

    return(
        <ProtectedPage>
            <Box
                pb={40}
                mt={10}
                px={{
                    base: 10,
                    lg: 40,
                  }}
            >
                <Container>
                    <Heading textAlign={"center"}>새로운 카테고리 등록</Heading>
                    <VStack
                       spacing={10}
                       as="form"
                       onSubmit={handleSubmit(onSubmit)}
                       mt={5} 
                    >
                        <FormControl>
                            <FormLabel>카테고리 명</FormLabel>
                            <Input
                                {...register("name", {required: true})}
                                required
                                type="text"/>
                            <FormHelperText>카테고리명을 적으세요</FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>분류</FormLabel>
                            <Select
                                {...register("classification", {required:true})}
                                placeholder="주식/예금 선택"
                            >
                                <option value="stock">주식</option>
                                <option value="bank">예금</option>
                            </Select>
                            <FormHelperText>주식전략인지, 예금인지 선택하세요</FormHelperText>
                        </FormControl>
                        <Button
                            type="submit"
                            isLoading={mutation.isPending}
                            colorScheme={"red"}
                            size="lg"
                            w="100%"
                        >
                            카테고리 등록하기
                        </Button>
                    </VStack>
                </Container>
            </Box>
        </ProtectedPage>
    )




}