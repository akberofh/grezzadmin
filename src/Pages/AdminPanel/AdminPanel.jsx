import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Yönlendirme için
import Cookies from 'js-cookie'; // Çerez okumak için

const AdminPanel = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate(); // Yönlendirme fonksiyonu

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // const token = Cookies.get('jwt'); // JWT tokenini çerezden al

        // try {
        //     const response = await axios.post('http://localhost:8000/api/tiktok/post', {
        //         title,
        //         description,
        //     }, {
        //         headers: {
        //             Authorization: Bearer ${token}, // Tokeni Authorization başlığına ekle
        //         },
        //         withCredentials: true, // Cookie'leri göndermek için
        //     });

        //     console.log('Post oluşturuldu:', response.data); // Başarılı yanıtı kontrol et
        //     setSuccess(true);
        //     navigate('/'); // Başarılı posttan sonra yönlendirme (örneğin ana sayfaya)

        // } catch (err) {
        //     console.log('Hata:', err); // Hata detaylarını kontrol et
        //     setError('Post oluşturulamadı: ' + (err.response?.data?.message || 'Bir hata oluştu'));
        // }


        fetch('https://akberofh.vercel.app/api/notes/post', {
            method: 'POST',
            credentials: 'include', // Cookie'lerin dahil edilmesi için
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description
            }) 
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });

    };

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
                <h2 className="text-lg font-bold mb-4">Yeni Post Oluştur</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">Post başarılı bir şekilde oluşturuldu!</p>}

                <div className="mb-4">
                    <label htmlFor="title" className="block mb-2">Başlık</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="border rounded w-full px-3 py-2"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block mb-2">Açıklama</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="border rounded w-full px-3 py-2"
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">Post Oluştur</button>
            </form>
        </div>
    );
};

export default AdminPanel;