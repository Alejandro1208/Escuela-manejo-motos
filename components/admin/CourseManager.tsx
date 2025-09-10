import React, { useState } from 'react';
import { useSite } from '../../hooks/useSite';
import type { Course } from '../../types';

const CourseManager: React.FC = () => {
  const { courses, categories, deleteCourse, updateCourse } = useSite();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
  };

  const handleDelete = (courseId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      const success = deleteCourse(courseId);
      if (!success) {
        alert('Error al eliminar el curso.');
      }
    }
  };
  
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCourse) return;
    
    const success = updateCourse(editingCourse);
    if (success) {
      setEditingCourse(null);
    } else {
      alert('Error al guardar el curso.');
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      if (!editingCourse) return;
      const { name, value } = e.target;
      setEditingCourse({ ...editingCourse, [name]: name === 'categoryId' ? parseInt(value) : value });
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Gestionar Cursos</h2>
      {/* This is a simplified manager. A full implementation would have modals/forms for creation too. */}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-2 px-4">Título</th>
              <th className="text-left py-2 px-4">Categoría</th>
              <th className="text-left py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id} className="border-b">
                <td className="py-2 px-4">{course.title}</td>
                <td className="py-2 px-4">{categories.find(c => c.id === course.categoryId)?.title || 'N/A'}</td>
                <td className="py-2 px-4">
                  <button onClick={() => handleEdit(course)} className="text-blue-500 hover:text-blue-700 mr-2">Editar</button>
                  <button onClick={() => handleDelete(course.id)} className="text-red-500 hover:text-red-700">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingCourse && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4">Editar Curso</h3>
                <form onSubmit={handleSave}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Título</label>
                        <input type="text" name="title" value={editingCourse.title} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
                    </div>
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea name="description" value={editingCourse.description} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={3}></textarea>
                    </div>
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Categoría</label>
                        <select name="categoryId" value={editingCourse.categoryId} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={() => setEditingCourse(null)} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default CourseManager;
