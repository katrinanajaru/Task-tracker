import { auth } from '@clerk/nextjs/server';
import TaskManager from '../TaskManager';

export default async function PendingTasksPage() {
  const { userId } = await auth();

  return <TaskManager userId={userId!} mode="pending" />;
}
