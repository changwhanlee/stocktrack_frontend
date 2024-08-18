import { Box, Button, HStack } from "@chakra-ui/react";
import { Link, Outlet } from "react-router-dom";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AiOutlineStock } from "react-icons/ai";
import Header from "./Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { createContext, useContext, useState } from "react";

export interface Owner {
  name: string;
}

export interface TotalTrans {
  id: number;
  owner: Owner;
  category_krw_total: number;
  category_usd_total: number;
  usd_rate: number;
  total_asset: number;
  date: string;
}

export interface StockDataEntry {
  date: string;
  [key: string]: number | string;
}

export interface StockData {
  [key: string]: StockDataEntry[];
}

export interface ApiResponse {
  total_trans: TotalTrans[];
  stock_data: StockData;
}

interface GoodDataContextType {
  goodData: ApiResponse | null;
  setGoodData: React.Dispatch<React.SetStateAction<ApiResponse | null>>;
}

const GoodDataContext = createContext<GoodDataContextType | undefined>(undefined);

const GoodDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [goodData, setGoodData] = useState<ApiResponse | null>(null);

  return (
    <GoodDataContext.Provider value={{ goodData, setGoodData }}>
      {children}
    </GoodDataContext.Provider>
  );
};

export const useGoodData = () => {
  const context = useContext(GoodDataContext);
  if (!context) {
    throw new Error('useGoodData must be used within a GoodDataProvider');
  }
  return context;
};

export default function Root() {
  return (
    <GoodDataProvider>
      <Box bg="gray.100" w="100%" h="100vh" >
        <Box position="fixed" top="0" left="0" w="100%" zIndex="1000" bg="gray.100">
          <Header  />
        </Box>
        <Box mt="60px">
          <Outlet />
        </Box>
        <ReactQueryDevtools />
      </Box>   
    </GoodDataProvider>
  );
}