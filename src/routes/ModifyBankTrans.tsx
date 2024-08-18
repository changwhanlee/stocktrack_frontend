import { Box, Button, Container, FormControl, FormHelperText, FormLabel, Grid, GridItem, HStack, Heading, Input, Select, Text, VStack, useToast } from "@chakra-ui/react";
import useUser from "../lib/useUser";
import { useMutation, useQuery, useQueryErrorResetBoundary } from "@tanstack/react-query";
import { IModifyBankTrans, IModifyStockTrans, IRegisterStockTransaction, IRegisterStockVariales, ModifyBankTransaction, ModifyStockTransaction, createStock, createStockTransaction, getBankTransaction, getCategoryName, getStockTransaction, getTotalAsset, getstock, logOut, usernameLogIn } from "../api";
import TotalAssetGraph from "../components/TotalAsset";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProtectedPage from "../components/ProtectedPage";
import { useForm } from "react-hook-form";
import { FaArrowRight } from "react-icons/fa";


interface IGetBankTrans {
    name : string;
    date : string;
    money : number;
}


export default function ModifyBankTrnas() {
    const {transPk} = useParams();
    const {data, isLoading} = useQuery<IGetBankTrans>({queryKey : ['bankTrans', transPk], queryFn: getBankTransaction})

    const {register, handleSubmit} = useForm<IModifyBankTrans>();
    const toast = useToast();
    const navigate = useNavigate(); 

    const mutation = useMutation({
        mutationFn: ModifyBankTransaction,
        onSuccess: () => {
            toast({
                status: "success",
                title: "bank transaction created",
                position: "bottom-right"
            });
            navigate(`/register/complete`)
        }
    })

    const onSubmit = (data: IModifyBankTrans) => {
        if (transPk) {
            const transPkInt = parseInt(transPk)
            if (transPkInt) {
                const putData = {
                    ...data,
                    id : transPkInt
                }
                if (transPkInt) {
                    mutation.mutate(putData)
                }
            }
        }
    }
    console.log(data)

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
                <Container>
                    <Heading textAlign={"center"}>{data.name} </Heading>
                    <Heading mt={5} textAlign={"center"}>{data.date} 자산 상황 수정</Heading>

                    <VStack
                        spacing={10}
                        as="form"
                        onSubmit={handleSubmit(onSubmit)}
                        mt={5}
                    >
                        <FormControl mt={10}>
                            <FormLabel textAlign={"center"}>자산 규모</FormLabel>
                            <HStack>
                                <Text w="200px"> 기존 : {data.money}</Text>
                                <FaArrowRight style={{ marginLeft: '10px', marginRight: '10px'}} />
                                <Input
                                    type="number"
                                    {...register('money', { required: true })}
                                />
                            </HStack>
                            <FormHelperText>  자산 상황 수정 </FormHelperText>
                        </FormControl>
                        <Button
                            mt={10}
                            type="submit"
                            isLoading={mutation.isPending}
                            colorScheme={"red"}
                            size="lg"
                            w="100%"
                        >
                            자산 규모 변경하기
                        </Button>
                    </VStack>


                </Container>
            </Box>
        )
    }

    
    return (
        <Box>good</Box>
    )
}