import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

function Postat() {

const [items,setItems] = useState({
pubg:[],
fann:[],
tiktok:[]
});

const [loading,setLoading] = useState(false);

const [search,setSearch] = useState("");
const [sort,setSort] = useState("new");

const [title,setTitle] = useState("");
const [price,setPrice] = useState("");
const [photo,setPhoto] = useState(null);
const [category,setCategory] = useState("pubg");



const fetchItems = async ()=>{

try{

setLoading(true);

const pubg = await axios.get("https://grez-shop-lf6t.vercel.app/api/pubg/");
const fann = await axios.get("https://grez-shop-lf6t.vercel.app/api/fann/");
const tiktok = await axios.get("https://grez-shop-lf6t.vercel.app/api/tiktok/");

setItems({
pubg:pubg.data.allPubges || [],
fann:fann.data.allFanns || [],
tiktok:tiktok.data.allTiktokes || []
});

}
catch{
toast.error("Məhsullar yüklənmədi");
}
finally{
setLoading(false);
}

};



useEffect(()=>{
fetchItems();
},[]);



const submitHandler = async (e)=>{

e.preventDefault();

if(!title || !price){
toast.error("Title və price boş ola bilməz");
return;
}

try{

setLoading(true);

const formData = new FormData();

formData.append("title",title);
formData.append("price",price);

if(photo){
formData.append("photo",photo);
}

await axios.post(
`https://grez-shop-lf6t.vercel.app/api/${category}/postt`,
formData
);

toast.success("Product əlavə edildi");

setTitle("");
setPrice("");
setPhoto(null);

fetchItems();

}
catch{
toast.error("Əlavə edilə bilmədi");
}
finally{
setLoading(false);
}

};



const deleteItem = async (id,type)=>{

try{

setLoading(true);

await axios.delete(
`https://grez-shop-lf6t.vercel.app/api/${type}/${id}`
);

toast.success("Silindi");

fetchItems();

}
catch{
toast.error("Silinmədi");
}
finally{
setLoading(false);
}

};



const filterAndSort = (arr)=>{

let data = [...arr];

if(search){
data = data.filter(item =>
item.title.toLowerCase().includes(search.toLowerCase())
);
}

if(sort === "price"){
data.sort((a,b)=>a.price - b.price);
}

if(sort === "new"){
data.reverse();
}

return data;

};



const renderProducts = (data,type)=>(
<div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5">

{filterAndSort(data).map(item=>(
<div
key={item._id}
className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition p-3"
>

{item.photo && (
<img
src={`data:image/jpeg;base64,${item.photo}`}
alt={item.title}
className="h-40 w-full object-cover rounded"
/>
)}

<div className="mt-3">

<h3 className="font-semibold text-lg">
{item.title}
</h3>

<p className="text-green-600 font-bold">
{item.price} ₼
</p>

<button
onClick={()=>deleteItem(item._id,type)}
className="mt-3 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 flex justify-center items-center gap-2"
>

<FaTrash/>

Sil

</button>

</div>

</div>
))}

</div>
);



return(

<div className="min-h-screen bg-gray-100 p-6">

<div className="max-w-7xl mx-auto">

<h1 className="text-3xl font-bold mb-6">
Admin Panel
</h1>



{loading && (
<div className="bg-blue-100 text-blue-700 p-3 rounded mb-4">
Yüklənir...
</div>
)}



<form
onSubmit={submitHandler}
className="bg-white p-5 rounded shadow mb-6 grid md:grid-cols-5 gap-3"
>

<input
placeholder="Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
className="border p-2 rounded"
/>

<input
placeholder="Price"
value={price}
onChange={(e)=>setPrice(e.target.value)}
className="border p-2 rounded"
/>

<input
type="file"
accept="image/*"
onChange={(e)=>setPhoto(e.target.files[0])}
className="border p-2 rounded"
/>

<select
value={category}
onChange={(e)=>setCategory(e.target.value)}
className="border p-2 rounded"
>

<option value="pubg">PUBG</option>
<option value="fann">Fann</option>
<option value="tiktok">Tiktok</option>

</select>

<button
type="submit"
className="bg-blue-600 text-white rounded hover:bg-blue-700"
>

{loading ? "Yüklənir..." : "Add"}

</button>

</form>



<div className="flex gap-4 mb-6">

<input
placeholder="Title ilə axtar"
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border p-2 rounded w-60"
/>

<select
value={sort}
onChange={(e)=>setSort(e.target.value)}
className="border p-2 rounded"
>

<option value="new">Yeni əlavə edilənlər</option>
<option value="price">Qiymət artan</option>

</select>

</div>



<h2 className="text-xl font-bold mb-3">
PUBG
</h2>

{renderProducts(items.pubg,"pubg")}



<h2 className="text-xl font-bold mt-10 mb-3">
FANN
</h2>

{renderProducts(items.fann,"fann")}



<h2 className="text-xl font-bold mt-10 mb-3">
TIKTOK
</h2>

{renderProducts(items.tiktok,"tiktok")}



</div>

</div>

);

}

export default Postat;
