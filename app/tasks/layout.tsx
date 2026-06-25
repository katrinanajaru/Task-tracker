import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import TaskSidebar from './TaskSidebar';

export default async function TasksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/login');
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 lg:pl-64">
      <TaskSidebar />
      {children}
    </div>
  );
}
