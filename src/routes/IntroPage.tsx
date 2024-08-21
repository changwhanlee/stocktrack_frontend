import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  VStack, 
  Grid, 
  GridItem, 
  useColorModeValue, 
  Icon,
  BoxProps,
  HeadingProps,
  TextProps,
  ButtonProps,
  useDisclosure,
  SimpleGrid
} from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { FaChartLine, FaTable, FaUserShield, FaMobileAlt } from 'react-icons/fa';
import { IconType } from 'react-icons';
import SignUpModal from '../components/SignUpModal';

// Define types for our data
interface ChartDataItem {
  date: string;
  [key:string]: string | number;
}

interface TableDataItem {
    카테고리: string;
    보유주식: string;
    총자산가치: string;
    올해수익률: string;
    전체자산대비비중: string;
}

interface FeatureCardProps extends BoxProps {
  icon: IconType;
  title: string;
  description: string;
}

const IntroPage: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const highlightColor = useColorModeValue('teal.500', 'teal.300');

  // Dummy data for the Bar Chart
  const barChartData: ChartDataItem[] = [
    { date : '2020', 올웨더 : 500, 영구포트폴리오 : 200, 예금 : 300, 개별주식 : 200 },
    { date : '2021', 올웨더 : 700, 영구포트폴리오 : 300, 예금 : 350, 개별주식 : 250 },
    { date : '2022', 올웨더 : 750, 영구포트폴리오 : 450, 예금 : 400, 개별주식 : 200 },
    { date : '2023', 올웨더 : 850, 영구포트폴리오 : 600, 예금 : 650, 개별주식 : 300 },
    { date : '2024', 올웨더 : 1000, 영구포트폴리오 : 800, 예금 : 700, 개별주식 : 350 },
  ];

  // Dummy data for the Table
const tableData: TableDataItem[] = [
    { 카테고리: '국내 주식', 보유주식: '200', 총자산가치: '₩10,000,000', 올해수익률: '8%', 전체자산대비비중: '50%' },
    { 카테고리: '해외 주식', 보유주식: '100', 총자산가치: '₩5,000,000', 올해수익률: '12%', 전체자산대비비중: '25%' },
    { 카테고리: 'ETF', 보유주식: '50', 총자산가치: '₩3,000,000', 올해수익률: '6%', 전체자산대비비중: '15%' },
    { 카테고리: '채권', 보유주식: 'N/A', 총자산가치: '₩1,500,000', 올해수익률: '3%', 전체자산대비비중: '7.5%' },
    { 카테고리: '현금', 보유주식: 'N/A', 총자산가치: '₩500,000', 올해수익률: '1%', 전체자산대비비중: '2.5%' },
];

  const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, ...rest }) => (
    <Box  bg={cardBgColor} p={6} borderRadius="lg" boxShadow="md" height="100%" {...rest}>
      <Icon as={icon} w={10} h={10} color={highlightColor} mb={4} />
      <Heading as="h3" size="md" mb={2}>
        {title}
      </Heading>
      <Text color={textColor}>{description}</Text>
    </Box >
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="gray.100" minHeight="100vh" py={[5, 10]}>
      <Box maxWidth="1200px" margin="auto" px={[4, 6]}>
        <VStack spacing={16}>
          {/* Header Section */}
          <Box textAlign="center" maxWidth="800px" w="100%">
            <Heading as="h1" size={["xl", "2xl"]} mb={4} color={highlightColor}>
              자산을 체계적으로 관리해보세요!
            </Heading>
            <Text fontSize={["lg", "xl"]} color={textColor} mb={8}>
             포트폴리오를 시각화하고, 추적하며, 손쉽게 최적화하세요.
            </Text>
            <Button colorScheme="teal" size="lg" fontSize="md" fontWeight="bold" px={8} onClick={onOpen}>
              Start Your Journey
            </Button>
          </Box>

          {/* Feature Grid */}
          <SimpleGrid columns={[1, null, 2]} spacing={8} w="100%">
            {/* Bar Chart Feature */}
            <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="md" gridColumn={["1", null, "span 2"]}>
              <Heading as="h2" size="lg" mb={4}>
                자산 배분 현황
              </Heading>
              <Box height={["300px", "400px"]}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={barChartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="올웨더" stroke="#d81f1e" strokeWidth={2} />
                    <Line type="monotone" dataKey="영구포트폴리오" stroke="#d7d81e" strokeWidth={2} />
                    <Line type="monotone" dataKey="예금" stroke="#7ad81e" strokeWidth={2} />
                    <Line type="monotone" dataKey="개별주식" stroke="#d81ed7" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
              <Text mt={4} color={textColor}>
                다양한 카테고리의 자산을 관리하고, 시각화하세요!
              </Text>
            </Box>

            {/* Table Feature */}
            <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="md" gridColumn={["1", null, "span 2"]} overflowX="auto">
              <Heading as="h2" size="lg" mb={4}>
                포트폴리오 상세내용
              </Heading>
              <TableContainer>
                <Table variant="simple" size={["sm", "md"]}>
                  <Thead>
                    <Tr>
                      <Th>카테고리</Th>
                      <Th>주식 수</Th>
                      <Th isNumeric>총 자산가치</Th>
                      <Th isNumeric>올해 수익률</Th>
                      <Th isNumeric>전체 자산대비 비중</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tableData.map((row, index) => (
                      <Tr key={index}>
                        <Td>{row.카테고리}</Td>
                        <Td>{row.보유주식}</Td>
                        <Td isNumeric>{row.총자산가치}</Td>
                        <Td isNumeric>{row.올해수익률}</Td>
                        <Td isNumeric>{row.전체자산대비비중}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <Text mt={4} color={textColor}>
                현재 포트폴리오 배분 현황을 빠르게 확인하세요
              </Text>
            </Box>
          </SimpleGrid>

          {/* Additional Features */}
          <SimpleGrid columns={[1, 2, 4]} spacing={8} w="100%">
            <FeatureCard
              icon={FaChartLine}
              title="실시간 분석"
              description="실시간 시장 데이터와 포트폴리오 성과 지표를 통해 항상 최신 상태를 유지합니다"
            />
            <FeatureCard
              icon={FaTable}
              title="맞춤형 분석"
              description="주식 전략, 예금 별 맞춤형 자산형황 분석을 제공합니다"
            />
            <FeatureCard
              icon={FaUserShield}
              title="안전한 서비스"
              description="안전한 보안시스템으로 금융데이터 유출을 보호합니다"
            />
            <FeatureCard
              icon={FaMobileAlt}
              title="모바일 환경"
              description="모바일 앱을 통해 언제 어디서나 투자를 관리하세요"
            />
          </SimpleGrid>

          {/* Call to Action Section */}
          <Box textAlign="center" bg={cardBgColor} p={10} borderRadius="lg" boxShadow="md" width="100%">
            <Heading as="h2" size="xl" mb={4}>
              자산현황을 체계적으로 관리할 준비가 되셨나요?
            </Heading>
            <Button mt={5} colorScheme="teal" size="lg" fontSize="md" fontWeight="bold" px={8} onClick={onOpen}>
              Create Your Free Account
            </Button>
          </Box>
          <SignUpModal isOpen={isOpen} onClose={onClose} />
        </VStack>
      </Box>
    </Box>
  );
};

export default IntroPage;