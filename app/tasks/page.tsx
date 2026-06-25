import { auth } from "@clerk/nextjs/server";
import TaskManager from "./TaskManager";

export default async function TasksPage() {
  const { userId } = await auth();

  return (
    <TaskManager userId={userId!} mode="dashboard" />
  );
}
