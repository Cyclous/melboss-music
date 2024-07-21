"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Definimos el tipo Task
interface Task {
  id: number;
  title: string;
  date: string;
  description: string;
  completed: boolean;
  reference: string;
}

const TaskList = () => {
  // Especificamos el tipo de estado como una matriz de Task
  const [taskList, setTaskList] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('http://localhost:3001/tasks');
      const data: Task[] = await res.json();
      setTaskList(data);
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

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Lista de Tareas</h1>
        <Link href="/tasks/new">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
            <i className="fas fa-plus"></i> Añadir Tarea
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {taskList.map(task => (
          <div
            key={task.id}
            className="bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
            <p className="text-gray-700 mb-2">Fecha: {task.date}</p>
            <p className={`text-lg font-medium mb-2 ${task.completed ? 'text-green-500' : 'text-red-500'}`}>
              {task.completed ? 'Tarea completada' : 'Tarea no completada'}
            </p>
            <div className="flex space-x-2">
              <Link href={`/tasks/${task.id}`}>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                  Más Información
                </button>
              </Link>
              <button
                className={`px-4 py-2 rounded text-white ${task.completed ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-700'}`}
                onClick={() => handleComplete(task.id)}
              >
                {task.completed ? 'Marcar como no completada' : 'Marcar como completada'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
