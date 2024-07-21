"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Task {
  id: number;
  title: string;
  date: string;
  description: string;
  completed: boolean;
  reference: string;
}

const TaskList = () => {
  const { t, i18n } = useTranslation();
  const [taskList, setTaskList] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('http://localhost:3001/tasks');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: Task[] = await res.json();
        setTaskList(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleComplete = async (taskId: number) => {
    const task = taskList.find(t => t.id === taskId);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      setTaskList(prevTasks =>
        prevTasks.map(t => (t.id === taskId ? updatedTask : t))
      );
    }
  };
  const handleDelete = async (taskId: number) => {
    if (window.confirm(t('task_list.confirm_delete'))) {
      await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: 'DELETE',
      });

      setTaskList(prevTasks => prevTasks.filter(t => t.id !== taskId));
    }
  };

  const handleLanguageChange = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{t('task_list.title')}</h1>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          onClick={handleLanguageChange}
        >
          {i18n.language === 'en' ? 'Español' : 'English'}
        </button>
        <Link href="/tasks/new">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
            <i className="fas fa-plus"></i> {t('task_list.add_task')}
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {taskList.map(task => (
          <div
            key={task.id}
            className="relative bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-64"
          >
            <button
              className="delete-button"
              onClick={() => handleDelete(task.id)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-2 truncate">{task.title}</h2>
            <p className="text-gray-700 mb-2 truncate">{t('task_list.date')}: {task.date}</p>
            <p className={`text-lg font-medium mb-2 ${task.completed ? 'text-green-500' : 'text-red-500'} truncate`}>
              {task.completed ? t('task_list.completed') : t('task_list.not_completed')}
            </p>
            <div className="flex-grow"></div>
            <div className="flex space-x-2 mt-2">
              <Link href={`/tasks/${task.id}`}>
                <button className="btn-large bg-blue-500 hover:bg-blue-700">
                  {t('task_list.more_info')}
                </button>
              </Link>
              <button
                className={`btn-large ${task.completed ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-700'}`}
                onClick={() => handleComplete(task.id)}
              >
                {task.completed ? t('task_list.mark_as_not_completed') : t('task_list.mark_as_completed')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TaskList;
