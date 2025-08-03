
import ChatClient from '@/components/chat/ChatClient';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export default function ChatPage() {
  return (
    <>
      <div className="pt-8">
        <Breadcrumbs />
      </div>
      <ChatClient />
    </>
  );
}
