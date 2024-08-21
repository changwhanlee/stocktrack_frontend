import { Box, Card, CardBody, CardHeader, Grid, GridItem, HStack, SimpleGrid, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber, Text, useBreakpointValue, VStack } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

interface Owner {
    name: string;
  }
  
interface ICategoryTotal {
    id: number;
    owner: Owner;
    category_krw_total: number;
    category_usd_total: number;
    usd_rate: number;
    total_asset: number;
    date: string;
}

interface ICategoryTotalList {
    updatedTotal? : ICategoryTotal[]
}



export default function TotalState({updatedTotal} : ICategoryTotalList) {
    console.log(updatedTotal);
    const statFontSize = useBreakpointValue({ base: 'md', md: 'lg' });
    const statNumberFontSize = useBreakpointValue({ base: 'xl', md: '2xl' });
    if (updatedTotal) {
        const firstTotal = Number(updatedTotal[0].total_asset.toFixed(1));
        const firstKrwTotal = Number(updatedTotal[0].category_krw_total.toFixed(1));
        const firstUsdTotal = Number(updatedTotal[0].category_usd_total.toFixed(1));

        const firstDate = updatedTotal[0].date;
        const latestTotal = Number(updatedTotal[updatedTotal.length - 1].total_asset.toFixed(1));
        const latestKrwTotal = Number(updatedTotal[updatedTotal.length - 1].category_krw_total.toFixed(1));
        const latestUsdTotal = Number(updatedTotal[updatedTotal.length - 1].category_usd_total.toFixed(1));

        const krwPercentage = (latestKrwTotal / latestTotal) * 100;
        const usdPercentage = 100 - krwPercentage;

        const latestDate = updatedTotal[updatedTotal.length - 1].date;

        const formattedLatestTotal = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }).format(latestTotal);

        const formattedLatestKrwTotal = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }).format(latestKrwTotal);

        const formattedLatestUsdTotal = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }).format(latestUsdTotal);

        const assetChange = latestTotal - firstTotal;
        const formattedAssetChange = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }).format(assetChange);

        

        
        return(
            <Box borderRadius="md" p={4} m={3} bg="white">
                <Grid
                    templateColumns={{ base: '1fr', md: 'repeat(6, 1fr)' }}
                    gap={4}
                >
                    <GridItem colSpan={{ base: 6, md: 2 }}>
                        <Box>
                            <Stat>
                                <StatLabel mt={2} fontSize={statFontSize} fontWeight="bold">
                                    포트폴리오 총 금액(원화 기준)
                                </StatLabel>
                                <StatNumber mt={1} fontSize={statNumberFontSize}>
                                    ₩ {formattedLatestTotal}
                                </StatNumber>
                                <StatHelpText fontSize={statFontSize} mt={1}>
                                    <StatArrow type={assetChange >= 0 ? 'increase' : 'decrease'} />
                                    {((assetChange / firstTotal) * 100).toFixed(2)}% ({formattedAssetChange})
                                </StatHelpText>
                                <StatHelpText fontSize={statFontSize}>
                                    {firstDate} ~ {latestDate}
                                </StatHelpText>
                            </Stat>
                        </Box>
                    </GridItem>
                    <GridItem colSpan={{ base: 6, md: 4 }}>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                            <StatGroup>
                                <Stat>
                                    <StatLabel mt={2} fontSize={statFontSize} fontWeight="bold">
                                        포트폴리오 중 원화 금액
                                    </StatLabel>
                                    <StatNumber mt={1} color="blue.700" fontSize={statNumberFontSize}>
                                        ₩ {formattedLatestKrwTotal}
                                    </StatNumber>
                                    <StatHelpText fontSize={statFontSize} mt={1}>
                                        <StatArrow type={assetChange >= 0 ? 'increase' : 'decrease'} />
                                        {((assetChange / firstTotal) * 100).toFixed(2)}% ({formattedAssetChange})
                                    </StatHelpText>
                                </Stat>
                            </StatGroup>
                            <StatGroup>
                                <Stat>
                                    <StatLabel mt={2} fontSize={statFontSize} fontWeight="bold">
                                        포트폴리오 중 달러 금액
                                    </StatLabel>
                                    <StatNumber mt={1} color="red.600" fontSize={statNumberFontSize}>
                                        $ {formattedLatestUsdTotal}
                                    </StatNumber>
                                    <StatHelpText fontSize={statFontSize} mt={1}>
                                        <StatArrow type={assetChange >= 0 ? 'increase' : 'decrease'} />
                                        {((assetChange / firstTotal) * 100).toFixed(2)}% ({formattedAssetChange})
                                    </StatHelpText>
                                </Stat>
                            </StatGroup>
                        </SimpleGrid>
                        <HStack spacing={0} mt={4}>
                            <Box
                                bg="blue.500"
                                width={`${krwPercentage}%`}
                                borderTopLeftRadius="md"
                                borderBottomLeftRadius="md"
                                overflow="visible"
                                whiteSpace="nowrap"
                                px={2}
                            >
                                <Text color="white" fontSize={statFontSize}>
                                    KRW
                                </Text>
                            </Box>
                            <Box
                                bg="red.500"
                                width={`${usdPercentage}%`}
                                display="flex"
                                justifyContent="flex-end"
                                borderTopRightRadius="md"
                                borderBottomRightRadius="md"
                                px={2}
                            >
                                <Text color="white" fontSize={statFontSize}>
                                    USD
                                </Text>
                            </Box>
                        </HStack>
                    </GridItem>
                </Grid>
            </Box>
        )
    } else {
        return(
            <div>
                No data available
            </div>    
        )
        
    }
}
