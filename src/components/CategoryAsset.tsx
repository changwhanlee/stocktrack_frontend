import { Box } from '@chakra-ui/react';
import React from 'react';
import { Line } from 'react-chartjs-2';

interface IcategoryName {
    pk: number;
    name : string;
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

interface ICategoryGraphProps {
    data? : ICategoryResult[]
}

export default function CategoryAssetGraph({data} : ICategoryGraphProps) {
    if (data) {
        const dates = data.map(data => data.date);
        const assets = data.map(data => data.total_asset);

        const chartData = {
            labels: dates,
            datasets: [
                {
                    label: 'Asset',
                    data: assets,
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                }
            ]
        }

        const chartOption = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top' as const
                },
                tooltip: {
                    mode: 'index' as const,
                    intersect: false
                }
            },
            scales: {
                x: {
                    type: 'time' as const,
                    time: {
                        unit: 'day' as const,
                        displayFormats: {
                            day: 'yyyy-MM-dd'
                        }
                    },
                    title: {
                        display: true,
                        text: "날짜"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Asset"
                    }
                }
            }
        };

        return (
            <Box p={4} bg="white" boxShadow="md" borderRadius="lg">
                <Line data={chartData} options={chartOption}  />
            </Box>
        )
    } else {
        return(
            <div> Loading....</div>
        )
    }
}