
import React from 'react';
import { useSite } from '../../hooks/useSite';
import type { User } from '../../types';
import { UserRole } from '../../types';

const UserManager: React.FC = () => {
  const { users, auth } = useSite();

  const currentUser = users.find(u => u.username === auth.user);
  const canManageUsers = currentUser?.role === UserRole.ADMIN;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Gestionar Usuarios</h2>
      
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
                {canManageUsers && (
                  <td className="py-2 px-4">
                    {/* In a real app, edit/delete buttons would go here */}
                    <button disabled className="text-gray-400 cursor-not-allowed">Editar</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManager;
