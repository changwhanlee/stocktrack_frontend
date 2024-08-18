import { Box, Button, Container, FormControl, FormHelperText, FormLabel, Grid, GridItem, Heading, Input, Select, Text, VStack, useToast } from "@chakra-ui/react";
import useUser from "../lib/useUser";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IRegisterStockVariales, createStock, getCategoryName, getTotalAsset, logOut, usernameLogIn } from "../api";
import TotalAssetGraph from "../components/TotalAsset";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProtectedPage from "../components/ProtectedPage";
import { useForm } from "react-hook-form";


/*
name
ticker
currency
owner
category
*/

interface ICategoryName {
    name: string;
    pk: number;
}

interface IPk {
    id: number;
    category_id: number;

}



export default function RegisterStock() {

    const {categoryPk} = useParams()
    const {register, handleSubmit} = useForm<IRegisterStockVariales>();
    const toast = useToast()
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn : createStock,
        onSuccess: (data:IPk) => {
            toast({
                status: "success",
                title: "stock created",
                position : "bottom-right"
            });
            navigate(`/register/complete`)
        }
    });

    const onSubmit = (data: IRegisterStockVariales) => {
        const postData = {
            ...data,
            categoryPk : categoryPk ? categoryPk: '',
        }
        if (categoryPk) {
            console.log(postData)
            mutation.mutate(postData)
        }
    }

    const { data : categories } = useQuery<ICategoryName[]>({queryKey: ['category_name'], queryFn: getCategoryName});
    
    if (categoryPk && categories) {
        const numericCategoryPk = parseInt(categoryPk, 10)
        const category = categories.find(category => category.pk === numericCategoryPk)
        
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
                        <Heading textAlign={"center"}>새로운 주식 등록</Heading>
                        <Text mt={2} textAlign={"center"} fontSize="x-large" color="red.500"> 카테고리 : {category?.name}</Text>
                        <VStack
                            spacing={10}
                            as="form"
                            onSubmit={handleSubmit(onSubmit)}
                            mt={5}
                        >
                            <FormControl>
                                <FormLabel>주식 명</FormLabel>
                                <Input
                                    {...register("name", {required: true})}
                                    required
                                    type="text"/>
                                <FormHelperText>주식 이름을 적으세요</FormHelperText>
                            </FormControl>
                            <FormControl>
                                <FormLabel>주식 티커</FormLabel>
                                <Input
                                {...register("ticker", {required: true})} 
                                required 
                                type="text"/>
                                <FormHelperText>주식 티커를 적으세요</FormHelperText>
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
                                <FormLabel>매매 날짜</FormLabel>
                                <Input
                                    {...register("date", {required:true})}
                                    required
                                    type="date"
                                />
                                <FormHelperText>해당 전략에서 해당 주식을 처음 매매한 날을 선택하세요</FormHelperText>
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
                                주식 등록하기
                            </Button>
    
    
                        </VStack>
                    </Container>
                
                </Box>
            </ProtectedPage>
        )
    } else {
        return(
            <div>
                error
            </div>
        )
    }
}


/* <FormControl>
                                <FormLabel>카테고리</FormLabel>
                                <Select
                                    {...register("category", {required: true})}
                                    placeholder="카테고리 선택"
                                >
                                    {categories?.map((category) => (
                                        <option key={category.pk} value={category.pk}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                            <Link to={'/register/category'}>
                                <Button>카테고리 추가하기</Button>
                            </Link>*/