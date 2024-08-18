import { Box } from '@chakra-ui/react';
import React from 'react';
import { Line } from 'react-chartjs-2';

interface IcategoryName {
    pk: number;
    name : string;
}

interface IStockInformation {
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



export default function StockAssetGraph({stockName, stockData}: IStockNameAndData) {
    if (stockData && stockName) {
        const dates = stockData.map(data => data.date)
        const assets = stockData.map(data => data.total_stock_asset)

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
            <Box p={4} bg="white" boxShadow="md" borderRadius="lg" w="100%" h="100%">
                <Line data={chartData} options={chartOption} />
            </Box>
        )
    } else {
        return(
            <div> not good</div>
        )
    }
    
}