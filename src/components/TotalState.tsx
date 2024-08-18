import { Box, Card, CardBody, CardHeader, Grid, GridItem, HStack, SimpleGrid, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber, Text, VStack } from '@chakra-ui/react';
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
    if (updatedTotal) {
        const firstTotal = Number(updatedTotal[0].total_asset.toFixed(1));
        const firstKrwTotal = Number(updatedTotal[0].category_krw_total.toFixed(1));
        const firstUsdTotal = Number(updatedTotal[0].category_usd_total.toFixed(1));

        const firstDate = updatedTotal[0].date
        const latestTotal = Number(updatedTotal[updatedTotal.length -1].total_asset.toFixed(1));
        const latestKrwTotal = Number(updatedTotal[updatedTotal.length -1].category_krw_total.toFixed(1));
        const latestUsdTotal = Number(updatedTotal[updatedTotal.length -1].category_usd_total.toFixed(1));

        const krwPercentage = (latestKrwTotal / latestTotal) * 100;
        const usdPercentage = 100 - krwPercentage

        const latestDate = updatedTotal[updatedTotal.length -1].date

        const formatedlatestTotal = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(latestTotal);

        const formatedLatestKrwTotal = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(latestKrwTotal)
        
        const formatedLatestUsdTotal = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(latestUsdTotal)


        const assetChange = latestTotal - firstTotal;
        const formatedassetChange = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(assetChange);

        
        return(
            <div>
                <Box borderRadius="md"  p={2} m={3} h="180px" bg="white">
                    <Grid
                        h="130px"
                        p={0}
                        templateColumns='repeat(6, 1fr)'
                        gap={0}
                    >
                        <GridItem colSpan={2}>
                            <Box>
                                <Stat>  
                                    <StatLabel mt={2} fontSize="lg">포트폴리오 총 금액(원화 기준)</StatLabel>
                                    <StatNumber mt={1} fontSize="2xl"> ₩ {formatedlatestTotal} </StatNumber>
                                    <StatHelpText fontSize="lg" mt={1}>
                                        <StatArrow type={assetChange >= 0 ? 'increase' : 'decrease'}/>
                                            {((assetChange / firstTotal) * 100).toFixed(2)}% ({formatedassetChange})           
                                    </StatHelpText >               
                                    <StatHelpText >
                                        {firstDate} ~ {latestDate}
                                    </StatHelpText>
                                </Stat>
                            </Box>
                        </GridItem>
                        <GridItem colSpan={4}>
                            <SimpleGrid columns={2} spacing={4} mb={4}>
                                <StatGroup>
                                    <Stat>
                                        <StatLabel mt={2} fontSize="lg" >포트폴리오 중 원화 금액</StatLabel>
                                        <StatNumber mt={1} color="blue.700" fontSize="2xl"> ₩ {formatedLatestKrwTotal} </StatNumber>
                                        <StatHelpText fontSize="lg" mt={1}>
                                            <StatArrow type={assetChange >= 0 ? 'increase' : 'decrease'}/>
                                                {((assetChange / firstTotal) * 100).toFixed(2)}% ({formatedassetChange})           
                                        </StatHelpText>
                                    </Stat>
                                </StatGroup>
                                <StatGroup>
                                    <Stat>
                                        <StatLabel mt={2} fontSize="lg"  >포트폴리오 중 달러 금액</StatLabel>
                                        <StatNumber mt={1} color="red.600" fontSize="2xl"> $ {formatedLatestUsdTotal} </StatNumber>
                                        <StatHelpText fontSize="lg" mt={1}>
                                            <StatArrow type={assetChange >= 0 ? 'increase' : 'decrease'}/>
                                                {((assetChange / firstTotal) * 100).toFixed(2)}% ({formatedassetChange})           
                                        </StatHelpText>
                                    </Stat>
                                </StatGroup>
                            </SimpleGrid>
                            <HStack spacing={0}>
                                <Box bg="blue.500" 
                                    width={`${krwPercentage}%`} 
                                    borderTopLeftRadius="md" 
                                    borderBottomLeftRadius="md"
                                    overflow="visible"
                                    whiteSpace="nowrap"
                                >
                                    <Text color="white">KRW</Text>
                                </Box>
                                <Box bg="red.500" width={`${usdPercentage}%`} display="flex" justifyContent="flex-end" borderTopRightRadius="md" borderBottomRightRadius="md">
                                    <Text color="white">USD</Text>
                                </Box>
                            </HStack>

                            
                        </GridItem>
                    </Grid>
                         
                </Box>
                
            </div>
        )
    } else {
        return(
            <div>
                No data available
            </div>    
        )
        
    }
}
