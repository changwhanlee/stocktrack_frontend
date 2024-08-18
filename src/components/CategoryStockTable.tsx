import { Box, Flex, Grid, GridItem, Heading, HStack, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber, Table, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link } from 'react-router-dom';
import { getCategoryStockCount, getCategoryStockTable } from '../api';

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

interface ICategoryStockTableProps {
    categoryPk: string;
}

export default function CategoryStockTable({categoryPk} : ICategoryStockTableProps) {
    const { data, isLoading} = useQuery({queryKey: ['stockTable', categoryPk], queryFn: getCategoryStockTable})
    console.log('stockTable-----------------------------------------------------')
    console.log(data)
    console.log(categoryPk)
    if (data) {
        const tableData = data.result
        const StockList = Object.keys(tableData)

        let totalUsdProfit = 0;
        let totalKrwProfit = 0;
        let totalInvestedKrw = 0;

        StockList.forEach(stock => {
            let usdProfit = 0;
            let krwProfit = 0;
            let investedKrw = 0;

            if (tableData[stock].currency === 'usd') {
                usdProfit = (tableData[stock].market_price - tableData[stock].total_average) * tableData[stock].total_amount;
                krwProfit = usdProfit * tableData[stock].usd_rate;
                investedKrw = tableData[stock].total_average * tableData[stock].total_amount * tableData[stock].usd_rate;
            } else if (tableData[stock].currency === 'krw') {
                krwProfit = (tableData[stock].market_price - tableData[stock].total_average) * tableData[stock].total_amount;
                investedKrw = tableData[stock].total_average * tableData[stock].total_amount;
            }

            totalUsdProfit += usdProfit;
            totalKrwProfit += krwProfit;
            totalInvestedKrw += investedKrw;
        });

        const totalProfitRate = (totalKrwProfit / totalInvestedKrw) * 100;

        return(
            <Flex width="100%" flexDirection="column" alignItems="center" mt={10} >
                <Box width="95%" overflow="auto" bg="white" boxShadow="lg" borderRadius="xl" maxHeight="700px" mb={10}>
                    <Heading as="h2" size="lg" textAlign="center" mt={4} mb={4}>주식별 보유금액 현황</Heading>
                    <TableContainer>
                        <Table variant="simple" size="lg" >
                            <Thead
                                position="sticky"
                                top={0}
                                backgroundColor="green.50"
                                zIndex={1}
                                boxShadow="md"
                            >
                                <Tr>
                                    <Th fontSize="lg" fontWeight="semibold" color="gray.700" py={3}>주식 명</Th>
                                    <Th fontSize="lg" fontWeight="semibold" color="gray.700" py={3}>보유 갯수</Th>
                                    <Th fontSize="lg" fontWeight="semibold" color="gray.700" py={3} isNumeric>총 보유금액</Th>
                                    <Th fontSize="lg" fontWeight="semibold" color="gray.700" py={3} isNumeric>총 보유금액(원화)</Th>
                                    <Th fontSize="lg" fontWeight="semibold" color="gray.700" py={3} isNumeric>평단가</Th>
                                    <Th fontSize="lg" fontWeight="semibold" color="gray.700" py={3} isNumeric>가격</Th>
                                    <Th fontSize="lg" fontWeight="semibold" color="gray.700" py={3} isNumeric>비중</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {StockList.map((stock, index) => (
                                    <Tr key={index} _hover={{ bg: "gray.50" }} >
                                        <Td py={2}>
                                            <Text fontWeight="medium" color="blue.600">{stock}</Text>
                                        </Td>
                                        <Td py={2}>{tableData[stock].total_amount.toLocaleString()} 개</Td>
                                        <Td py={2} isNumeric>
                                            <Text fontWeight="medium">
                                                {tableData[stock].currency === "usd" 
                                                    ? `$ ${Number(tableData[stock].total_asset).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` 
                                                    : `₩ ${Number(tableData[stock].total_asset).toLocaleString()}`}  
                                            </Text>
                                               
                                        </Td>
                                        <Td py={2} isNumeric>
                                            <Text fontWeight="medium">
                                                ₩{Number(tableData[stock].total_asset_krw).toLocaleString()}
                                            </Text>
                                        </Td>
                                        <Td py={2} isNumeric>
                                            {tableData[stock].currency === "usd" 
                                                ? `$${Number(tableData[stock].total_average).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` 
                                                : `₩${Number(tableData[stock].total_average).toLocaleString()}`}
                                        </Td>
                                        <Td py={2} isNumeric>
                                            {tableData[stock].currency === "usd" 
                                                ? `$${Number(tableData[stock].market_price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` 
                                                : `₩${Number(tableData[stock].market_price).toLocaleString()}`}
                                        </Td>
                                        <Td py={2} isNumeric>
                                            <Text fontWeight="medium" color={parseFloat(tableData[stock].total_rate) > 0 ? "green.500" : "red.500"}>
                                                {tableData[stock].total_rate}%
                                            </Text>  
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                            

                        </Table>
                    </TableContainer>
                </Box>
                <Box width="95%" bg="white" boxShadow="lg" borderRadius="xl" maxHeight="700px" mt={10}>
                    <Heading as="h2" size="lg" textAlign="center" mt={4} mb={4}>주식별 수익률(평단가 기준)</Heading>
                    <TableContainer>
                        <Table variant="simple" size="lg">
                            <Thead
                                position="sticky"
                                top={0}
                                backgroundColor="green.50"
                                zIndex={1}
                                boxShadow="md"
                            >
                                <Tr>
                                    <Th fontSize="lg" fontWeight="semibold" color="gray.700" py={3}>주식 명</Th>
                                    <Th fontSize="lg" fontWeight="semibold" color="gray.700" py={3} isNumeric>수익 금액(USD)</Th>
                                    <Th fontSize="lg" fontWeight="semibold" color="gray.700" py={3} isNumeric>수익 금액(KRW)</Th>
                                    <Th fontSize="lg" fontWeight="semibold" color="gray.700" py={3} isNumeric>수익률(%)</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {StockList.map((stock, index) => {
                                    const usdProfit = (tableData[stock].market_price - tableData[stock].total_average) * tableData[stock].total_amount;
                                    const krwProfit = usdProfit * tableData[stock].usd_rate;
                                    const usdProfitRate = ((tableData[stock].market_price / tableData[stock].total_average) - 1) * 100;

                                    return (
                                        <Tr key={index} _hover={{ bg: "gray.50" }}>
                                            <Td py={2}>
                                                <Text fontWeight="medium" color="blue.600">{stock}</Text>
                                            </Td>
                                            <Td isNumeric>
                                                <Text fontWeight="medium" color={usdProfit > 0 ? "green.500" : "red.500"}>
                                                    {tableData[stock].currency === "usd"
                                                        ? `$ ${usdProfit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` 
                                                        : '-'
                                                    }
                                                </Text>
                                            </Td>
                                            <Td isNumeric>
                                                <Text fontWeight="medium" color={krwProfit > 0 ? "green.500" : "red.500"}>
                                                    {tableData[stock].currency === "usd"
                                                            ? `₩ ${krwProfit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` 
                                                            : `₩ ${usdProfit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` 
                                                    }
                                                </Text>
                                            </Td>
                                            <Td isNumeric>
                                                <Text fontWeight="medium" color={usdProfitRate > 0 ? "green.500" : "red.500"}>
                                                    {usdProfitRate.toFixed(2)}%
                                                </Text>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                            <Tfoot borderTop="2px" borderColor="gray.300" bg="gray.50">
                                <Th fontSize="lg" fontWeight="semibold" color="gray.700" py={3}>카테고리 전체</Th>
                                <Th fontSize="lg" fontWeight="semibold" color="gray.700" py={3} isNumeric>
                                    <Text fontWeight="medium" color={totalUsdProfit > 0 ? "green.500" : "red.500"}>
                                        $ {totalUsdProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Text>
                                </Th>
                                <Th fontSize="lg" fontWeight="semibold" color="gray.700" py={3} isNumeric>
                                    <Text fontWeight="medium" color={totalKrwProfit > 0 ? "green.500" : "red.500"}>
                                        ₩ {totalKrwProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Text>
                                </Th>
                                <Th fontSize="lg" fontWeight="semibold" color="gray.700" py={3} isNumeric>
                                    <Text fontWeight="medium" color={totalProfitRate > 0 ? "green.500" : "red.500"}>
                                        {totalProfitRate.toFixed(2)}%
                                    </Text>
                                </Th>
                            </Tfoot>
                        </Table>
                    </TableContainer>
                </Box>
            </Flex>
            
        )   
    } else {
        return(
            <div>
                Loading......
            </div>
        )
        
    }
     
       
}
