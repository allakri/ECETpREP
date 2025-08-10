
import ChatClient from '@/components/chat/ChatClient';
import { AppShell } from '@/components/layout/AppShell';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export default function ChatPage() {
  return (
    <AppShell>
      <div className="pt-8">
        <Breadcrumbs />
      </div>
      <ChatClient />
    </AppShell>
  );
}
