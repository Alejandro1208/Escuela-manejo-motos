import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '../hooks/useSite';
import CourseManager from '../components/admin/CourseManager';
import UserManager from '../components/admin/UserManager';
import SiteIdentityManager from '../components/admin/SiteIdentityManager';
import { LogoutIcon } from '../components/Icons';

type AdminTab = 'courses' | 'users' | 'identity';

const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('courses');
    const { logout, siteIdentity } = useSite();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'courses':
                return <CourseManager />;
            case 'users':
                return <UserManager />;
            case 'identity':
                return <SiteIdentityManager />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
                    <div className="flex items-center space-x-2">
                        <img className="h-10 w-auto" src={siteIdentity.logo} alt="Logo" />
                        <span className="font-bold text-gray-800 text-xl">Panel de Administración</span>
                    </div>
                    <div>
                        <a href="/#/" className="text-sm text-gray-600 hover:text-blue-500 mr-4">Ver Sitio</a>
                        <button onClick={handleLogout} className="inline-flex items-center text-sm text-red-500 hover:text-red-700">
                            <LogoutIcon className="w-5 h-5 mr-1" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('courses')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'courses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Cursos
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Usuarios
                        </button>
                        <button
                            onClick={() => setActiveTab('identity')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'identity' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Identidad del Sitio
                        </button>
                    </nav>
                </div>
                <div>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminPage;
