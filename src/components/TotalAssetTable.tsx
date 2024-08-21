import { Box, Flex, Grid, GridItem, HStack, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategoryStockCount } from '../api';
import { ChevronUpIcon, ChevronDownIcon, Icon } from 'lucide-react';


interface IcategoryName {
    pk: number;
    name: string;
    classification: string;
}
interface IAsset {
    id: number;
    category: IcategoryName;
    asset_krw: number;
    asset_usd: number;
    usd_rate: number;
    total_asset: number;
    date: string;
    realize_money: number;
}

interface ICategory {
    [key:string] : IAsset[]
}

interface ITotalAsset{
    data? : { result : ICategory}
}

interface IStockCount {
    [key:string] : number;
}

interface ICategoryStockCount {
    count : IStockCount;
}

export default function TotalAssetTable({data} : ITotalAsset) {
    const {data: categoryStockCount, isLoading: countLoading} = useQuery<ICategoryStockCount>({queryKey: ['category_stock_count'], queryFn: getCategoryStockCount})
    const result = data?.result
    const stockCount = categoryStockCount?.count
    console.log(categoryStockCount)

    console.log(result)
    const [sortColumn, setSortColumn] = useState<'total_asset' | 'yearly_return' | 'percent_on_total'>('total_asset');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const handleSort = (column: 'total_asset' | 'yearly_return' | 'percent_on_total') => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('desc');
        }
    };

    if (result && stockCount) {
        const categoryList = Object.keys(result)

        const getLastesTotalAssetByCategory = (result: ICategory) => {
            const latestAssets: {[key:string] : number} = {}
            Object.keys(result).forEach(category => {
                const assets = result[category];
                if (assets.length >0) {
                    assets.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    const latestAsset = assets[assets.length - 1];
                    console.log('latesasset-------------------------------')
                    console.log(latestAsset)
                    const latestTotalAsset = latestAsset.total_asset
                    latestAssets[category] = Math.round(latestTotalAsset * 10) / 10;
                } else {
                    latestAssets[category] = 0
                }
            });
            return latestAssets
        }
        const latestTotalAssets = getLastesTotalAssetByCategory(result);

        const getYearlyReturnByCategory = (result: ICategory) => {
            const yearlyReturns: {[key:string]: number} = {}

            Object.keys(result).forEach(category => {
                const assets = result[category];
                if (assets.length > 0) {
                    assets.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    const initialAsset = assets.find(asset => asset.total_asset !== 0);
                    const latestAsset = assets[assets.length - 1];
                    if (initialAsset && latestAsset && initialAsset.total_asset !==0) {
                        // 수익률 계산: ((최신 자산 - 초기 자산) / 초기 자산) * 100
                        const yearlyReturn = ((latestAsset.total_asset - initialAsset.total_asset) / initialAsset.total_asset) * 100;
                        yearlyReturns[category] = Math.round(yearlyReturn * 10) / 10; // 소수 첫째자리에서 반올림
                    } else {
                        yearlyReturns[category] = 0;
                    }
                } else {
                    yearlyReturns[category] = 0;
                }                
            });
            return yearlyReturns;
        }
        const yearlyReturns = getYearlyReturnByCategory(result);
        console.log(yearlyReturns)

        const getPercentOnTotal = (result: ICategory) => {
            const percent : {[key:string]: number} ={};
            const latest : {[key:string]: number} ={};
            let total = 0;
            const categoryCount = Object.keys(result).length
            Object.keys(result).forEach(category => {
                const assets = result[category];
                if (assets.length >0) {
                    assets.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    const latestAsset = assets[assets.length -1];
                    const latestReturn = latestAsset.total_asset
                    latest[category] = Math.round(latestReturn * 10) / 10;
                    total += latestReturn
                } else {
                    latest[category] = 0
                }
            });

            Object.keys(result).forEach(category => {
                const percentage = latest[category] / total *100
                percent[category] = Math.round(percentage *10) / 10;
            })
            return percent
        }

        const percent = getPercentOnTotal(result);
        console.log(percent)


        return(
            <Flex width="100%" flexDirection="column" alignItems="center" mt={10}  >
                <Box width="95%" overflow="auto" bg="white" boxShadow="lg" borderRadius="xl" maxHeight="700px" mb={10}>
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
                                    <Th fontSize="lg" fontWeight="semibold" color="gray.700" py={3}>카테고리</Th>
                                    <Th fontSize="lg" fontWeight="semibold" color="gray.700" py={3} isNumeric>보유 주식 종류</Th>
                                    <Th
                                    fontSize="lg"
                                    fontWeight="semibold"
                                    color="gray.700"
                                    py={3}
                                    isNumeric
                                    onClick={() => handleSort('total_asset')}
                                    cursor="pointer"
                                >
                                    총 자산 가치 {sortColumn === 'total_asset' && (
                                        <Box as={sortDirection === 'asc' ? ChevronUpIcon : ChevronDownIcon} ml={2} />
                                    )}
                                </Th>
                                <Th
                                    fontSize="lg"
                                    fontWeight="semibold"
                                    color="gray.700"
                                    py={3}
                                    isNumeric
                                    onClick={() => handleSort('yearly_return')}
                                    cursor="pointer"
                                >
                                    올해 수익률 {sortColumn === 'yearly_return' && (
                                        <Box as={sortDirection === 'asc' ? ChevronUpIcon : ChevronDownIcon} ml={2} />
                                    )}
                                </Th>
                                <Th
                                    fontSize="lg"
                                    fontWeight="semibold"
                                    color="gray.700"
                                    py={3}
                                    isNumeric
                                    onClick={() => handleSort('percent_on_total')}
                                    cursor="pointer"
                                >
                                    전체 자산대비 비중 {sortColumn === 'percent_on_total' && (
                                        <Box as={sortDirection === 'asc' ? ChevronUpIcon : ChevronDownIcon} ml={2} />
                                    )}
                                </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {categoryList
                                    .sort((a, b) => {
                                        const aValue =
                                            sortColumn === 'total_asset'
                                                ? latestTotalAssets[a]
                                                : sortColumn === 'yearly_return'
                                                    ? yearlyReturns[a]
                                                    : percent[a];
                                        const bValue =
                                            sortColumn === 'total_asset'
                                                ? latestTotalAssets[b]
                                                : sortColumn === 'yearly_return'
                                                    ? yearlyReturns[b]
                                                    : percent[b];
                                        return sortDirection === 'asc'
                                            ? aValue - bValue
                                            : bValue - aValue;
                                    })
                                    .map((category, index) => (
                                        <Tr key={index}>
                                            <Td py={3}>
                                                <Text fontWeight="medium" fontSize="lg">{category}</Text>
                                            </Td>
                                            <Td py={3} isNumeric>
                                                <Text fontWeight="medium">{stockCount[category]}</Text>
                                            </Td>
                                            <Td py={3} isNumeric>
                                                <Text fontWeight="medium">
                                                    ₩{Number(latestTotalAssets[category]).toLocaleString()}
                                                </Text>
                                            </Td>
                                            <Td py={3} color={yearlyReturns[category] < 0 ? 'red.500' : 'blue.500'} fontWeight="bold" isNumeric>
                                                {yearlyReturns[category]} %
                                            </Td>
                                            <Td py={3} isNumeric fontWeight="bold">
                                                {percent[category]} %
                                            </Td>
                                        </Tr>
                                    ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            </Flex>
            
        )
    } else {
        return null
    }

}