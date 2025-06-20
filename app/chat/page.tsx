import Chat from '@/components/pages/chat'

export default function ChatPage() {
  const ws = new WebSocket('ws://localhost:3001/ws');
  // 필요시 실제 서버 주소/포트로 변경
  return <Chat />
}