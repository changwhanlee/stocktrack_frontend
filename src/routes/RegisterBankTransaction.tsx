import { Box, Button, Container, FormControl, FormHelperText, FormLabel, Grid, GridItem, Heading, Input, Select, Text, VStack, useToast } from "@chakra-ui/react";
import useUser from "../lib/useUser";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IRegisterBankTransaction, IRegisterStockTransaction, IRegisterStockVariales, createBankTrans, createStock, createStockTransaction, getBank, getCategoryName, getTotalAsset, getstock, logOut, usernameLogIn } from "../api";
import TotalAssetGraph from "../components/TotalAsset";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProtectedPage from "../components/ProtectedPage";
import { useForm } from "react-hook-form";


interface IBank {
    name: string;
    currency: string;
}



export default function RegisterBankTransaction() {
    const {categoryPk} = useParams();
    const {register, handleSubmit} = useForm<IRegisterBankTransaction>();
    const toast = useToast();
    const navigate = useNavigate();
    const {data, isLoading} = useQuery<IBank>({queryKey: ['bank', categoryPk], queryFn:getBank})

    const mutation = useMutation({
        mutationFn: createBankTrans,
        onSuccess: () => {
            toast({
                status: "success",
                title: "stock transaction created",
                position: "bottom-right"
            });
            navigate(`/register/complete`)
        }
    });

    const onSubmit = (data : IRegisterBankTransaction) => {
        const postData = {
            ...data,
            id : categoryPk ? categoryPk: "",
        }
        if (categoryPk) {
            mutation.mutate(postData)
        }
    }
    if (data) {
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
                        <Heading textAlign={"center"}>{data.name} 자산 등록</Heading>
                        <VStack
                            spacing={10}
                            as="form"
                            onSubmit={handleSubmit(onSubmit)}
                            mt={5}
                        >
                            <FormControl>
                                <FormLabel>날짜</FormLabel>
                                <Input
                                    {...register("date", {required:true})}
                                    required
                                    type="date"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>자산</FormLabel>
                                <Input
                                    {...register("money", {required:true})}
                                    required
                                    type="number"
                                />
                                <FormHelperText>총 자산 금액을 적으세요 </FormHelperText>
                            </FormControl>
                            <Button
                                type="submit"
                                isLoading={mutation.isPending}
                                colorScheme={"red"}
                                size="lg"
                                w="100%"
                            >
                                자산 업데이트하기
                            </Button>
                        </VStack>
                        
                    </Container>
                </Box>
            </ProtectedPage>
        )
    } else {
        return(
            <div>로딩 중입니다.</div>
        )
    }
    
}