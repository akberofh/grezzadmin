import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// SVG İkon Bileşenleri (Kütüphane bağımlılığını kaldırmak için)
const TrashIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"></path></svg>
);

const PlusIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>
);

const SearchIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>
);

function Postat() {
  const [items, setItems] = useState({
    pubg: [],
    fann: [],
    tiktok: []
  });

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("new");

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);
  const [category, setCategory] = useState("pubg");

  const fetchItems = async () => {
    try {
      setLoading(true);
      const pubg = await axios.get("https://grez-shop-lf6t.vercel.app/api/pubg/");
      const fann = await axios.get("https://grez-shop-lf6t.vercel.app/api/fann/");
      const tiktok = await axios.get("https://grez-shop-lf6t.vercel.app/api/tiktok/");

      setItems({
        pubg: pubg.data.allPubges || [],
        fann: fann.data.allFanns || [],
        tiktok: tiktok.data.allTiktokes || []
      });
    } catch (err) {
      toast.error("Məhsullar yüklənmədi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error("Şəkil çox böyükdür (Max 4MB)");
        e.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!title || !price) {
      toast.error("Başlıq və qiymət boş ola bilməz");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title,
        price,
        photo,
      };

      await axios.post(
        `https://grez-shop-lf6t.vercel.app/api/${category}/postt`,
        payload
      );

      toast.success("Məhsul əlavə edildi");
      setTitle("");
      setPrice("");
      setPhoto(null);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.status === 413 ? "Şəkil ölçüsü çox böyükdür!" : "Əlavə edilə bilmədi");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id, type) => {
    if (!window.confirm("Silmək istədiyinizə əminsiniz?")) return;
    try {
      setDeletingId(id);
      await axios.delete(`https://grez-shop-lf6t.vercel.app/api/${type}/${id}`);
      toast.success("Silindi");
      fetchItems();
    } catch (err) {
      toast.error("Silinmədi");
    } finally {
      setDeletingId(null);
    }
  };

  const filterAndSort = (arr) => {
    let data = [...arr];

    if (search.trim() !== "") {
      data = data.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "price") {
      data.sort((a, b) => {
        const valA = parseFloat(String(a.price).replace(/[^0-9.]/g, "")) || 0;
        const valB = parseFloat(String(b.price).replace(/[^0-9.]/g, "")) || 0;
        return valA - valB;
      });
    } else if (sort === "new") {
      data.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });
    }

    return data;
  };

  const renderProducts = (data, type) => (
    <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5">
      {filterAndSort(data).map(item => (
        <div key={item._id} className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition p-3">
          {item.photo && (
            <img
              src={item.photo.startsWith('data:') ? item.photo : `data:image/jpeg;base64,${item.photo}`}
              alt={item.title}
              className="h-40 w-full object-cover rounded"
            />
          )}
          <div className="mt-3">
            <h3 className="font-semibold text-lg truncate">{item.title}</h3>
            <p className="text-green-600 font-bold text-xl">{item.price} ₼</p>
            <button
              onClick={() => deleteItem(item._id, type)}
              disabled={deletingId === item._id}
              className="mt-3 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 flex justify-center items-center gap-2 disabled:bg-gray-400"
            >
              {deletingId === item._id ? "Silinir..." : <><TrashIcon /> Sil</>}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Grez Admin Panel</h1>
          {loading && <span className="animate-pulse text-blue-600 font-medium">Yenilənir...</span>}
        </header>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <PlusIcon className="text-blue-500" /> Yeni Məhsul Əlavə Et
          </h2>
          <form onSubmit={submitHandler} className="grid md:grid-cols-5 gap-4">
            <input
              placeholder="Məhsul adı"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              placeholder="Qiymət (məs: 50)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border border-gray-200 p-2 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-200 p-3 rounded-xl bg-white outline-none"
            >
              <option value="pubg">PUBG Mobile</option>
              <option value="fann">FANN Aksesuar</option>
              <option value="tiktok">Tiktok Hesabı</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {loading ? "Gözləyin..." : "Əlavə Et"}
            </button>
          </form>
        </div>

        <div className="flex flex-wrap gap-4 mb-10 items-center bg-white p-4 rounded-2xl shadow-sm">
          <div className="relative flex-1 min-w-[250px] flex items-center">
            <div className="absolute left-3">
              <SearchIcon />
            </div>
            <input
              placeholder="Məhsul axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-100 bg-gray-50 rounded-xl w-full outline-none focus:bg-white focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-100 bg-gray-50 p-3 rounded-xl outline-none"
          >
            <option value="new">📅 Ən Yeni</option>
            <option value="price">💰 Qiymət (Artan)</option>
          </select>
        </div>

        <section className="space-y-12">
          <div>
            <div className="flex items-center justify-between border-b pb-2 mb-6">
              <h2 className="text-2xl font-bold text-gray-700">PUBG Mobile</h2>
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-bold">
                {items.pubg.length} ədəd
              </span>
            </div>
            {items.pubg.length > 0 ? renderProducts(items.pubg, "pubg") : <p className="text-gray-400 italic">Məlumat yoxdur.</p>}
          </div>

          <div>
            <div className="flex items-center justify-between border-b pb-2 mb-6">
              <h2 className="text-2xl font-bold text-gray-700">FANN Aksesuar</h2>
              <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-bold">
                {items.fann.length} ədəd
              </span>
            </div>
            {items.fann.length > 0 ? renderProducts(items.fann, "fann") : <p className="text-gray-400 italic">Məlumat yoxdur.</p>}
          </div>

          <div>
            <div className="flex items-center justify-between border-b pb-2 mb-6">
              <h2 className="text-2xl font-bold text-gray-700">Tiktok Hesabları</h2>
              <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-bold">
                {items.tiktok.length} ədəd
              </span>
            </div>
            {items.tiktok.length > 0 ? renderProducts(items.tiktok, "tiktok") : <p className="text-gray-400 italic">Məlumat yoxdur.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Postat;
