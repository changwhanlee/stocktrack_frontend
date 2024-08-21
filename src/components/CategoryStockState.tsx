import { Box, Button, Card, CardBody, CardHeader, Flex, Grid, GridItem, HStack, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, SimpleGrid, Spacer, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

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

interface IcategoryStockState {
    data? : ICategoryStocks
}

interface AnnualReturn {
    year: number;
    initialTotal: number;
    finalTotal: number;
    returnRate: string;
}

export default function CategoryStockState({data} : IcategoryStockState) {
    const {categoryPk} = useParams();
    if (data) {
        const stockResult = data.result
        const categoryResult = data.category_result

        // 1. 카테고리 최신 총 금액, 첫 날짜부터 지금까지 구하기
        categoryResult.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        const latestCategory = categoryResult[categoryResult.length -1]
        const initialCategory = categoryResult.find(category => category.total_asset !== 0)

        const latestTotal = latestCategory.total_asset
        const latestDate = latestCategory.date
        const initialTotal = initialCategory?.total_asset ?? 0;
        const initialDate = initialCategory?.date
        const formatedLatestTotal = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(latestTotal);

        // 2. 첫날짜부터 지금까지 수익률 구하기
        const returnRate = initialTotal !== 0 ? (latestTotal - initialTotal) / initialTotal : 0 

        // 3. 보유 주식 수 구하기
        const stockCount = Object.keys(stockResult).length;

        // 4. 연도별 수익률 구하기
          // 4-1 연도별 데이터를 그룹화
        const groupByYear = (data :ICategoryResult[]) : Record<number, ICategoryResult[]> => {
            return data.reduce((acc: Record<number, ICategoryResult[]>, item: ICategoryResult) => {
                const year = new Date(item.date).getFullYear();
                if (!acc[year]) {
                    acc[year] = [];
                }
                acc[year].push(item);
                return acc;
            }, {});
        }

        const calculateAnnualReturn = (dataByYear: Record<number, ICategoryResult[]>): AnnualReturn[] => {
            const result: AnnualReturn[] = [];
            
            for (const year in dataByYear) {
                const yearData = dataByYear[year];
                const sortedYearData = yearData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                
                // 첫 total_asset 값이 0이 아닌 데이터를 찾음
                const initialData = sortedYearData.find(data => data.total_asset !== 0);
                
                // 모든 데이터의 total_asset이 0인 경우를 처리
                if (!initialData) continue;
        
                const initialTotal = initialData.total_asset;
                
                const finalData = sortedYearData[sortedYearData.length - 1];
                const finalTotal = finalData.total_asset;
        
                const returnRate = ((finalTotal - initialTotal) / initialTotal) * 100;
                result.push({
                    year: Number(year),
                    initialTotal,
                    finalTotal,
                    returnRate: returnRate.toFixed(2) + '%',
                });
            }
            
            return result;
        };

        const dataByYear = groupByYear(categoryResult);
        const annualReturns = calculateAnnualReturn(dataByYear)
        return(
            <Box>
                <Grid
                    templateColumns={{
                        base: 'repeat(1, 1fr)',
                        md: 'repeat(2, 1fr)',
                    }}
                    gap={4}
                    mb={4}
                >
                    <GridItem>
                        <Stat>
                            <Card>
                                <CardHeader>
                                    <StatLabel>카테고리 총 금액(원화 기준)</StatLabel>
                                </CardHeader>
                                <CardBody>
                                    <StatNumber mt={1}> ₩ {formatedLatestTotal} </StatNumber>
                                </CardBody>
                            </Card>
                        </Stat>
                    </GridItem>
                    <GridItem>
                        <Stat>
                            <Card>
                                <CardHeader>
                                    <StatLabel>총 수익률</StatLabel>
                                </CardHeader>
                                <CardBody>
                                <Flex alignItems="center" justifyContent="space-between">
                                    <StatNumber color={returnRate >= 0 ? 'red' : 'blue'}>
                                        <StatArrow type={returnRate >= 0 ? 'increase' : 'decrease'} />
                                        {(returnRate * 100).toFixed(2)} %
                                    </StatNumber>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Button>연도별 수익률 보기</Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <PopoverArrow />
                                            <PopoverCloseButton />
                                            <PopoverHeader>연도별 수익률</PopoverHeader>
                                            <PopoverBody>
                                                <Table variant="simple" sx={{
                                                    border: "2px solid gray",
                                                    borderCollapse: "collapse",
                                                    "& th, & td": {
                                                        border: "1px solid gray",
                                                    }
                                                }}>
                                                    <Thead bg="gray.400">
                                                        <Tr>
                                                            <Th fontSize="lg">년도</Th>
                                                            <Th fontSize="lg">수익률</Th>
                                                        </Tr>
                                                    </Thead>
                                                    <Tbody>
                                                        {annualReturns.map((item, index) => (
                                                            <Tr key={index}>
                                                                <Td color="blue.600">{item.year}</Td>
                                                                <Td color={parseFloat(item.returnRate) >= 0 ? 'blue.600' : 'red.600'}>
                                                                    {item.returnRate}
                                                                </Td>
                                                            </Tr>
                                                        ))}
                                                    </Tbody>
                                                </Table>
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                </Flex>
                                </CardBody>
                            </Card>
                        </Stat>
                    </GridItem>
                </Grid>
            </Box>
           
                
                
           
        )
    } else {
        return(
            <div>
                not good
            </div>
        )
    }
}


