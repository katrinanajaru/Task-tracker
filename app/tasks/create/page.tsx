import { auth } from '@clerk/nextjs/server';
import TaskManager from '../TaskManager';

export default async function CreateTaskPage() {
  const { userId } = await auth();

  return <TaskManager userId={userId!} mode="create" />;
}
