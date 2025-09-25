import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '../hooks/useSite';
import { UserIcon, LockClosedIcon } from '../components/Icons';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, siteIdentity } = useSite();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const success = await login(username, password);
        
        if (success) {
            navigate('/admin');
        } else {
            // El mensaje de error específico viene de la alerta del context.
            // Aquí solo nos aseguramos de re-habilitar el botón.
            setLoading(false);
        }
    };

    // Muestra un estado de carga mientras se obtiene la identidad del sitio para evitar errores
    if (!siteIdentity) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Cargando...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 space-y-8">
                <div className="text-center">
                    <img className="mx-auto h-20 w-auto object-contain" src={siteIdentity.logo} alt="Logo" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Acceso al Panel
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="relative">
                           <span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                                <UserIcon className="h-5 w-5 text-gray-400" />
                           </span>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Usuario"
                            />
                        </div>
                        <div className="relative">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                                <LockClosedIcon className="h-5 w-5 text-gray-400" />
                           </span>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Contraseña"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                            style={{ backgroundColor: siteIdentity?.primaryColor }} // Se añade '?' para evitar errores de carga
                        >
                            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;