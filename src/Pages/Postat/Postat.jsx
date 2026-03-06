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
const [image, setImage] = useState("");
const [category, setCategory] = useState("pubg");

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

const handleImage = (e) => {

    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onloadend = () => {

        setImage(reader.result.split(",")[1]);

    };

    reader.readAsDataURL(file);

};

const submitHandler = async (e) => {

    e.preventDefault();

    try {

        await axios.post(`https://grez-shop-lf6t.vercel.app/api/${category}`, {

            title,
            price,
            image

        });

        toast.success("Product əlavə edildi");

        setTitle("");
        setPrice("");
        setImage("");

        fetchItems();

    } catch (error) {

        toast.error("Əlavə edilə bilmədi");

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
onChange={(e)=>setTitle(e.target.value)}
required
/>

<input
placeholder="Price"
value={price}
onChange={(e)=>setPrice(e.target.value)}
required
/>

<input
type="file"
onChange={handleImage}
required
/>

<select
value={category}
onChange={(e)=>setCategory(e.target.value)}
>

<option value="pubg">PUBG</option>
<option value="fann">Fann</option>
<option value="tiktok">Tiktok</option>

</select>

<button type="submit">
Add Product
</button>

</form>

<div className={styles.products}>

<h2>PUBG</h2>

{items.pubg.map((item)=>(
<div key={item._id} className={styles.card}>

<img src={`data:image/jpeg;base64,${item.image}`} />

<h3>{item.title}</h3>

<p>{item.price} ₼</p>

<button onClick={()=>deleteItem(item._id,"pubg")}>
<FaTrash/>
</button>

</div>
))}

<h2>Fann</h2>

{items.fann.map((item)=>(
<div key={item._id} className={styles.card}>

<img src={`data:image/jpeg;base64,${item.image}`} />

<h3>{item.title}</h3>

<p>{item.price} ₼</p>

<button onClick={()=>deleteItem(item._id,"fann")}>
<FaTrash/>
</button>

</div>
))}

<h2>Tiktok</h2>

{items.tiktok.map((item)=>(
<div key={item._id} className={styles.card}>

<img src={`data:image/jpeg;base64,${item.image}`} />

<h3>{item.title}</h3>

<p>{item.price} ₼</p>

<button onClick={()=>deleteItem(item._id,"tiktok")}>
<FaTrash/>
</button>

</div>
))}

</div>

</div>

);

}

export default Postat;
