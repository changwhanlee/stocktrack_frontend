import React, { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Checkbox, Button, Box, HStack, Flex, Spacer, Text } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';


interface IcategoryName {
    pk: number;
    name : string;
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

interface IStockNameAndData {
    stockName: string;
    stockData: IStockAsset[]; 
}


export default function StockTable({stockName, stockData} : IStockNameAndData) {

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const navigate = useNavigate();
    const handleCheckboxChange = (id:number) => {
        setSelectedId(prevSelectedId => (prevSelectedId === id ? null : id));
    }


    const handleButtonClick = () => {
        if (selectedId !== null) {
            navigate(`/register/modify/stock_transaction/${selectedId}`);
        } else {
            console.log("NO Id selected")
        }
    }

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const handlePageChange = (page:number) => {
        setCurrentPage(page)
    }
    const sortedStockData = stockData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = sortedStockData.slice(startIndex, endIndex);

    if (stockData && stockName) {
        return(
            <div>
                <Flex direction="column" h="380px"  align="center" justify="center" >
                    <Text fontSize="xl" color="blue">{stockName} 매매 일지</Text>
                    <Box w="90%" mt={3} border="2px solid" borderColor="blue.500" borderRadius="lg" boxShadow="md">
                        <Table variant="simple" colorScheme="blue" size="sm" w="100%">
                            <Thead>
                                <Tr>
                                    <Th textAlign="center" py={3} fontSize="sm" color="gray.600">날짜</Th>
                                    <Th textAlign="center" py={3} fontSize="sm" color="gray.600">매매</Th>
                                    <Th textAlign="center" py={3} fontSize="sm" color="gray.600">총 보유</Th>
                                    <Th textAlign="center" py={3} fontSize="sm" color="gray.600">평단가</Th>
                                    <Th textAlign="center" py={3} fontSize="sm" color="gray.600">평가액</Th>
                                    <Th textAlign="center" py={3} fontSize="sm" color="gray.600">체크</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {currentData.map((item) => (
                                    <Tr key={item.id} _hover={{ bg: "gray.50" }}>
                                        <Td textAlign="center" py={2}>
                                            <Text fontSize="sm">{item.date}</Text>
                                        </Td>
                                        <Td textAlign="center" py={2}>
                                            <Text fontSize="sm" fontWeight="Meduim">{item.amount}</Text>
                                        </Td>
                                        <Td textAlign="center" py={2}>
                                            <Text fontSize="sm">{item.total_amount}</Text>
                                        </Td>
                                        <Td textAlign="center" py={2}>
                                            <Text fontSize="sm" color="blue.600" fontWeight="medium">
                                                {item.stock.currency === "usd" 
                                                    ? ` $ ${item.total_average_price.toFixed(1)}` 
                                                    : `₩ ${item.total_average_price.toFixed(1)}`
                                                }
                                            </Text>         
                                        </Td>
                                        <Td textAlign="center" py={2}>
                                            <Text fontSize="sm" color="green.600" fontWeight="medium">
                                                {item.stock.currency === "usd" 
                                                    ? `$${item.total_stock_asset.toFixed(2)}` 
                                                    : `₩${item.total_stock_asset.toLocaleString()}`
                                                }
                                            </Text>
                                        </Td>
                                        <Td textAlign="center" py={2}>
                                            <Checkbox
                                                colorScheme='blue'
                                                isChecked={selectedId === item.id}
                                                onChange={() => handleCheckboxChange(item.id)} 
                                            />
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                        <HStack mt={1} spacing={2} justifyContent="center">
                            {Array.from({length: Math.ceil(stockData.length / itemsPerPage)}, (_, i) => (
                                <Button key={i} size="sm" color="blueviolet" colorScheme='transparent' onClick={() => handlePageChange(i+ 1)}>
                                    {i + 1}
                                </Button>
                            ))}

                        </HStack>
                    </Box>
                    
                    <Spacer />
                    <HStack justifyContent="space-between" mt={4}>
                        <Link to={`/register/stock_transaction/${stockData[0].stock.category.pk}/${stockData[0].stock.pk}`}>
                            <Button colorScheme='cyan'>
                                세로운 매매 등록하기
                            </Button>
                        </Link>
                    <Button onClick={handleButtonClick}>선택한 매매기록 수정</Button>
                </HStack>

                </Flex>
                
                
                
            </div>

        );
    } else {
        return(
            <div>not good</div>
        )
    }
}