"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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
    if (window.confirm('¿Estás seguro de que quieres cancelar? Los cambios no se guardarán.')) {
      setEditedTask(task);
      setIsEditing(false);
    }
  };

  if (!task) return <div className="p-6">Cargando...</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Link href="/">
        <button className="px-4 py-2 bg-gray-500 text-white rounded mb-4">
          <i className="fas fa-arrow-left"></i> Volver
        </button>
      </Link>
      <div className="bg-white p-6 rounded shadow-md">
        {isEditing ? (
          <>
            <div className="mb-4">
              <label className="block text-lg mb-2">Título</label>
              <input
                type="text"
                name="title"
                value={editedTask?.title || ''}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg mb-2">Fecha</label>
              <input
                type="date"
                name="date"
                value={editedTask?.date || ''}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg mb-2">Descripción</label>
              <textarea
                name="description"
                value={editedTask?.description || ''}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSave}>
                Guardar
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
            <p className="text-lg mb-2">Fecha: {task.date}</p>
            <p className="text-lg mb-2">Referencia: {task.reference}</p>
            <p className="text-lg mb-4">Descripción: {task.description}</p>
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
