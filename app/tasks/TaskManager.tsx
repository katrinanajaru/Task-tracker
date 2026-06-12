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

type Props = {
  userId: string;
};

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'done', label: 'Done' },
  { value: 'pending', label: 'Pending' },
] as const;

export default function TaskManager({ userId }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState<'all' | 'done' | 'pending'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    if (filter === 'done') return tasks.filter((task) => task.completed);
    if (filter === 'pending') return tasks.filter((task) => !task.completed);
    return tasks;
  }, [tasks, filter]);

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
      } catch (err: any) {
        setError(err.message || 'Unable to load tasks.');
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
    } catch (err: any) {
      setError(err.message || 'Unable to refresh tasks.');
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
    } catch (err: any) {
      setError(err.message || 'Unable to add task.');
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
    } catch (err: any) {
      setError(err.message || 'Unable to update task.');
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
    } catch (err: any) {
      setError(err.message || 'Unable to delete task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-blue-700">Create a new task</h2>
        <form onSubmit={handleAddTask} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-black"
              placeholder="Task name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-black"
              placeholder="Optional details"
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add Task
            </button>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    filter === item.value
                      ? 'bg-blue-600 text-white'
                      : 'border border-blue-200 bg-white text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </form>
      </section>

      {error ? (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </section>
      ) : null}

      <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-blue-700">Tasks</h2>
            <p className="text-sm text-blue-600">Manage your Neon tasks here.</p>
          </div>
          <button
            type="button"
            onClick={refreshTasks}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-dashed border-blue-100 p-10 text-center text-blue-600">
            Loading tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-blue-100 p-10 text-center text-blue-600">
            No tasks found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="rounded-3xl border border-zinc-200 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-950">{task.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">{task.description || 'No description'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                      <button
                      type="button"
                      onClick={() => handleToggleComplete(task)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        task.completed
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {task.completed ? 'Mark Pending' : 'Mark Complete'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
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
  );
}
