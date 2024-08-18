import React, { useMemo } from 'react';
import { Box, Card, CardHeader, CardBody, Flex, Heading, Button, Table, Thead, Tbody, Tr, Th, Td, Link } from "@chakra-ui/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

interface IBankDashboard {
    bankResult: { [key: string]: IBankData[] };
}

interface ChartData {
    period: string;
    [bank: string]: string | number;
  }

export default function BankBarGraph({bankResult} : IBankDashboard ) {
    console.log(bankResult)
    const calculateProfitForPeriod = (data : IBankData[], days : number) : number => {
        const latestDate = new Date(data[data.length - 1].date);
        const targetDate = new Date(latestDate.getTime() - days * 24 * 60 * 60 * 1000);
        
        let startIndex = data.findIndex(item => new Date(item.date) >= targetDate);
        if (startIndex === -1) startIndex = 0;
        
        const startData = data[startIndex];
        const endData = data[data.length - 1];
        
        return endData.total_asset - startData.total_asset;
    };

    const chartData: ChartData[] = useMemo(() => {
      const periods = ['1주일', '1달', '1년', '전체'];

      return periods.map(period => {
          const periodData: ChartData = { period };

          Object.entries(bankResult).forEach(([bank, data]) => {
              let days;
              if (period === '1주일') days = 7;
              else if (period === '1달') days = 30;
              else if (period === '1년') days = 365;
              else days = (new Date(data[data.length - 1].date).getTime() - new Date(data[0].date).getTime()) / (1000 * 60 * 60 * 24); // 전체 기간 일 수 계산
              
              periodData[bank] = calculateProfitForPeriod(data, days);
          });

          return periodData;
      });
  }, [bankResult]);
    
  console.log(chartData)
  const formatYAxis = (tick: number) => {
    return tick.toLocaleString();
  };

  const findMinMax = () => {
    let min = 0;
    let max = 0;

    chartData.forEach((data) => {
      Object.values(data).forEach(value => {
        if (typeof value == "number") {
          if (value < min) min = value;
          if (value > max) max = value;
        }
      });
    });
    if (max === 0) {
      max = -min
    }
    max = max + 1000000
    min = min - 1000000

    return [min, max]
  }

  const [minY, maxY] = findMinMax();


  if (bankResult) {
      return(
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
              <XAxis dataKey="period" />
              <YAxis 
                width={80}
                tickFormatter={formatYAxis}
                domain={[minY, maxY]}
                allowDataOverflow={true}
              />
              <Tooltip />
              <Legend />
              {Object.keys(bankResult).map((bank, index) => (
                  <Bar key={bank} dataKey={bank} fill={`hsl(${index * 60}, 70%, 50%)`} />
              ))}
          </BarChart>
        </ResponsiveContainer>
      )
  } else {
      return(
          <div>nogood</div>
      )
  }
}