import { Box, Button, Container, Grid, GridItem, Heading, HStack, VStack } from "@chakra-ui/react";
import useUser from "../lib/useUser";
import { useQuery } from "@tanstack/react-query";
import { getCategoryName, getDateUpdate, getTotalAsset, getTransUpdate } from "../api";
import TotalAssetGraph from "../components/TotalAsset";
import { Link } from "react-router-dom";
import CategoryList from "../components/CategoryList";
import TotalState from "../components/TotalState";
import TotalAssetTable from "../components/TotalAssetTable";
import { ApiResponse, useGoodData } from "../components/Root";
import { useEffect } from "react";
import IntroPage from "./IntroPage";

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

interface ItotalAsset {
  result : ICategory
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


export default function Home() {
    const { setGoodData } = useGoodData();
    const { userLoading, isLoggedIn, user} = useUser();
    const { isLoading, data} = useQuery<ItotalAsset>({queryKey: ['total_asset'], queryFn: getTotalAsset});
    const {data: categoryName, isLoading: nameLoading} = useQuery<IcategoryName[]>({queryKey: ['category_name'], queryFn: getCategoryName});
    /*const {data: updatedTotal, isLoading: updateLoading} = useQuery<ICategoryTotal[]>({queryKey: ['is_updated'], queryFn: getDateUpdate});*/
    const {data: totalData, isLoading: dataLoading} = useQuery<ApiResponse>({queryKey: ['update_complete'], queryFn: getTransUpdate})

    useEffect(() => {
      if (totalData) {
        setGoodData(totalData)
      }
    }, [totalData, setGoodData])

    if (userLoading) return <Box>Loading user...</Box>;

    if (!isLoggedIn) {
      return (
      <Box>
        <IntroPage />
      </Box>
      )
    }

    if (nameLoading || dataLoading) return <Box>Loading data...</Box>;

    if (!totalData || (totalData.total_trans[0].total_asset === 0 && totalData.total_trans.length === 1)) {
      return (
        <VStack bg="gray.100" minH="100vh">
          <Heading mt="20%">카테고리를 등록하세요!</Heading>
          
          <Link to={`/register/category/stock`}>
            <Button mt={6} colorScheme={"red"} variant={"link"} fontSize="x-large">
                주식 카테고리 등록 &rarr;
            </Button>
          </Link>
          <Link to={`/register/category/bank`}>
            <Button mt={6} colorScheme={"red"} variant={"link"} fontSize="x-large">
                예금 카테고리 등록 &rarr;
            </Button>
          </Link>
        
          
        </VStack>
      )
    }
    console.log('ddddddddddddddddddddddddddddddddddddddddddddd')
    console.log(totalData)
    const updatedTotal = totalData.total_trans;

    return (
        <div>
            <Box p={4}>
                <Box mb={4} textAlign="center">
                  <Heading mt={10} mb={4}> {user.username} 님의 총 자산 현황</Heading>
                </Box>
                <Box mt={10}>
                  <TotalState updatedTotal={updatedTotal} />
                  <TotalAssetGraph data={data} updatedTotal={updatedTotal} />
                  <TotalAssetTable data={data} />
                </Box>
                
            </Box>
        </div>
    );
}

          /*
          <Grid
            h='768px'
            w="100%"
            templateRows='repeat(2, 1fr)'
            templateColumns='repeat(6, 1fr)'
            gap={4}
            px={4}
          >
            <GridItem boxShadow='dark-lg' rowSpan={2} colSpan={1} display="flex" flexDirection="column" justifyContent="space-between"> 
              <VStack spacing={0}>
                <VStack spacing={0}>
                  <Box mt={2} bg="pink.400" w="100%" textAlign="center" p={2} color="white" fontSize="lg"> 주식 카테고리 </Box>
                  {categoryName && categoryName.map((item : IcategoryName, index: number) => (
                    item.classification ==="stock" && (
                      <Link to={`read/categorystocks/${item.pk}`} style={{width: "100%"}}>
                      <Box
                        ml={2}
                        key={index}
                        textAlign="left"
                        fontSize="lg"
                        _hover={{color:"red"}}
                      >
                      {item.name}
                      </Box>
                    </Link>
                    )          
                  ))}
  
                  
                </VStack>
                <VStack mt={5}>
                  <Box mt={2} bg="gray.500" w="100%" textAlign="center" p={2} color="white" fontSize="lg"> 예금 카테고리 </Box>
                  {categoryName && categoryName.map((item : IcategoryName, index: number) => (
                    item.classification ==="bank" && (
                      <Link to={`read/categorystocks/${item.pk}`} style={{width: "100%"}}>
                      <Box
                        ml={2}
                        key={index}
                        textAlign="left"
                        fontSize="lg"
                        _hover={{color:"red"}}
                      >
                      {item.name}
                      </Box>
                    </Link>
                    )          
                  ))}
                </VStack>
  
              </VStack>
              
              <Link to={'register/category'} style={{alignSelf: "flex-end", marginBottom: "20px"}}>
                <Box
                  textAlign="center"
                  fontSize="lg"
                  _hover={{color:"green"}}
                  bg="green.300"
                >
                  새로운 카테고리 등록
                </Box>
              </Link>
  
            </GridItem>
            <GridItem boxShadow='dark-lg' rowSpan={1} colSpan={4} bg="orange.50">
              <TotalAssetGraph data={data}/>
            </GridItem>
            <GridItem boxShadow='dark-lg' rowSpan={2} colSpan={1}>
              <VStack gap={2}>
                <Link to="/register/stock">
                  <Button bg={"yellow.100"} marginTop={2} >새로운 주식 구매</Button>
                </Link>
                <Link to="/update/stock" >
                  <Button bg={"yellow.100"} marginTop={2} width="100%">보유 주식 <br/> 매도/추가 매수</Button>
                </Link>
                <Link to="/register/bank" >
                  <Button bg={"yellow.100"} marginTop={2} width="100%">새로운 예금</Button>
                </Link>
                <Link to="/update/bank" >
                  <Button bg={"yellow.100"} marginTop={2}>기존 예금 <br/> 잔고 업데이트</Button>
                </Link>
    
              </VStack>
              
            </GridItem>
            <GridItem boxShadow='dark-lg' rowSpan={1} colSpan={4} bg="orange.50">
    
            </GridItem>
          </Grid> */

