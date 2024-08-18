import { Box, Button, Container, FormControl, FormHelperText, FormLabel, Grid, GridItem, HStack, Heading, Input, Select, Text, VStack, useToast } from "@chakra-ui/react";
import useUser from "../lib/useUser";
import { useMutation, useQuery, useQueryErrorResetBoundary } from "@tanstack/react-query";
import { IModifyStockTrans, IRegisterStockTransaction, IRegisterStockVariales, ModifyStockTransaction, createStock, createStockTransaction, getCategoryName, getStockTransaction, getTotalAsset, getstock, logOut, usernameLogIn } from "../api";
import TotalAssetGraph from "../components/TotalAsset";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProtectedPage from "../components/ProtectedPage";
import { useForm } from "react-hook-form";
import { FaArrowRight } from "react-icons/fa";

interface IGetStockTrans {
    name : string;
    date : string;
    amount : number;
    price : number;
}

export default function ModifyStockTrans() {

    const { transPk } = useParams();
    const {data, isLoading} = useQuery<IGetStockTrans>({queryKey: ['stockTrans', transPk], queryFn: getStockTransaction})
    const {register, handleSubmit} = useForm<IModifyStockTrans>();
    const toast = useToast();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: ModifyStockTransaction,
        onSuccess: () => {
            toast({
                status: "success",
                title: "stock transaction created",
                position: "bottom-right"
            });
            navigate(`/register/complete`)
        }
    })

    const onSubmit = (data: IModifyStockTrans) => {
        if (transPk) {
            const transPkInt = parseInt(transPk)
            if (transPkInt) {
                const putData = {
                    ...data,
                    id : transPkInt,
                }
                if (transPkInt) {
                    mutation.mutate(putData)
                }
            }
        }
    }


    if (data) {
        return(
            <Box
                pb={40}
                mt={10}
                px={{
                    base: 10,
                    lg: 40,
                }}  
            >
                <Container >
                    <Heading textAlign={"center"}>{data.name} </Heading>
                    <Heading mt={5} textAlign={"center"}>{data.date} 일자 매매 수정</Heading>

                    <VStack
                        spacing={10}
                        as="form"
                        onSubmit={handleSubmit(onSubmit)}
                        mt={5}
                    >
                        <FormControl mt={10}>
                            <FormLabel textAlign={"center"}>주식 매매량</FormLabel>
                            <HStack>
                                <Text w="200px"> 기존 : {data.amount}</Text>
                                <FaArrowRight style={{ marginLeft: '10px', marginRight: '10px'}} />
                                <Input
                                    type="number"
                                    {...register('amount', { required: true })}
                                />
                            </HStack>
                            <FormHelperText>주식 매매량을 숫자로 기입하세요 매수는 양수(+), 매도는 음수(-) </FormHelperText>
                        </FormControl>
                        <FormControl mt={5}>
                            <FormLabel textAlign={"center"}>주식 매매 가격</FormLabel>
                            <HStack>
                                <Text w="200px">기존 : {data.price}</Text>
                                <FaArrowRight style={{ marginLeft: '10px', marginRight: '10px'}} />
                                <Input
                                    type="number"
                                    step="0.01"
                                    {...register('price', { required: true })}
                                />
                            </HStack>
                            <FormHelperText>주식 1개 당 매매가격을 쓰세요 </FormHelperText>
                        </FormControl>
                        <Button
                            mt={10}
                            type="submit"
                            isLoading={mutation.isPending}
                            colorScheme={"red"}
                            size="lg"
                            w="100%"
                        >
                            주식 매매 변경하기
                        </Button>
                    </VStack>

                    
                    
                </Container>
            </Box>
        )
    } else {
        return(
            <div> 로딩 중입니다. </div>
        )
    }
}

    