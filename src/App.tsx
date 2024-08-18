import React from 'react';
import './App.css';
import { Text } from '@chakra-ui/react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);


function App() {
  const data: ChartData<'doughnut'> = {
    labels: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'],
    datasets: [
      {
        label: 'Stock Portfolio',
        data: [300, 250, 200, 220, 280],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };


  return <div style={{ width: '40%', height: '40%' }}>
    <Doughnut data={data} options={options} />
  </div>;
};

export default App;
