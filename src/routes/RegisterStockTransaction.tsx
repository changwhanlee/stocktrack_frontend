import { Box, Button, Container, FormControl, FormHelperText, FormLabel, Grid, GridItem, Heading, Input, Select, Text, VStack, useToast } from "@chakra-ui/react";
import useUser from "../lib/useUser";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IRegisterStockTransaction, IRegisterStockVariales, createStock, createStockTransaction, getCategoryName, getTotalAsset, getstock, logOut, usernameLogIn } from "../api";
import TotalAssetGraph from "../components/TotalAsset";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProtectedPage from "../components/ProtectedPage";
import { useForm } from "react-hook-form";


/* 
amount
price
date
*/

interface IPk {
    categoryPk : number;
}


export default function RegisterStockTransaction() {

    const {register,handleSubmit} = useForm<IRegisterStockTransaction>();
    const toast = useToast();
    const navigate = useNavigate();
    const { categoryPk, stockPk } = useParams();
    const { data: stockdata, isLoading} = useQuery({queryKey: ['stock', categoryPk, stockPk], queryFn: getstock});


    const mutation = useMutation({
        mutationFn: createStockTransaction,
        onSuccess: (data:IPk) => {
            toast({
                status: "success",
                title: "stock transaction created",
                position: "bottom-right"
            });
            navigate(`/register/complete`)
        }
    })



    const onSubmit = (data: IRegisterStockTransaction) => {
        const postData = {
            ...data, 
            categoryPk : categoryPk ? categoryPk: '',
            stockPk : stockPk ? stockPk: ''}
        if (categoryPk && stockPk) {
            console.log(postData)
            mutation.mutate(postData)
        }
    }




    if (!isLoading && stockdata) {
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
                        <Heading textAlign={"center"}>주식 매매 현황 등록</Heading>            
                        <VStack
                            spacing={10}
                            as="form"
                            onSubmit={handleSubmit(onSubmit)}
                            mt={5}
                        >
                            <VStack>
                                <Text>카테고리 : {stockdata.category.name}</Text>
                                <Text> 주식 명 : stockdata.name (티커) : {stockdata.ticker}</Text>
                            </VStack>
                            <FormControl>
                                <FormLabel>매매 날짜</FormLabel>
                                <Input
                                    {...register("date", {required:true})}
                                    required
                                    type="date"
                                />
                                <FormHelperText>주식을 매매한 날을 선택하세요</FormHelperText>
                            </FormControl>
                            <FormControl>
                                <FormLabel>매매 수량</FormLabel>
                                <Input
                                    {...register("amount", {required:true})}
                                    required
                                    type="number"
                                />
                                <FormHelperText>주식 매매량을 숫자로 기입하세요 <br/> 매수는 양수(+), 매도는 음수(-) </FormHelperText>
                            </FormControl>
                            <FormControl>
                                <FormLabel>매매 가격</FormLabel>
                                <Input
                                    {...register("price", {required:true})}
                                    required
                                    type="number"
                                    step="any"
                                />
                                <FormHelperText>주식 매매가격을 숫자로 기입하세요 </FormHelperText>
                            </FormControl>
                            <Button
                                type="submit"
                                isLoading={mutation.isPending}
                                colorScheme={"red"}
                                size="lg"
                                w="100%"
                            >
                                주식 매매 기록하기
                            </Button>
    
                        </VStack>
                    </Container>
                    
                </Box>
               
    
            </ProtectedPage>
        )
    } else {
        return <div>Loading .... </div>
    }

    
} 