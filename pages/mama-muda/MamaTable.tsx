import { Badge, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { MessageProps } from ".";
import { formatDate } from "../../utils/formats";

type MamaTableProps = {
  data: MessageProps[];
};

export default function MamaTable({ data }: MamaTableProps) {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Date</Th>
          <Th>Phone Number</Th>
          <Th>Message</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data?.map((message) => (
          <Tr key={message.id}>
            <Td>{formatDate(message.createdAt)}</Td>
            <Td>{message.phoneNumber}</Td>
            <Td>{message.message}</Td>
            <Td>
              <Badge colorScheme="yellow">{message.status}</Badge>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
