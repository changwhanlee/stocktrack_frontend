import React, { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Checkbox, Button, Box, HStack, Flex, Spacer, Text } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { getBankDetail } from '../api';
import { useQuery } from '@tanstack/react-query';

interface IProps {
    categoryPk: number;
};

interface IBankDetail {
    id: 5,
    cash_name : {
        name : string,
        currency: string,
    },
    money : number,
    date : string,
};


export default function BankTable({categoryPk} : IProps) {
    
    const {data, isLoading} = useQuery<IBankDetail[]>({queryKey : ['bankDetail', categoryPk], queryFn: getBankDetail});
    console.log(data)
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const navigate = useNavigate();
    const handleCheckboxChange = (id:number) => {
        setSelectedId(prevSelectedId => (prevSelectedId === id ? null : id));
    }

    const handleButtonClick = () => {
        if (selectedId !== null) {
            navigate(`/register/modify/bank_transaction/${selectedId}`)
        } 
    }

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const handlePageChange = (page:number) => {
        setCurrentPage(page)
    }

    

    if (isLoading || !data) {
        return(
            <div>로딩 중........</div>
        )
    } else {
        const sortedBankData = data?.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentData = sortedBankData.slice(startIndex, endIndex);
        return(
            <div>
                <Flex direction="column" h="380px"  align="center" justify="center">
                    <Text fontSize="xl" color="blue">{data[0].cash_name.name}</Text>
                    <Table mt={3} variant="striped" colorScheme='cyan' size="sm" w="500px">
                        <Thead>
                            <Tr>
                                <Th>날짜</Th>
                                <Th>보유자산</Th>
                                <Th>체크</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {currentData.map((item) => (
                                <Tr key={item.id}>
                                    <Td>{item.date}</Td>
                                    <Td>
                                        {item.cash_name.currency === "usd"
                                            ? ` $ ${item.money}`
                                            : ` ₩ ${item.money}`
                                        }
                                    </Td>
                                    <Td>
                                        <Checkbox
                                            border="0.2px solid green"
                                            ml={2}
                                            isChecked={selectedId === item.id}
                                            onChange={() => handleCheckboxChange(item.id)}
                                        />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                    <HStack>
                            {Array.from({length: Math.ceil(data.length / itemsPerPage)}, (_, i) => (
                                <Button key={i} size="sm" color="blueviolet" colorScheme='transparent' onClick={() => handlePageChange(i+ 1)}>
                                    {i + 1}
                                </Button>
                            ))}
                    </HStack>

                    <Spacer />
                    <HStack justifyContent="space-between" mt={4}>
                            <Link to={`/register/bank_transaction/${categoryPk}`}>
                                <Button colorScheme='cyan'>
                                    예금 상황 업데이트
                                </Button>
                            </Link>
                            <Button colorScheme='cyan' onClick={handleButtonClick}>선택한 날짜 수정</Button>
                    </HStack>

                </Flex>
            </div>
        )
    }

    
}