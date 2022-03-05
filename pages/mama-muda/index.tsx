import React from "react";
import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Textarea,
  Badge,
} from "@chakra-ui/react";
import Layout from "../../components/Layout";
import { useMutation, useQuery } from "react-query";
import MamaTable from "./MamaTable";
import { useForm } from "react-hook-form";

export function formatDate(date: string | undefined) {
  return new Date(date).toLocaleString("id-Id");
}

async function fetchMessage() {
  const URL = "http://localhost:3000/api/message";
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error("get market error");
  }

  return await response.json();
}

export type MessageProps = {
  id?: number;
  createdAt?: string;
  phoneNumber: number;
  message: string;
  status?: string;
};

async function submitMsg(data: MessageProps) {
  const URL = "http://localhost:3000/api/message";
  const response = await fetch(URL, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error occured");
  }

  return await response.json();
}

export default function MamaMuda() {
  const { data, isSuccess } = useQuery("getMamaMessage", fetchMessage, {
    staleTime: 5000,
    refetchInterval: 5000,
  });

  const mutation = useMutation(submitMsg, {
    // onError,
    // onMutate,
    // onSettled,
  });

  const { handleSubmit, errors, register, reset, clearErrors } = useForm();

  async function onSubmit(data: MessageProps) {
    await mutation.mutate(data);
  }
  return (
    <Layout title="💌 Mama Minta Pulsa" subTitle="10 jt aja">
      <Flex>
        <Box>
          <Box
            w="md"
            p={5}
            mr={4}
            border="1px"
            borderColor="gray.200"
            boxShadow="md"
          >
            <Text
              fontSize="xl"
              fontWeight="bold"
              mb={4}
              pb={2}
              borderBottom="1px"
              borderColor="gray.200"
            >
              ✍️ Request Pulsa
            </Text>
            <form>
              <FormControl pb={4} isInvalid={errors.phoneNumber ? true : false}>
                <FormLabel
                  htmlFor="phoneNumber"
                  fontWeight="bold"
                  fontSize="xs"
                  letterSpacing="1px"
                  textTransform="uppercase"
                >
                  Phone Number
                </FormLabel>
                <Input
                  name="phoneNumber"
                  placeholder="Phone Number"
                  ref={register({
                    required: "Phone Number Required",
                  })}
                />
                <FormErrorMessage>
                  {errors.phoneNumber && errors.phoneNumber.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.phoneNumber ? true : false}>
                <FormLabel
                  htmlFor="name"
                  fontWeight="bold"
                  fontSize="xs"
                  letterSpacing="1px"
                  textTransform="uppercase"
                >
                  Message
                </FormLabel>
                <Textarea
                  name="message"
                  placeholder="Bullshit Message"
                  ref={register({
                    required: "Message is Required",
                  })}
                />
                <FormErrorMessage>
                  {errors.message && errors.message.message}
                </FormErrorMessage>
              </FormControl>

              <Button
                mt={4}
                colorScheme="teal"
                type="submit"
                onClick={handleSubmit(onSubmit)}
              >
                Send
              </Button>
            </form>
          </Box>
        </Box>
        <Box flex="1">{isSuccess && <MamaTable data={data} />}</Box>
      </Flex>
    </Layout>
  );
}
