import React, { useState } from 'react';
import { Box, Card, CardBody, Checkbox, CheckboxGroup, Flex, Heading, Stack, Text, VStack } from '@chakra-ui/react';

import 'chartjs-adapter-date-fns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTransUpdate } from '../api';
import { ApiResponse } from './Root';
import { CartesianGrid, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';


interface CategoryGraphProps {
    categoryName: string | undefined;
}



export default function CategoryGraph({categoryName} : CategoryGraphProps) {
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

    const {data: totalData, isLoading: dataLoading} = useQuery<ApiResponse>({
        queryKey: ['update_complete'], 
        queryFn: getTransUpdate,
    })
    console.log(totalData)

    if (totalData) {
        const stockData = totalData.stock_data[`${categoryName}`]
        const firstNonZeroIndex = stockData.findIndex(entry => entry.total_asset !==0)
        console.log(firstNonZeroIndex)
        const filteredstockData = stockData.slice(firstNonZeroIndex)
        console.log(filteredstockData)
        /*console.log(stockDataset)
        const firstNonZeroIndex = stockDataset.findIndex(entry => entry.total_asset !== 0);
        const stockData = stockDataset.slice(firstNonZeroIndex);*/

        const maxTotalAsset = Math.max(...filteredstockData.map(item => item["total_asset"] as number))
        const yMax = Math.ceil(maxTotalAsset/ 10000000) * 10000000;

        const formatYAxis = (tickItem: number) => {
            return tickItem.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };

        console.log(stockData)
        const stockDataFirst = stockData[0]
        const stockKey : {[key:string] : any} = {}

        for (const key in stockDataFirst) {
            if (key !== "date" && key !== "total_asset") {
                stockKey[key] = stockDataFirst[key]
            }
        }
        
        
        console.log(stockKey)
        
        console.log(categoryName)
        return(
            <Card mt={5} boxShadow="lg" borderRadius="xl">
                <CardBody>
                    <VStack spacing={6} align="stretch">
                        <Heading size="md" color="blue.600">{categoryName} 자산 추이</Heading>
                        <Box maxHeight="150px" overflowY="auto" pr={2}>
                            <CheckboxGroup value={selectedLabels} onChange={(value) => setSelectedLabels(value as string[])}>
                                <Stack direction={["column", "row"]} spacing={[2, 4]} wrap="wrap">
                                    {Object.keys(stockKey).map((stock) => (
                                        <Checkbox key={stock} value={stock}>
                                            {stock}
                                        </Checkbox>
                                    ))}
                                </Stack> 
                            </CheckboxGroup>
                        </Box>
                    </VStack>
                    <Box height="300px">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={filteredstockData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis
                                    tickFormatter={formatYAxis}
                                    padding={{top:20, bottom:20}}
                                    width={120} 
                                />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="total_asset" stroke="#8884d8" strokeWidth={3} dot={false} />
                                {selectedLabels.map((stock) => (
                                    <Line 
                                        key={stock} 
                                        type="monotone" 
                                        dataKey={stock} 
                                        stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} 
                                        dot={false}    
                                    />
                                ))}

                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </CardBody>
            </Card>
            
        )
    } else {
        return(
            <Box>
                <Heading>로딩 중입니다........</Heading>
            </Box>
        )
    }

}