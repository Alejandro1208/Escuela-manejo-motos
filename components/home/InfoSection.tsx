import React from 'react';
import { useSite } from '../../hooks/useSite';

export const InfoSection: React.FC = () => {
    const { infoBoxes } = useSite();

    if (!infoBoxes) {
        return null; // No muestra nada hasta que los datos estén listos
    }
    
    return (
        // --- AJUSTE: Se añaden clases para modo claro y oscuro ---
        <div className="bg-gray-100 dark:bg-gray-800 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    
                    {/* Columna 1 */}
                    <div>
                        {/* --- AJUSTE: Clases de texto para ambos modos --- */}
                        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{infoBoxes.title1}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{infoBoxes.content1}</p>
                    </div>
                    
                    {/* Columna 2 */}
                    <div>
                        {/* --- AJUSTE: Clases de texto para ambos modos --- */}
                        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{infoBoxes.title2}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{infoBoxes.content2}</p>
                    </div>
                    
                    {/* Columna 3 */}
                    <div>
                        {/* --- AJUSTE: Clases de texto para ambos modos --- */}
                        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{infoBoxes.title3}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{infoBoxes.content3}</p>
                    </div>

                </div>
            </div>
        </div>
    );
};