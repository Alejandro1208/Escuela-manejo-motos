import React, { useState } from 'react';
import { useSite } from '../../hooks/useSite';
import type { User } from '../../types';
import { UserRole } from '../../types';

const UserManager: React.FC = () => {
  const { users, auth, addUser, updateUser, deleteUser } = useSite();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> & { password?: string } | null>(null);

  const currentUser = users?.find(u => u.username === auth.user);
  const canManageUsers = currentUser?.role === UserRole.ADMIN;

  if (!users) {
    return <div>Cargando usuarios...</div>;
  }

  const openModal = (user: User | null = null) => {
    setEditingUser(user ? { ...user } : { username: '', password: '', role: UserRole.EDITOR });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const success = editingUser.id
      ? await updateUser(editingUser as User & { password?: string })
      : await addUser(editingUser as Omit<User, 'id'> & { password: string });
    
    if (success) {
      closeModal();
    } else {
      alert('Error al guardar el usuario. El nombre de usuario puede ya existir.');
    }
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('¿Seguro que quieres eliminar este usuario? No se puede deshacer.')) {
      await deleteUser(userId);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingUser) return;
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestionar Usuarios</h2>
        {canManageUsers && (
          <button onClick={() => openModal()} className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Agregar Usuario
          </button>
        )}
      </div>
      
      {!canManageUsers && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p>No tienes permisos para gestionar usuarios.</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-2 px-4">ID</th>
              <th className="text-left py-2 px-4">Usuario</th>
              <th className="text-left py-2 px-4">Rol</th>
              {canManageUsers && <th className="text-left py-2 px-4">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td className="py-2 px-4">{user.id}</td>
                <td className="py-2 px-4">{user.username}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === UserRole.ADMIN ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {user.role}
                  </span>
                </td>
                {canManageUsers && user.id !== currentUser?.id && (
                  <td className="py-2 px-4">
                    <button onClick={() => openModal(user)} className="text-blue-500 hover:text-blue-700 mr-2">Editar</button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700">Eliminar</button>
                  </td>
                )}
                 {user.id === currentUser?.id && <td className="py-2 px-4 text-gray-400"> (Tú) </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4">{editingUser.id ? 'Editar' : 'Agregar'} Usuario</h3>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                        <input type="text" name="username" value={editingUser.username || ''} onChange={handleInputChange} required className="mt-1 block w-full border p-2 rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input type="password" name="password" value={editingUser.password || ''} onChange={handleInputChange} placeholder={editingUser.id ? 'Dejar en blanco para no cambiar' : ''} required={!editingUser.id} className="mt-1 block w-full border p-2 rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rol</label>
                        <select name="role" value={editingUser.role} onChange={handleInputChange} className="mt-1 block w-full border p-2 rounded-md bg-white">
                            <option value={UserRole.EDITOR}>Editor</option>
                            <option value={UserRole.ADMIN}>Administrador</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={closeModal} className="py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;