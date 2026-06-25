'use client';

import { useEffect, useMemo, useState } from 'react';

type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

type Mode = 'dashboard' | 'create' | 'pending' | 'completed';

type Props = {
  userId: string;
  mode: Mode;
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

const PAGE_COPY = {
  dashboard: {
    eyebrow: 'Dashboard',
    title: 'Your task dashboard',
    description: 'A quick overview of the work in your tracker.',
  },
  create: {
    eyebrow: 'Create new',
    title: 'Create a new task',
    description: 'Add one task at a time with the details you need.',
  },
  pending: {
    eyebrow: 'Pending',
    title: 'Pending tasks',
    description: 'Focus only on the work that still needs action.',
  },
  completed: {
    eyebrow: 'Completed',
    title: 'Completed tasks',
    description: 'Review the work you have already finished.',
  },
} satisfies Record<Mode, { eyebrow: string; title: string; description: string }>;

export default function TaskManager({ userId, mode }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const pendingTasks = useMemo(() => tasks.filter((task) => !task.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((task) => task.completed), [tasks]);
  const visibleTasks = mode === 'completed' ? completedTasks : pendingTasks;
  const copy = PAGE_COPY[mode];

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

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch(`/api/tasks?userId=${encodeURIComponent(userId)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || 'Failed to load tasks');
        }

        setTasks(data);
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'Unable to load tasks.'));
      }
    }

    void loadTasks();
  }, [userId]);

  const handleAddTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

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
      setSuccess('Task created.');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Unable to add task.'));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

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
    setSuccess(null);

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
    <main className="p-5 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              {copy.eyebrow}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {copy.title}
            </h1>
            <p className="mt-2 text-sm text-slate-600">{copy.description}</p>
          </div>
          {mode !== 'create' ? (
            <button
              type="button"
              onClick={refreshTasks}
              disabled={loading}
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Refresh
            </button>
          ) : null}
        </div>

        {error ? (
          <section className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </section>
        ) : null}

        {success ? (
          <section className="mt-6 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm font-medium text-teal-800">
            {success}
          </section>
        ) : null}

        {mode === 'dashboard' ? (
          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">All tasks</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{tasks.length}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Pending</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{pendingTasks.length}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{completedTasks.length}</p>
            </div>
          </section>
        ) : null}

        {mode === 'create' ? (
          <section className="mt-6 max-w-xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Title</label>
                <input
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
                  rows={5}
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
        ) : null}

        {mode === 'pending' || mode === 'completed' ? (
          <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            {loading ? (
              <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-sm font-medium text-slate-500">
                Loading tasks...
              </div>
            ) : visibleTasks.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-sm font-medium text-slate-500">
                No tasks found.
              </div>
            ) : (
              <div className="space-y-3">
                {visibleTasks.map((task) => (
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
        ) : null}
      </div>
    </main>
  );
}
