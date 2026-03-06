import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Postat.module.css";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

function Postat() {
  const [items, setItems] = useState({
    pubg: [],
    fann: [],
    tiktok: []
  });

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null); // Fayl obyektini saxlayırıq
  const [category, setCategory] = useState("pubg");

  // Backend-dən itemləri çəkmək
  const fetchItems = async () => {
    try {
      const pubg = await axios.get("https://grez-shop-lf6t.vercel.app/api/pubg/");
      const fann = await axios.get("https://grez-shop-lf6t.vercel.app/api/fann/");
      const tiktok = await axios.get("https://grez-shop-lf6t.vercel.app/api/tiktok/");

      setItems({
        pubg: pubg.data.allPubges,
        fann: fann.data.allFanns,
        tiktok: tiktok.data.allTiktokes
      });
    } catch (error) {
      toast.error("Data alınmadı");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Fayl seçimi
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file); // Faylı birbaşa state-ə qoyuruq
  };

  // Yeni post əlavə etmək
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!title || !price || !photo) {
      toast.error("Bütün sahələri doldurun!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("photo", photo); // Fayl obyekti Multer-ə uyğun
      // Əgər backend-də digər sahələr var, onları da əlavə edə bilərsən
      // formData.append("description", description);

      await axios.post(
        `https://grez-shop-lf6t.vercel.app/api/${category}/postt`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Product əlavə edildi");

      setTitle("");
      setPrice("");
      setPhoto(null);

      fetchItems();
    } catch (error) {
      toast.error("Əlavə edilə bilmədi");
      console.error(error);
    }
  };

  const deleteItem = async (id, type) => {
    try {
      await axios.delete(`https://grez-shop-lf6t.vercel.app/api/${type}/${id}`);
      toast.success("Silindi");
      fetchItems();
    } catch (error) {
      toast.error("Silinmədi");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Admin Panel</h1>

      <form onSubmit={submitHandler} className={styles.form}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="file"
          onChange={handleImage}
          accept="image/*"
          required
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="pubg">PUBG</option>
          <option value="fann">Fann</option>
          <option value="tiktok">Tiktok</option>
        </select>

        <button type="submit">Add Product</button>
      </form>

      <div className={styles.products}>
        <h2>PUBG</h2>
        {items.pubg.map((item) => (
          <div key={item._id} className={styles.card}>
            <img src={`data:image/jpeg;base64,${item.photo}`} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.price} ₼</p>
            <button onClick={() => deleteItem(item._id, "pubg")}>
              <FaTrash />
            </button>
          </div>
        ))}

        <h2>Fann</h2>
        {items.fann.map((item) => (
          <div key={item._id} className={styles.card}>
            <img src={`data:image/jpeg;base64,${item.photo}`} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.price} ₼</p>
            <button onClick={() => deleteItem(item._id, "fann")}>
              <FaTrash />
            </button>
          </div>
        ))}

        <h2>Tiktok</h2>
        {items.tiktok.map((item) => (
          <div key={item._id} className={styles.card}>
            <img src={`data:image/jpeg;base64,${item.photo}`} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.price} ₼</p>
            <button onClick={() => deleteItem(item._id, "tiktok")}>
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Postat;
