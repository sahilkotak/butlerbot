import {
  FluentThemeProvider,
  DEFAULT_COMPONENT_ICONS,
} from "@azure/communication-react";
import { initializeIcons, registerIcons, Stack } from "@fluentui/react";
import { GridLayout } from "@azure/communication-react";

import {
  MessageThread,
  ChatMessage,
  MessageContentType,
  CustomMessage,
  SystemMessage,
} from "@azure/communication-react";

import { mergeStyles } from "@fluentui/react";

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

function Test(): JSX.Element {
  const GetHistoryChatMessages = (): (
    | CustomMessage
    | SystemMessage
    | ChatMessage
  )[] => {
    return [
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "You",
        messageId: Math.random().toString(),
        content: "Hey! Can I grab a beer please?",
        createdOn: new Date("2019-04-13T00:00:00.000+08:10"),
        mine: false,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "2",
        senderDisplayName: "Bot",
        messageId: Math.random().toString(),
        content: "Sure, which brand?",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: true,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "You",
        messageId: Math.random().toString(),
        content: "Anything will do for me please!",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: false,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "Bot",
        messageId: Math.random().toString(),
        content: "The most popular brand here is Balter, is that okay for you?",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: true,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "You",
        messageId: Math.random().toString(),
        content: "Sure",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: false,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "Bot",
        messageId: Math.random().toString(),
        content: "That will be 6 and 30cents!",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: true,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "Bot",
        messageId: Math.random().toString(),
        content: "Would you like to add anything else?",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: true,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "You",
        messageId: Math.random().toString(),
        content: "No, That's all for today.",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: false,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "Bot",
        messageId: Math.random().toString(),
        content: "Would you like to pay now?",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: true,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "Bot",
        messageId: Math.random().toString(),
        content: "Yes Please!",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: false,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "Bot",
        messageId: Math.random().toString(),
        content:
          "Sure, you will be redirecting to the payment page, please hold on!",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: true,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "You",
        messageId: Math.random().toString(),
        content: "Thank you!",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: false,
      },
      {
        messageType: "chat",
        contentType: "text" as MessageContentType,
        senderId: "1",
        senderDisplayName: "Bot",
        messageId: Math.random().toString(),
        content: "You are very welcome!, You have a great day!",
        createdOn: new Date("2019-04-13T00:00:00.000+08:09"),
        mine: true,
      },
    ];
  };

  return (
    <FluentThemeProvider>
      <Stack horizontal>
        <MessageThread userId={"1"} messages={GetHistoryChatMessages()} />
        <Stack className={mergeStyles({ height: "100%" })}>
          <div style={{ height: "30rem", width: "20rem", border: "1px solid" }}>
            <GridLayout>THis is the order cart</GridLayout>
          </div>
        </Stack>
      </Stack>
    </FluentThemeProvider>
  );
}

export default Test;
