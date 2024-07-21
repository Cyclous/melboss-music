"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const NewTask = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [newTask, setNewTask] = useState({
    title: '',
    date: '',
    description: '',
    completed: false,
    reference: `REF${Math.random().toString(36).substr(2, 5).toUpperCase()}`
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await fetch('http://localhost:3001/tasks', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });
    router.push('/');
  };

  const handleCancel = () => {
    if (window.confirm(t('task_detail.confirm_cancel'))) {
      router.push('/');
    }
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">{t('new_task.add_new_task')}</h1>
      <div className="mb-4">
        <label className="block text-lg mb-2">{t('task_detail.title')}</label>
        <input
          type="text"
          name="title"
          value={newTask.title}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg mb-2">{t('task_detail.date')}</label>
        <input
          type="date"
          name="date"
          value={newTask.date}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg mb-2">{t('task_detail.description')}</label>
        <textarea
          name="description"
          value={newTask.description}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg mb-2">{t('new_task.reference')}</label>
        <input
          type="text"
          name="reference"
          value={newTask.reference}
          readOnly
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="flex space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={handleSave}
        >
          {t('task_detail.save')}
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={handleCancel}
        >
          {t('task_detail.cancel')}
        </button>
      </div>
    </div>
  );
};

export default NewTask;
