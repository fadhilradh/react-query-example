import React, { useState } from "react";
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
import { useMutation, useQuery, useQueryClient } from "react-query";
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
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState("");
  const { data, isSuccess } = useQuery("getMamaMessage", fetchMessage, {
    staleTime: 15000,
    refetchInterval: 15000,
  });

  const mutation = useMutation(submitMsg, {
    onMutate: async (newMessage) => {
      console.log("1");
      // mutation in progress
      // spinner , loading, disable form, etc

      // optimistic update :
      // 1. cancel any outgoing refetch, biar ga bentrok
      await queryClient.cancelQueries("getMamaMessage");
      console.log("2");

      // 2. snapshot / save the previous value
      const prevMessages =
        queryClient.getQueryData<MessageProps[]>("getMamaMessage");
      // 3. optimistically update new value in cache
      if (prevMessages) {
        console.log("inside prev");

        newMessage = { ...newMessage, createdAt: new Date().toISOString() };
        const finalMessages = [...prevMessages, newMessage];
        queryClient.setQueryData("getMamaMessage", finalMessages);
      }

      return { prevMessages };
    },
    onSettled: async (data, error: any) => {
      // after mutation done --> success or error
      if (data) {
        await queryClient.invalidateQueries("getMamaMessage");
        setErrorMsg("");
        reset();
        clearErrors();
      }

      if (error) {
        setErrorMsg(error.message);
      }
    },
    onError: async () => {
      // after mutation finish, for error
      console.log("error");
    },
    onSuccess: async () => {
      // after mutation finish, for success
      console.log("success");
    },
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
