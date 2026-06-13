import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function AddPosts() {
  const navigate = useNavigate();
  const [nachrricht, setNachrricht] = useState('');
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    category:"",
    image: null,
  });

  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("text", formData.text);
    if (formData.image) {
      data.append("image", formData.image);
    }
    const res = await fetch(
      "http://localhost:5000/addPosts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }
    );
    const result = await res.json();
  console.log(data)
    setNachrricht(result.message)
  } catch (error) {
    console.log(error);
  }
};

  return (
    <>
    <Header />
      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="title"
          value={formData.title}
          onChange={handleChange}
        />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">
              Select Category
            </option>

            <option value="tops">
              Tops
            </option>

            <option value="pants">
              Pants
            </option>

            <option value="dresses">
              Dresses
            </option>

            <option value="shoes">
              Shoes
            </option>
          </select>
        <input
          type="text"
          name="text"
          placeholder="text"
          value={formData.text}
          onChange={handleChange}
        />

        { <input
          type="file"
          name="image"
          onChange={handleChange}
        /> }
        {nachrricht}

        <button type="submit">
          Save
        </button>

      </form>
      <button onClick={() => navigate('/dashboard')}>Zu Dashboard</button>
    </>
  );
}

export default AddPosts;