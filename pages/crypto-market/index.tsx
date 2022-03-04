import React, { useState } from "react";
import {
  Badge,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Image,
  Text,
  Spinner,
  useStyleConfig,
  Grid,
  Button,
} from "@chakra-ui/react";
import Layout from "../../components/Layout";
import { useQuery } from "react-query";

type Price = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_supply: number;
  market_cap: number;
};

function formatNumber(num: number) {
  return Intl.NumberFormat("id-Id").format(num);
}

async function getMarket(page = 1) {
  const URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=IDR&order=market_cap_desc&per_page=10&page=${page}`;
  const response = await fetch(URL);
  if (!response.ok) {
    throw new Error("get market error");
  }

  return await response.json();
}

const Percentage = ({ percent }: { percent: number }) => {
  function formatPercent(percent: number) {
    return Intl.NumberFormat("id-Id", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(percent / 100);
  }

  let defaultColor = "black";
  if (percent > 0) {
    defaultColor = "green.500";
  } else if (percent < 0) {
    defaultColor = "red.500";
  }

  return <Text color={defaultColor}>{formatPercent(percent)}</Text>;
};

export default function Market() {
  //queryKey is identifier,
  //queryFn will return Promise
  const [page, setPage] = useState(1);
  const { data, isError, isLoading, isFetching, isSuccess } = useQuery(
    ["market", page],
    () => getMarket(page),
    {
      staleTime: 3000,
      refetchInterval: 3000,
    }
  );

  return (
    <Layout title="Crypto Market">
      {isFetching && (
        <Spinner
          color="blue.500"
          position="fixed"
          top={10}
          right={200}
        ></Spinner>
      )}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Coin</Th>
            <Th>Last Price</Th>
            <Th>24h % Change</Th>
            <Th isNumeric>Total Volume</Th>
            <Th isNumeric>Market Cap</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isError && (
            <Text>There is an error while processing your request</Text>
          )}
          {isSuccess &&
            data.map((price: Price) => (
              <Tr key={price.id}>
                <Td>
                  <Flex alignItems="center">
                    <Image
                      src={price.image}
                      boxSize="24px"
                      ignoreFallback={true}
                    />

                    <Text pl={2} fontWeight="bold" textTransform="capitalize">
                      {price.id}
                    </Text>
                    <Badge ml={3}>{price.symbol}</Badge>
                  </Flex>
                </Td>
                <Td>{formatNumber(price.current_price)}</Td>
                <Td>
                  <Percentage percent={price.price_change_percentage_24h} />
                </Td>
                <Td isNumeric>{formatNumber(price.total_supply)}</Td>
                <Td isNumeric>{formatNumber(price.market_cap)}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>

      <Grid templateColumns="70% 1fr auto 1fr" gap={6} mt={10}>
        <div></div>
        <Button
          colorScheme="facebook"
          variant="outline"
          size="sm"
          onClick={() => setPage((page) => page - 1)}
          disabled={page === 1 ? true : false}
        >
          Previous
        </Button>
        {page}
        <Button
          colorScheme="facebook"
          variant="outline"
          size="sm"
          onClick={() => setPage((page) => page + 1)}
        >
          Next
        </Button>
      </Grid>
    </Layout>
  );
}
