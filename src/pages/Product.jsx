// Product.jsx

import { useEffect, useState } from "react";
import API from "../../src/services/api";
import "./Product.css";

function Product() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    id: "",
    name: "",
    price: "",
    stock: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // ADD PRODUCT
  // =========================
  const addProduct = async () => {
    if (!form.name || !form.price || !form.stock) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/products", form);
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  // =========================
  // EDIT CLICK
  // =========================
  const editProduct = (product) => {
    setForm(product);
    setEditMode(true);
  };

  // =========================
  // UPDATE PRODUCT
  // =========================
  const updateProduct = async () => {
    try {
      await API.put(`/products/${form.id}`, form);
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Error updating product", error);
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setForm({
      id: "",
      name: "",
      price: "",
      stock: "",
    });

    setEditMode(false);
  };

  // =========================
  // CALCULATIONS
  // =========================
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, item) => sum + Number(item.stock),
    0
  );

  const totalValue = products.reduce(
    (sum, item) => sum + item.price * item.stock,
    0
  );

  // =========================
  // SEARCH FILTER
  // =========================
  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="product-container">

      <h2>Product Management</h2>

      {/* DASHBOARD CARDS */}
      <div className="product-cards">

        <div className="card blue">
          <h3>Total Products</h3>
          <p>{totalProducts}</p>
        </div>

        <div className="card green">
          <h3>Total Stock</h3>
          <p>{totalStock}</p>
        </div>

        <div className="card purple">
          <h3>Inventory Value</h3>
          <p>₹ {totalValue}</p>
        </div>

      </div>

      {/* FORM */}
      <div className="product-form-box">

        <div className="product-form">

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
          />

          {editMode ? (
            <>
              <button onClick={updateProduct}>Update</button>
              <button className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            </>
          ) : (
            <button onClick={addProduct}>Add Product</button>
          )}

        </div>
      </div>

      {/* SEARCH */}
      <input
        className="search-box"
        type="text"
        placeholder="Search Product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <table className="product-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price ₹</th>
            <th>Stock</th>
            <th>Total ₹</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {filteredProducts.map((product) => (
            <tr key={product.id}>

              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>{product.price * product.stock}</td>

              <td>
                <button
                  className="edit-btn"
                  onClick={() => editProduct(product)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteProduct(product.id)}
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}

        </tbody>
      </table>

    </div>
  );
}

export default Product;