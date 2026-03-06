import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import styles from './Postat.module.css'; // CSS modülü
import { useDropzone } from 'react-dropzone';

const Postat = () => {
    const [form1, setForm1] = useState({ title: '', price: '' }); // PUBG formu
    const [form2, setForm2] = useState({ title: '', price: '' }); // Fann formu
    const [form3, setForm3] = useState({ title: '', price: '' }); // Tiktok formu
    const [items1, setItems1] = useState([]); // PUBG ürünleri
    const [items2, setItems2] = useState([]); // Fann ürünleri
    const [items3, setItems3] = useState([]); // Tiktok ürünleri
    const [error, setError] = useState('');
    const [photo, setPhoto] = useState('');
    const [success, setSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

 // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
    fetchItems('https://grez-shop-lf6t.vercel.app/api/pubg/', setItems1, 'pubg');
    fetchItems('https://grez-shop-lf6t.vercel.app/api/fann/', setItems2, 'fann');
    fetchItems('https://grez-shop-lf6t.vercel.app/api/tiktok/', setItems3, 'tiktok');
}, []);

    const fetchItems = async (url, setItems, type) => {
        try {
            const response = await axios.get(url);
            if (type === 'pubg') {
                setItems(response.data.allPubges);
            } else if (type === 'tiktok') {
                setItems(response.data.allTiktokes);
            } else if (type === 'fann') {
                setItems(response.data.allFanns);
            } else {
                setItems([]);
            }
            // Sıralama işlemi
            sortItems(setItems);
        } catch (error) {
            console.error('Error fetching items:', error);
            setItems([]);
        }
    };

    const sortItems = (setItems) => {
        setItems(prevItems => {
            return prevItems.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*',
        maxSize: 20971520, // 20 MB limit
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                if (file.size <= 20971520) {
                    setPhoto(file);
                } else {
                    alert('Dosya boyutu 20 MB limitini aşıyor.');
                }
            }
        }
    });

    const handleFormSubmit = async (e, formData, setFormData, url, setItems) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('price', formData.price);
        if (photo) {
            data.append('photo', photo);
        }

        try {
            await axios.post(url, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccess(true);
            setFormData({ title: '', price: '' });
            setPhoto(null); 
            fetchItems(url, setItems); // Öğeleri yeniden yükle

            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error('Error:', error);
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    const handleDelete = async (id, url, setError) => {
        try {
            const response = await fetch(`${url}${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Delete failed');
            }

            console.log('Item deleted');

            // 1 saniye bekleyip sayfayı yeniden yükler
            setTimeout(() => {
                window.location.reload();
            }, 1000); // 1000ms = 1 saniye

        } catch (error) {
            console.error('Error deleting item:', error);
            setError('Silme işlemi başarısız oldu.');
        }
    };

    const handleEdit = (item) => {
        setForm1({ title: item.title, price: item.price }); // PUBG için
        setForm2({ title: item.title, price: item.price }); // Fann için
        setForm3({ title: item.title, price: item.price }); // Tiktok için
        setEditingItem(item);
        setIsEditing(true);
    };

    const updateTikTokItem = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            const formData = new FormData();
            formData.append('title', form1.title); // form3'teki başlık ve fiyat değerlerini alın
            formData.append('price', form1.price);
            if (photo) {
                formData.append('photo', photo); // Fotoğraf varsa ekleyin
            }

            const res = await axios.put(`https://grez-shop-lf6t.vercel.app/api/pubg/postt/${editingItem._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Başarılı bir güncellemeden sonra, güncellenmiş öğeyi alın
            const updatedItem = res.data;

            // Mevcut items3 listesini güncelleyerek güncellenmiş öğeyi değiştirin
            setItems1((prevItems) =>
                prevItems.map((item) => (item._id === updatedItem._id ? updatedItem : item))
            );


            setTimeout(() => {
                window.location.reload();
            }, 1000);
            setIsEditing(false); // Düzenleme modunu kapat
            setEditingItem(null); // Düzenleme öğesini sıfırla
            setPhoto(null); // Fotoğrafı temizle
            setForm1({ title: '', price: '' }); // Formu sıfırla
            setSuccess(true); // Başarılı mesajını göster

        } catch (error) {
            console.error('Güncelleme hatası:', error);
            setError('Güncelleme sırasında bir hata oluştu.');
        }
    };
    const updateTikTokItem2 = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            const formData = new FormData();
            formData.append('title', form2.title); // form3'teki başlık ve fiyat değerlerini alın
            formData.append('price', form2.price);
            if (photo) {
                formData.append('photo', photo); // Fotoğraf varsa ekleyin
            }

            const res = await axios.put(`https://grez-shop-lf6t.vercel.app/api/fann/postt/${editingItem._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Başarılı bir güncellemeden sonra, güncellenmiş öğeyi alın
            const updatedItem = res.data;

            // Mevcut items3 listesini güncelleyerek güncellenmiş öğeyi değiştirin
            setItems2((prevItems) =>
                prevItems.map((item) => (item._id === updatedItem._id ? updatedItem : item))
            );


            setTimeout(() => {
                window.location.reload();
            }, 1000);
            setIsEditing(false); // Düzenleme modunu kapat
            setEditingItem(null); // Düzenleme öğesini sıfırla
            setPhoto(null); // Fotoğrafı temizle
            setForm2({ title: '', price: '' }); // Formu sıfırla
            setSuccess(true); // Başarılı mesajını göster

        } catch (error) {
            console.error('Güncelleme hatası:', error);
            setError('Güncelleme sırasında bir hata oluştu.');
        }
    };
    const updateTikTokItem3 = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            const formData = new FormData();
            formData.append('title', form3.title); // form3'teki başlık ve fiyat değerlerini alın
            formData.append('price', form3.price);
            if (photo) {
                formData.append('photo', photo); // Fotoğraf varsa ekleyin
            }

            const res = await axios.put(`https://grez-shop-lf6t.vercel.app/api/tiktok/postt/${editingItem._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Başarılı bir güncellemeden sonra, güncellenmiş öğeyi alın
            const updatedItem = res.data;

            // Mevcut items3 listesini güncelleyerek güncellenmiş öğeyi değiştirin
            setItems3((prevItems) =>
                prevItems.map((item) => (item._id === updatedItem._id ? updatedItem : item))
            );



            setTimeout(() => {
                window.location.reload();
            }, 1000);
            setIsEditing(false); // Düzenleme modunu kapat
            setEditingItem(null); // Düzenleme öğesini sıfırla
            setPhoto(null); // Fotoğrafı temizle
            setForm3({ title: '', price: '' }); // Formu sıfırla
            setSuccess(true); // Başarılı mesajını göster

        } catch (error) {
            console.error('Güncelleme hatası:', error);
            setError('Güncelleme sırasında bir hata oluştu.');
        }
    };



    return (
        <div className={styles.container}>
            {/* Form 1: PUBG */}
            <form onSubmit={(e) => isEditing ? updateTikTokItem(e, 'https://grez-shop-lf6t.vercel.app/api/pubg/postt/', setItems1) : handleFormSubmit(e, form1, setForm1, 'https://grez-shop-lf6t.vercel.app/api/pubg/postt', setItems1)} className={styles.form}>
                <div {...getRootProps()} className={styles.dropzone}>
                    <input {...getInputProps()} />
                    {isDragActive ? <p>Dosyayı buraya bırakın...</p> : <p>Fotoğraf yüklemek için tıklayın veya sürükleyin.</p>}
                </div>
                {photo && <p>Yüklü fotoğraf: {photo.name}</p>}
                <h2 className={styles.title}>Form 1: Yeni Post Oluştur (PUBG)</h2>
                {error && <p className={styles.errorMessage}>{error}</p>}
                {success && <p className={styles.successMessage}>Post başarılı bir şekilde oluşturuldu!</p>}
                <div className="mb-4">
                    <label htmlFor="title1" className="block mb-2 font-medium">Başlık</label>
                    <input
                        type="text"
                        id="title1"
                        value={form1.title}
                        onChange={(e) => setForm1({ ...form1, title: e.target.value })}
                        required
                        className={styles.input}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="price1" className="block mb-2 font-medium">Fiyat</label>
                    <input
                        type="text"
                        id="price1"
                        value={form1.price}
                        onChange={(e) => setForm1({ ...form1, price: e.target.value })}
                        required
                        className={styles.input}
                    />
                </div>
                <button type="submit" className={styles.button}>{isEditing ? 'Güncelle' : 'ADD PUBG'}</button>
            </form>

            {/* PUBG Items */}
            <div className={styles.itemList}>
                <h2 className={styles.title}>PUBG Ürünleri</h2>
                {items1.length === 0 ? <p>Hiç ürün yok.</p> : (
                    <ul>
                        {items1.map((item) => (
                            <li key={item._id} className={styles.item}>
                                <img
                                    src={`data:image/jpeg;base64,${item.photo}`}
                                    alt={item.title}
                                    className={styles.image}
                                />
                                <div>
                                    <p className="text-gray-700">{item.title} - {item.price} ₺</p>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className={styles.editButton}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id, 'https://grez-shop-lf6t.vercel.app/api/pubg/', setItems1)}
                                        className={styles.deleteButton}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>




            {/* Form 3: Tiktok */}
            <form onSubmit={(e) => isEditing ? updateTikTokItem3(e, 'https://grez-shop-lf6t.vercel.app/api/tiktok/postt/', setItems3) : handleFormSubmit(e, form3, setForm3, 'https://grez-shop-lf6t.vercel.app/api/tiktok/postt', setItems3)} className={styles.form}>
                <div {...getRootProps()} className={styles.dropzone}>
                    <input {...getInputProps()} />
                    {isDragActive ? <p>Dosyayı buraya bırakın...</p> : <p>Fotoğraf yüklemek için tıklayın veya sürükleyin.</p>}
                </div>
                {photo && <p>Yüklü fotoğraf: {photo.name}</p>}
                <h2 className={styles.title}>Form 3: Yeni Post Oluştur (Tiktok)</h2>
                {error && <p className={styles.errorMessage}>{error}</p>}
                {success && <p className={styles.successMessage}>Post başarılı bir şekilde oluşturuldu!</p>}
                <div className="mb-4">
                    <label htmlFor="title3" className="block mb-2 font-medium">Başlık</label>
                    <input
                        type="text"
                        id="title3"
                        value={form3.title}
                        onChange={(e) => setForm3({ ...form3, title: e.target.value })}
                        required
                        className={styles.input}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="price3" className="block mb-2 font-medium">Fiyat</label>
                    <input
                        type="text"
                        id="price3"
                        value={form3.price}
                        onChange={(e) => setForm3({ ...form3, price: e.target.value })}
                        required
                        className={styles.input}
                    />
                </div>
                <button type="submit" className={styles.button}>{isEditing ? 'Güncelle' : 'ADD TIKTOK'}</button>
            </form>

            {/* Tiktok Items */}
            <div className={styles.itemList}>
                <h2 className={styles.title}>Tiktok Ürünleri</h2>
                {items3.length === 0 ? <p>Hiç ürün yok.</p> : (
                    <ul>
                        {items3.map((item) => (
                            <li key={item._id} className={styles.item}>
                                 <img
                                    src={`data:image/jpeg;base64,${item.photo}`}
                                    alt={item.title}
                                    className={styles.image}
                                />
                              <div>
                              <p className="text-gray-700">{item.title} - {item.price} ₺</p>
                                <button
                                    onClick={() => handleEdit(item)}
                                    className={styles.editButton}
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id, 'https://grez-shop-lf6t.vercel.app/api/tiktok/', setItems3)}
                                    className={styles.deleteButton}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {/* Form 2: Fann */}
            <form onSubmit={(e) => isEditing ? updateTikTokItem2(e, 'https://grez-shop-lf6t.vercel.app/api/fann/postt/', setItems2) : handleFormSubmit(e, form2, setForm2, 'https://grez-shop-lf6t.vercel.app/api/fann/postt', setItems2)} className={styles.form}>
                <div {...getRootProps()} className={styles.dropzone}>
                    <input {...getInputProps()} />
                    {isDragActive ? <p>Dosyayı buraya bırakın...</p> : <p>Fotoğraf yüklemek için tıklayın veya sürükleyin.</p>}
                </div>
                {photo && <p>Yüklü fotoğraf: {photo.name}</p>}
                <h2 className={styles.title}>Form 2: Yeni Post Oluştur (Fann)</h2>
                {error && <p className={styles.errorMessage}>{error}</p>}
                {success && <p className={styles.successMessage}>Post başarılı bir şekilde oluşturuldu!</p>}
                <div className="mb-4">
                    <label htmlFor="title2" className="block mb-2 font-medium">Başlık</label>
                    <input
                        type="text"
                        id="title2"
                        value={form2.title}
                        onChange={(e) => setForm2({ ...form2, title: e.target.value })}
                        required
                        className={styles.input}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="price2" className="block mb-2 font-medium">Fiyat</label>
                    <input
                        type="text"
                        id="price2"
                        value={form2.price}
                        onChange={(e) => setForm2({ ...form2, price: e.target.value })}
                        required
                        className={styles.input}
                    />
                </div>
                <button type="submit" className={styles.button}>{isEditing ? 'Güncelle' : 'ADD FANN'}</button>
            </form>

            {/* Fann Items */}
            <div className={styles.itemList}>
                <h2 className={styles.title}>Fann Ürünleri</h2>
                {items2.length === 0 ? <p>Hiç ürün yok.</p> : (
                    <ul>
                        {items2.map((item) => (
                            <li key={item._id} className={styles.item}>
                                  <img
                                    src={`data:image/jpeg;base64,${item.photo}`}
                                    alt={item.title}
                                    className={styles.image}
                                />
                              <div>
                              <p className="text-gray-700">{item.title} - {item.price} ₺</p>
                                <button
                                    onClick={() => handleEdit(item)}
                                    className={styles.editButton}
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id, 'https://grez-shop-lf6t.vercel.app/api/fann/', setItems2)}
                                    className={styles.deleteButton}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Postat;
