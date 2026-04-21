import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import type { CommunitySocketEvent } from "./community";

let client: Client | null = null;
let subscriptions: StompSubscription[] = [];

export const connectCommunitySocket = (
  onMessage: (event: CommunitySocketEvent) => void,
) => {
  if (client?.active) return;

  client = new Client({
    brokerURL: `${import.meta.env.VITE_WS_BASE_URL}/ws-community`,
    reconnectDelay: 5000,
  });

  client.onConnect = () => {
    console.log("커뮤니티 웹소켓 연결 성공");

    const postSub = client!.subscribe(
      "/topic/community",
      (message: IMessage) => {
        console.log("새 글 raw:", message.body);
        const body = JSON.parse(message.body) as CommunitySocketEvent;
        onMessage(body);
      },
    );

    const reactionSub = client!.subscribe(
      "/topic/community/reaction",
      (message: IMessage) => {
        console.log("리액션 raw:", message.body);
        const body = JSON.parse(message.body) as CommunitySocketEvent;
        onMessage(body);
      },
    );

    subscriptions = [postSub, reactionSub];
  };

  client.onStompError = (frame) => {
    console.error("STOMP 에러", frame.headers["message"], frame.body);
  };

  client.onWebSocketError = (error) => {
    console.log("WebSocket 에러", error);
  };

  client.activate();
};

export const disconnectCommunitySocket = async () => {
  subscriptions.forEach((sub) => sub.unsubscribe());
  subscriptions = [];

  if (client) {
    await client.deactivate();
    client = null;
  }
};
