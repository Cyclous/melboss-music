"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface Task {
  id: number;
  title: string;
  date: string;
  description: string;
  completed: boolean;
  reference: string;
}

const TaskDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [task, setTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`http://localhost:3001/tasks/${id}`);
      const data: Task = await res.json();
      setTask(data);
      setEditedTask(data);
    };

    fetchTask();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async () => {
    if (editedTask) {
      await fetch(`http://localhost:3001/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedTask),
      });
      setTask(editedTask);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm(t('task_detail.confirm_cancel'))) {
      setEditedTask(task);
      setIsEditing(false);
    }
  };

  if (!task) return <div className="p-6">{t('task_detail.loading')}</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Link href="/">
        <button className="px-4 py-2 bg-gray-500 text-white rounded mb-4">
          <i className="fas fa-arrow-left"></i> {t('task_detail.back')}
        </button>
      </Link>
      <div className="bg-white p-6 rounded shadow-md">
        {isEditing ? (
          <>
            <div className="mb-4">
              <label className="block text-lg mb-2">{t('task_detail.title')}</label>
              <input
                type="text"
                name="title"
                value={editedTask?.title || ''}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg mb-2">{t('task_detail.date')}</label>
              <input
                type="date"
                name="date"
                value={editedTask?.date || ''}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg mb-2">{t('task_detail.description')}</label>
              <textarea
                name="description"
                value={editedTask?.description || ''}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSave}>
                {t('task_detail.save')}
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleCancel}>
                {t('task_detail.cancel')}
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
            <p className="text-lg mb-2">{t('task_detail.date')}: {task.date}</p>
            <p className="text-lg mb-2">{t('task_detail.reference')}: {task.reference}</p>
            <p className="text-lg mb-4">{t('task_detail.description')}: {task.description}</p>
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setIsEditing(true)}
              >
                {t('task_detail.edit')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
