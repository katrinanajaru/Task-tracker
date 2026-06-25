'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

type Props = {
  userId: string;
};

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'done', label: 'Done' },
  { value: 'pending', label: 'Pending' },
] as const;

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function TaskManager({ userId }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState<'all' | 'done' | 'pending'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const filteredTasks = useMemo(() => {
    if (filter === 'done') return tasks.filter((task) => task.completed);
    if (filter === 'pending') return tasks.filter((task) => !task.completed);
    return tasks;
  }, [tasks, filter]);

  const openTasks = tasks.filter((task) => !task.completed).length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  const showCreateTask = () => {
    setFilter('all');
    titleInputRef.current?.focus();
  };

  useEffect(() => {
    async function loadTasks() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/tasks?userId=${encodeURIComponent(userId)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || 'Failed to load tasks');
        }

        setTasks(data);
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'Unable to load tasks.'));
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, [userId]);

  const refreshTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tasks?userId=${encodeURIComponent(userId)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to refresh tasks');
      }

      setTasks(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Unable to refresh tasks.'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          userId,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to create task');
      }

      setTasks((current) => [data, ...current]);
      setTitle('');
      setDescription('');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Unable to add task.'));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !task.completed }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to update task');
      }

      setTasks((current) => current.map((item) => (item.id === task.id ? data : item)));
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Unable to update task.'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to delete task');
      }

      setTasks((current) => current.filter((item) => item.id !== taskId));
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Unable to delete task.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-slate-200 bg-slate-950 p-5 text-white lg:border-b-0 lg:border-r lg:border-slate-800">
        <div className="rounded-lg bg-white/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-200">Workspace</p>
          <h2 className="mt-2 text-2xl font-semibold">My Tasks</h2>
        </div>

        <nav className="mt-6 grid gap-2">
          {[
            { label: 'Dashboard', value: 'all' },
            { label: 'Open tasks', value: 'pending' },
            { label: 'Pending', value: 'pending' },
            { label: 'Completed', value: 'done' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setFilter(item.value as 'all' | 'done' | 'pending')}
              className={`rounded-md px-4 py-3 text-left text-sm font-semibold transition ${
                filter === item.value
                  ? 'bg-white text-slate-950'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={showCreateTask}
            className="mt-2 rounded-md bg-teal-500 px-4 py-3 text-left text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
          >
            Create new
          </button>
        </nav>
      </aside>

      <main className="p-5 sm:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
                Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Your task dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Review, create, and finish tasks from one clean workspace.
              </p>
            </div>
            <button
              type="button"
              onClick={refreshTasks}
              disabled={loading}
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Refresh
            </button>
          </div>

          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">All tasks</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{totalTasks}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Open tasks</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{openTasks}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{completedTasks}</p>
            </div>
          </section>

          {error ? (
            <section className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </section>
          ) : null}

          <div className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">Create a new task</h2>
              <form onSubmit={handleAddTask} className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Title</label>
                  <input
                    ref={titleInputRef}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    placeholder="Task name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    placeholder="Optional details"
                    rows={4}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-11 w-full items-center justify-center rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add task
                </button>
              </form>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">Task list</h2>
                  <p className="mt-1 text-sm text-slate-500">Filter and update your current work.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {FILTERS.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFilter(item.value)}
                      className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                        filter === item.value
                          ? 'bg-slate-950 text-white'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-10 text-center text-sm font-medium text-slate-500">
                  Loading tasks...
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-10 text-center text-sm font-medium text-slate-500">
                  No tasks found.
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="rounded-lg border border-slate-200 p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                task.completed ? 'bg-teal-500' : 'bg-amber-500'
                              }`}
                            />
                            <h3 className="font-semibold text-slate-950">{task.title}</h3>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {task.description || 'No description'}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleComplete(task)}
                            className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                          >
                            {task.completed ? 'Mark pending' : 'Mark complete'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task.id)}
                            className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
