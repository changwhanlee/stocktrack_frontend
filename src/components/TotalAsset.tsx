import React, { useMemo, useState } from 'react';
import { Box, Card, CardBody, Checkbox, CheckboxGroup, Flex, Stack, VStack } from '@chakra-ui/react';

import 'chartjs-adapter-date-fns';
import { CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { LineChart } from 'recharts';


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


interface ITotalAssetGraphProps {
    data? : { result : ICategory}
    updatedTotal? : ICategoryTotal[]
}

export default function TotalAssetGraph({data, updatedTotal} : ITotalAssetGraphProps) {
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);


    const result = data?.result
    const total = updatedTotal
    if (result && total) {
        total.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const formatDate = (dateString: string) => {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더합니다.
            const day = date.getDate();
            return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
        };

        const chartData = total.map(item => ({
            date : formatDate(item.date),
            총자산 : item.total_asset.toFixed(1),
            ...Object.keys(result).reduce((acc, category) => {
                const categoryData = result[category].find(b => b.date === item.date);
                return {...acc, [category]: categoryData ? categoryData.total_asset.toFixed(1) : 0};
            }, {})
        }))

        const maxTotalAsset = Math.max(...chartData.map(item => parseFloat(item['총자산'])));
        const yMax = Math.ceil(maxTotalAsset / 10000000) * 10000000;

        const formatYAxis = (tickItem: number) => {
            return tickItem.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };

        console.log('chartDataaaaaa')
        console.log(chartData)
        console.log(maxTotalAsset)
        console.log(yMax)

        return (
            <div>
                <Card mt={5} >
                    <CardBody>
                        <Stack direction="row" spacing={4} mb={4}> 
                            <CheckboxGroup value={selectedLabels} onChange={(value) => setSelectedLabels(value as string[])}>
                                {Object.keys(result).map((category) => (
                                    <Checkbox key={category} value={category}>
                                        {category}
                                    </Checkbox>
                                ))}
                            </CheckboxGroup>
                        </Stack>
                        <Box height="300px">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis 
                                            domain={[0, yMax]} 
                                            tickFormatter={formatYAxis}
                                            padding={{top:20, bottom:20}}
                                            width={120}
                                        />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="총자산" stroke="#8884d8" strokeWidth={3}/>
                                        {selectedLabels.map((category) => (
                                            <Line key={category} type="monotone" dataKey={category} stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}/>
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                        </Box>
                    </CardBody>
                </Card>
                
            </div>
        )
            


        /*const lineData = Object.values(result).flat().map(item => ({
            date: item.date,
            asset: item.asset,
            category: item.category.name
        }));
        console.log(lineData)*/


    }

    /*if (result && Array.isArray(result)) {
        console.log('goodgood');
        result.forEach((categoryResult: ICategory) => {
            Object.keys(categoryResult).forEach((categoryKey) => {
                const categoryData: IAsset[] = categoryResult[categoryKey];
                console.log(categoryKey, categoryData);
            });
        });
    }

    if (Array.isArray(result)) {
        console.log('goodgood')
        result.forEach(categoryObject => {
            Object.keys(categoryObject).forEach((categoryKey, idx) => {
                const categoryData: IAsset[] = categoryObject[categoryKey];
                console.log(categoryKey, categoryData)
            });
        });
    }*/

        

    return(
        <Box>
            empty
        </Box>
    )
}