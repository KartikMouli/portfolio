'use client';
import { ChatTrigger } from './parts/ChatTrigger';
import { ChatWindow } from './parts/ChatWindow';

export default function Chatbot() {
  return (
    <>
      <ChatTrigger />
      <ChatWindow />
    </>
  );
}
