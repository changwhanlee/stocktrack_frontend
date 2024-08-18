import { Box, Button, Container, Flex, FormControl, FormHelperText, FormLabel, Grid, GridItem, HStack, Heading, Input, Select, SimpleGrid, Text, VStack, useToast } from "@chakra-ui/react";
import useUser from "../lib/useUser";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IRegisterStockVariales, createStock, getCategoryName, getTotalAsset, logOut, readCategoryStocks, usernameLogIn } from "../api";
import TotalAssetGraph from "../components/TotalAsset";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProtectedPage from "../components/ProtectedPage";
import { useForm } from "react-hook-form";
import CategoryAssetGraph from "../components/CategoryAsset";
import { useState } from "react";
import StockAssetGraph from "../components/StockAsset";
import StockTable from "../components/StockTable";
import CategoryStockState from "../components/CategoryStockState";
import CategoryGraph from "../components/categoryGraph";
import CategoryStockTable from "../components/CategoryStockTable";
import { useGoodData } from "../components/Root";

interface IcategoryName {
    pk: number;
    name : string;
    classification: string;
}

interface IStockInformation {
    pk: number;
    name: string;
    ticker: string;
    category: IcategoryName;
    currency: string;
}

interface IStockAsset {
    id : number;
    stock: IStockInformation;
    amount: number;
    price: number;
    date: string;
    total_amount : number;
    total_average_price: number;
    total_stock_asset: number;
    market_price: number;
    realize_money: number;
}

interface IStocks {
    [key:string] : IStockAsset[]
}

interface ICategoryResult {
    id: number;
    category: IcategoryName;
    asset_krw: number;
    asset_usd: number;
    usd_rate: number;
    total_asset: number;
    date: string;
    realize_money: number;
}

interface ICategoryStocks {
    result : IStocks;
    category_result: ICategoryResult[];
}

interface IStockNameAndData {
    stockName: string;
    stockData: IStockAsset[]; 
}




const CategoryStocks: React.FC = () => {
    const [selectedStock, setSelectedStock] = useState<IStockNameAndData | null>(null);
    const [activeButton, setActiveButton] = useState<string | null>(null);

    const handleStockClick = (stockName: string, stockData: IStockAsset[]) => {
        setSelectedStock({ stockName, stockData });
        setActiveButton(stockName);
    };

    const { categoryPk } = useParams<{ categoryPk: string }>();
    const { data: categoryData, isLoading } = useQuery<ICategoryStocks>({
        queryKey: ['categorystocks', categoryPk],
        queryFn: readCategoryStocks
    });
    const { data: categoryName, isLoading: nameLoading } = useQuery<IcategoryName[]>({
        queryKey: ['category_name'],
        queryFn: getCategoryName
    });

    if (isLoading || nameLoading) return <Box>Loading.......</Box>;

    if (categoryData && categoryName && categoryPk) {
        const numericCategoryPk = parseInt(categoryPk, 10);
        const stockResult = categoryData.result;
        const categoryResult = categoryData.category_result;
        const category = categoryName.find(category => category.pk === numericCategoryPk);

        if (Object.entries(stockResult).length === 0) {
            if (category) {
                return (
                    <VStack bg="gray.100" minH="100vh">
                        <Heading mt="20%">"{category.name}"의 </Heading>
                        <Heading mt={5}>{"주식을 등록하세요"}</Heading>
                        <Link to={`/read/categorystocks/${categoryPk}/register`}>
                            <Button mt={6} colorScheme={"red"} variant={"link"} fontSize="x-large">
                                주식 등록하러 가기 &rarr;
                            </Button>
                        </Link>
                    </VStack>
                );
            } else {
                return (
                    <VStack bg="gray.100" justify={"center"} minH="100vh">
                        <Heading>카테고리를 찾을 수 없습니다</Heading>
                    </VStack>
                );
            }
        } else if (Object.entries(stockResult).length > 0) {
            return (
                <Container maxW="container.xl" py={8}>
                    <VStack spacing={8} align="stretch">
                    <Heading textAlign="center" size="xl" color="blue.600">
                        {categoryResult[0].category.name} 자산 현황
                    </Heading>
            
                    <CategoryStockState data={categoryData} />
            
                    <Box textAlign="center">
                        <Link to={`/read/categorystocks/${categoryPk}/register`}>
                        <Button colorScheme="blue" size="lg">
                            새로운 주식 등록하기
                        </Button>
                        </Link>
                    </Box>
            
                    <CategoryGraph categoryName={category?.name} />
            
                    <CategoryStockTable categoryPk={categoryPk} />
            
                    <Box borderWidth={1}  borderRadius="lg" p={6} bg="white" boxShadow="md">
                        <VStack spacing={4} align="stretch">
                        <Heading size="lg" textAlign="center" color="green.600">
                            주식 별 세부정보
                        </Heading>
            
                        <Box maxH="150px" overflowY="auto" borderRadius="md" borderWidth={1} borderColor="gray.200" p={2}>
                            <Flex flexWrap="wrap" justifyContent="center">
                            {Object.keys(stockResult).map((stockName, index) => (
                                <Button
                                key={index}
                                onClick={() => handleStockClick(stockName, stockResult[stockName])}
                                colorScheme={activeButton === stockName ? 'red' : 'green'}
                                m={1}
                                size="sm"
                                >
                                {stockName}
                                </Button>
                            ))}
                            </Flex>
                        </Box>
            
                        <Box bg="gray.50" borderRadius="md" p={4} h="400px" overflowY="auto">
                            {selectedStock ? (
                            <StockTable
                                stockName={selectedStock.stockName} 
                                stockData={selectedStock.stockData}
                            />
                            ) : (
                            <Text textAlign="center" color="gray.500">
                                주식을 선택하여 세부 정보를 확인하세요.
                            </Text>
                            )}
                        </Box>
                        </VStack>
                    </Box>
                    </VStack>
                </Container>
            );
        } else {
            return <Box>Loading.......</Box>;
        }
    } else {
        return <Box>Loading.......</Box>;
    }
};

export default CategoryStocks;
            
            /*
            <Grid   
            h='768px'
            templateRows='repeat(2, 1fr)'
            templateColumns='repeat(6, 1fr)'
            gap={4}
            px={4}
            >
                <GridItem boxShadow='dark-lg' rowSpan={2} colSpan={1}> 
                    
                </GridItem>
                <GridItem boxShadow='dark-lg' rowSpan={1} colSpan={3} bg="orange.50" w="100%" h="100%">
                    <CategoryAssetGraph data={categoryResult}/>
                </GridItem>
                <GridItem boxShadow='dark-lg' rowSpan={2} colSpan={2}>
                    <VStack gap={2}>
                        {selectedStock && (
                            <StockTable stockName={selectedStock?.stockName} stockData={selectedStock?.stockData}/>
                        )}       
                    </VStack>
                    
                </GridItem>
                <GridItem boxShadow='dark-lg' rowSpan={1} colSpan={3} bg="orange.50">
                    <VStack gap={2} justifyContent='space-between' >
                        <HStack m={3}>
                            {Object.keys(stockResult).map((stockName, index) => (
                                <Button 
                                    key={index} 
                                    onClick={() => handleStockClick(stockName, stockResult[stockName])}
                                    colorScheme={activeButton === stockName ? 'red' : 'blue'}
                                >
                                    {stockName}
                                </Button>
                            ))}
                        </HStack>
                        {selectedStock && (
                            <StockAssetGraph stockName={selectedStock?.stockName} stockData={selectedStock?.stockData}/>
                        )}
                    </VStack>
                </GridItem>
            </Grid> */


            