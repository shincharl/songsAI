import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import type { CommunitySocketEvent } from "./community";

let client: Client | null = null;
let subscriptions: StompSubscription[] = [];

const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL ?? "";

const listeners = new Set<(event: CommunitySocketEvent) => void>();

const notifyListeners = (event: CommunitySocketEvent) => {
  listeners.forEach((listener) => listener(event));
};

export const connectCommunitySocket = (
  onMessage: (event: CommunitySocketEvent) => void,
) => {
  listeners.add(onMessage);

  if (client?.active) {
    return () => {
      listeners.delete(onMessage);
    };
  }

  client = new Client({
    brokerURL: `${wsBaseUrl}/ws-community`,
    reconnectDelay: 5000,
  });

  client.onConnect = () => {
    console.log("커뮤니티 웹소켓 연결 성공");

    const postSub = client!.subscribe(
      "/topic/community",
      (message: IMessage) => {
        const body = JSON.parse(message.body) as CommunitySocketEvent;
        notifyListeners(body);
      },
    );

    const reactionSub = client!.subscribe(
      "/topic/community/reaction",
      (message: IMessage) => {
        const body = JSON.parse(message.body) as CommunitySocketEvent;
        notifyListeners(body);
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

  return () => {
    listeners.delete(onMessage);
  };
};

export const disconnectCommunitySocket = async () => {
  subscriptions.forEach((sub) => sub.unsubscribe());
  subscriptions = [];

  listeners.clear();

  if (client) {
    await client.deactivate();
    client = null;
  }
};
