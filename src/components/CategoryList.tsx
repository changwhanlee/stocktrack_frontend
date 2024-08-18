import { Box, Button, Flex, Menu, MenuButton, MenuGroup, MenuItem, MenuList, VStack } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { FaAngleDown } from "react-icons/fa";

interface IcategoryName {
    pk : number;
    name: string;
    classification: string;
}

interface ICategoryList {
    categoryName? : IcategoryName[]
}

export default function CategoryList({categoryName} : ICategoryList) {
    console.log(categoryName)
    if (categoryName) {
      const stockCategories = categoryName.filter(item => item.classification === "stock");
      console.log('dddddddddddddddddddddddddddddddddddddddddddddd')
      console.log(stockCategories)
      return (
        <Flex
          as="nav"
          align="center" 
          justify="space-between" 
          wrap="wrap" 
          color="gray.600" 
        >
          <Menu>
            <MenuButton
              as={Button}
              colorScheme="blue"
              variant="ghost"
              rightIcon={<FaAngleDown />}
            >
              주식 카테고리
            </MenuButton>
            <MenuList>
              {stockCategories.map((item: IcategoryName, index:number) =>(
                <MenuItem
                  key={item.pk} 
                  as={Link} 
                  to={`/read/categorystocks/${item.pk}`}
                >
                  {item.name}
                </MenuItem>
                
              ))}
              <MenuItem 
                as={Link} 
                to='/register/category/stock'
              >
                새 주식 카테고리 추가
              </MenuItem>
            </MenuList>
          </Menu>

          <Button
            as={Link}
            to="/read/categoryBanks"
            colorScheme="teal"
            variant="ghost"
          >
            예금 상세보기
          </Button>
        </Flex>
      )
    } else {
      return (
        <div></div>
      )
    }
}

    /*
    return (
        <div>
            {categoryName ? (
              <div>
                <Box h="100%" position="relative" >
                  <Box>
                    <Box mt={3} bg="pink.400" w="100%" textAlign="center" p={2} color="white" fontSize="lg"> 주식 카테고리 </Box>
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
                  </Box>
                
                  <Link to={'read/categoryBanks'}>
                    <Box mt={2} bg="gray.500" w="100%" textAlign="center" p={2} color="white" fontSize="lg"> 예금 카테고리 </Box>
                  </Link>
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

                  <Link to={'register/category'}>
                    <Box
                      mt={10}
                      textAlign="center"
                      fontSize="lg"
                      _hover={{color:"white"}}
                      bg="green.300"
                      p={2}
                    >
                      새로운 카테고리 등록
                    </Box>
                  </Link>
                </Box>
                
              </div>
  
            ) : (
                <div>No data available</div>
            )}
        </div>
    );
} */