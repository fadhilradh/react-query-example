import { NextApiRequest, NextApiResponse } from "next";

interface Message {
  id: string;
  createdAt?: number;
  phoneNumber: number;
  message: string;
  status?: string;
}

interface MessageStatus {
  id: string;
  status: string;
}

//temporary db
let messages: Message[] = [];

function addMessage(data: Message): Message[] {
  console.log(data, typeof data == "string");
  const initialData = {
    id: messages.length + 1,
    createdAt: new Date().toISOString(),
    status: "waiting",
  };
  const objData = typeof data == "string" ? JSON.parse(data) : data;
  const finalData = { ...initialData, ...objData };
  messages = [...messages, finalData];
  return [finalData];
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let response: Message[] | MessageStatus[] = [];
  switch (req.method) {
    case "GET":
      response = messages;
      break;

    case "POST":
      response = addMessage(req.body);
      break;

    // case "PUT":
    //   response = updateStatus(req.body);
    //   break;
  }

  setTimeout(() => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify(response));
  }, 1000);
}
