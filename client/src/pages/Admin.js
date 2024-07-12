import React, { useState, useEffect, useContext } from 'react';
import { createType, fetchTypes } from '../http/typeApi'; 
import style from '../style/admin.module.css';
import { Context } from '..';

const Admin = () => {
    const { user } = useContext(Context);
    const [typeName, setTypeName] = useState('');
    const [typeColor, setTypeColor] = useState('');
    const [types, setTypes] = useState([]);

    useEffect(() => {
        const loadTypes = async () => {
            const fetchedTypes = await fetchTypes();
            setTypes(fetchedTypes);
        };
        loadTypes();
    }, []);

    const handleAddType = async (e) => {
        e.preventDefault();
        try {
            const newType = await createType({ type_name: typeName, type_color: typeColor });
            setTypes([...types, newType]);
            setTypeName('');
            setTypeColor('');
            alert('Тип успешно добавлен!');
        } catch (error) {
            console.error('Ошибка при добавлении типа:', error);
            alert('Ошибка при добавлении типа.');
        }
    };
    if (!user.isAuth || user.user.role !== 'Admin') {
        return <div>Уходи</div>;
    }

    return (
        
        <div className={style.adminContainer}>
            <h1>Управление типами мероприятий</h1>
            <form onSubmit={handleAddType}>
                <input
                    type="text"
                    placeholder="Название типа"
                    value={typeName}
                    onChange={(e) => setTypeName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Цвет типа (например, #FFFFFF)"
                    value={typeColor}
                    onChange={(e) => setTypeColor(e.target.value)}
                    required
                />
                <button type="submit">Добавить тип</button>
            </form>

            <h2>Существующие типы</h2>
            <ul>
                {types.map((type) => (
                    <li key={type.id}>
                        {type.type_name} - <span style={{ backgroundColor: type.type_color }}>{type.type_color}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Admin;
