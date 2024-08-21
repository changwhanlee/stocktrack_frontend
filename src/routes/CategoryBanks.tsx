import { Box, Button, Card, CardBody, CardHeader, Checkbox, CheckboxGroup, Container, Flex, FormControl, FormHelperText, FormLabel, Grid, GridItem, HStack, Heading, Input, Select, SimpleGrid, Stack, Stat, StatLabel, StatNumber, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, useToast } from "@chakra-ui/react";
import useUser from "../lib/useUser";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IRegisterStockVariales, createStock, getCategoryBanks, getCategoryName, getTotalAsset, logOut, readCategoryStocks, usernameLogIn } from "../api";
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import BankTable from "../components/BankTable";
import BankBarGraph from "../components/BankBarGraph";


interface IBankData {
    id: number;
    category: {
      pk: number;
      name: string;
      classification: string;
    };
    asset_krw: number;
    asset_usd: number;
    usd_rate: number;
    total_asset: number;
    date: string;
    realize_money: number;
}

interface ITotalResult {
    date: string;
    asset_krw: number;
    asset_usd: number;
    total_asset: number;
}

interface IBankDashboard {
    bank_result: { [key: string]: IBankData[] };
    total_result: ITotalResult[];
}

export default function BankDashBoard() {
    const {data, isLoading} = useQuery<IBankDashboard>({queryKey: ['categoryBanks'], queryFn: getCategoryBanks});
    const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    if (isLoading) return <Box>Loading..............</Box>
    const bankResult = data?.bank_result
    const totalResult = data?.total_result

    if (bankResult && totalResult) {
        console.log('total____________________________________')
        console.log(totalResult)
        if (Object.entries(bankResult).length === 0) {
            return (
                <VStack bg="gray.100" minH="100vh">
                    <Heading mt="20%">예금 계좌를 </Heading>
                    <Heading mt={5}>등록하세요</Heading>
                    <Link to={'/register/category/bank'}>
                        <Button mt={6} colorScheme={"red"} variant={"link"} fontSize="x-large">
                            예금계좌 등록하러 가기 &rarr;
                        </Button>
                    </Link>
                </VStack>
            );
        } else if (Object.entries(bankResult).length > 0) {
            const latestTotal = totalResult[totalResult.length -1];
            const initialTotal = totalResult[0];
            const totalProfitRate = ((latestTotal.total_asset - initialTotal.total_asset) / initialTotal.total_asset * 100).toFixed(2);
            
            const formatDate = (dateString: string) => {
                const date = new Date(dateString);
                const year = date.getFullYear();
                const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더합니다.
                const day = date.getDate();
                return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
            };

            const chartData = totalResult.map(item => ({
                date: formatDate(item.date),
                총자산: item.total_asset,
                ...Object.keys(bankResult).reduce((acc, bank) => {
                    const bankData = bankResult[bank].find(b => b.date === item.date);
                    return { ...acc, [bank]: bankData ? bankData.total_asset : 0 };
                }, {})
            }));

            const midIndex = Math.floor((totalResult.findIndex(item => item.date === latestTotal.date) + totalResult.findIndex(item => item.date === initialTotal.date)) / 2);
            const midTotal = totalResult[midIndex];
            console.log('------------------------------')
            console.log(bankResult)

            return(
                <Container maxW="container.xl" py={8}>
                    <VStack spacing={8} align="stretch">
                        <Heading size="xl" color="green.600" textAlign="center">예금 상황 대시보드</Heading>
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                            <Stat>
                            <Card>
                                <CardHeader>
                                    <Text fontSize="xl" color="blue.500" fontWeight="bold">{formatDate(latestTotal.date)}</Text>
                                </CardHeader>
                                <CardBody>
                                    <StatNumber fontSize="2xl" color="green.500">
                                        {latestTotal.total_asset.toLocaleString()}원
                                    </StatNumber>
                                </CardBody>
                            </Card>
                            </Stat>
                            <Stat>
                                <Card>
                                    <CardHeader>
                                        <Text fontSize="xl" color="blue.500" fontWeight="bold">{formatDate(midTotal.date)}</Text>
                                    </CardHeader>
                                    <CardBody>
                                        <StatNumber fontSize="2xl" color="green.500">
                                            {midTotal.total_asset.toLocaleString()}원
                                        </StatNumber>
                                    </CardBody>
                                </Card>
                            </Stat>
                            <Stat>
                            <Card>
                                <CardHeader>
                                    <Text fontSize="xl" color="blue.500" fontWeight="bold">{formatDate(initialTotal.date)} (처음 날짜)</Text>
                                </CardHeader>
                                <CardBody>
                                    <StatNumber fontSize="2xl" color="green.500">
                                        {initialTotal.total_asset.toLocaleString()}원
                                    </StatNumber>
                                </CardBody>
                            </Card>
                            </Stat>
                        </SimpleGrid>

                        <Card mb={4}>
                            <CardHeader>
                                <Heading size="md" color="green.600">예금 추이 그래프</Heading>
                            </CardHeader>
                            <CardBody>
                                <VStack spacing={4} align="stretch">
                                    <CheckboxGroup value={selectedBanks} onChange={(value) => setSelectedBanks(value as string[])}>
                                        <HStack wrap="wrap" spacing={4}>
                                            {Object.keys(bankResult).map((bank) => (
                                                <Checkbox key={bank} value={bank}>
                                                    {bank}
                                                </Checkbox>
                                            ))}
                                        </HStack>
                                    </CheckboxGroup>
                                    <Box height="300px">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="총자산" stroke="#3182CE" strokeWidth={3}/>
                                                {selectedBanks.map((bank) => (
                                                        <Line key={bank} type="monotone" dataKey={bank} stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                                                ))}
                                                
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Box>
                                    </VStack>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Flex justifyContent="space-between" alignItems="center">
                                    <Heading size="md" color="green.600">계좌별 상세 정보</Heading>
                                    <Link to={'/register/category/bank'}>
                                        <Button colorScheme="green" ml={20}>새로운 계좌 등록</Button>
                                    </Link>
                                </Flex>
                            </CardHeader>
                            <CardBody>
                                <Stack direction={{ base: "column", lg: "row" }} spacing={6} >
                                    <Box flex={1}>
                                        <Table variant="simple" size="sm">
                                            <Thead>
                                            <Tr>
                                                <Th fontSize="lg">은행</Th>
                                                <Th fontSize="lg">현재 잔액</Th>
                                                <Th fontSize="lg">최근 변동</Th>
                                                <Th fontSize="lg">상세 정보</Th>
                                            </Tr>
                                            </Thead>
                                            <Tbody>
                                            {Object.entries(bankResult).map(([bank, data]) => {
                                                const latestData = data[data.length - 1];
                                                const previousData = data.slice(0,-1).reverse().find(item => item.total_asset !== latestData.total_asset) || latestData
                                                console.log(previousData)
                                                const change = latestData.total_asset - previousData.total_asset;
                                                return (
                                                    <Tr key={bank}>
                                                        <Td>{bank}</Td>
                                                        <Td>{latestData.total_asset.toLocaleString()}원</Td>
                                                        <Td color={change >= 0 ? "green.500" : "red.500"}>
                                                            {change >= 0 ? "+" : ""}{change.toLocaleString()}원
                                                        </Td>
                                                        <Td>
                                                            <Button size="sm" colorScheme="blue" variant="outline" onClick={() => setSelectedCategoryId(latestData.category.pk)}>
                                                                상세 보기
                                                            </Button>
                                                        </Td>
                                                    </Tr>
                                                );
                                            })}
                                            </Tbody>
                                        </Table>
                                    </Box>
                                    <Box flex={1} height="380px">
                                        <BankBarGraph bankResult={bankResult} />
                                    </Box>
                                </Stack>
                            </CardBody>
                        </Card>
                        {selectedCategoryId && (
                            <Card mt={6} boxShadow="md" borderWidth="1px" borderColor="blue.100">
                                <CardHeader bg="blue.50" textAlign="center">
                                    <Heading size="md" color="blue.600">은행별 상세 정보</Heading>
                                </CardHeader>
                                <CardBody overflowX="auto">
                                    <BankTable categoryPk={selectedCategoryId} />
                                </CardBody>
                            </Card>
                        )}
                    </VStack>
                </Container>
            )
        } else {
            return <Box>Loading.......</Box>;
        }
    } else {
        return(
            <Box>good</Box>
        )
    }
}