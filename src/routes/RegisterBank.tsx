import { Box, Button, Container, FormControl, FormHelperText, FormLabel, Grid, GridItem, Heading, Input, Select, Text, VStack, useToast } from "@chakra-ui/react";
import useUser from "../lib/useUser";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IRegisterBank, IRegisterStockVariales, createBank, createStock, getCategoryName, getTotalAsset, logOut, usernameLogIn } from "../api";
import TotalAssetGraph from "../components/TotalAsset";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProtectedPage from "../components/ProtectedPage";
import { useForm } from "react-hook-form"


export default function RegisterBank() {
    const {register, handleSubmit} = useForm<IRegisterBank>();
    const toast = useToast()
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: createBank,
        onSuccess: () => {
            toast({
                status: "success",
                title: "bank created",
                position : "bottom-right"
            });
            navigate(`/register/complete`)
        }
    });

    const onSubmit = (data: IRegisterBank) => {
        mutation.mutate(data)
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
                    <Heading textAlign={"center"}>새로운 계좌 등록</Heading>
                    <VStack
                        spacing={10}
                        as="form"
                        onSubmit={handleSubmit(onSubmit)}
                        mt={5}
                    >
                        <FormControl>
                        <FormLabel>계좌 명</FormLabel>
                        <Input
                            {...register("name", {required: true})}
                            required
                            type="text"/>
                        <FormHelperText>계좌, 은행 이름을 적으세요</FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>원화/달러</FormLabel>
                            <Select
                                {...register("currency", {required: true})}                            
                                placeholder="원화/달러 선택"
                            >
                                <option value="usd">달러</option>
                                <option value="krw">원화</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>자산 상황</FormLabel>
                            <Input
                                {...register("money", {required:true})}
                                required
                                type="number"
                            />
                            <FormHelperText>등록 기준 계좌 자산을 적으세요 </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>날짜</FormLabel>
                            <Input
                                {...register("date", {required:true})}
                                required
                                type="date"
                            />
                            <FormHelperText>자산 상황에 대응하는 날짜를 선택하세요 </FormHelperText>
                        </FormControl>
                        <Button
                            type="submit"
                            isLoading={mutation.isPending}
                            colorScheme={"red"}
                            size="lg"
                            w="100%"
                        >
                            주식 등록하기
                        </Button>
                    </VStack>
                    




                </Container>
            </Box>

        </ProtectedPage>
    )

}