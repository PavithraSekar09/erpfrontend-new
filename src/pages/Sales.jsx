import { useEffect, useState } from "react";
import API from "../services/api";
import "./Sales.css";

function Sales() {
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    productName: "",
    quantity: "",
    totalAmount: "",
    paymentType: "Cash",
    status: "Completed"
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await API.get("/sales/orders");
      setOrders(res.data);
    } catch (error) {
      console.log("Error loading orders", error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const saveOrder = async () => {
    try {
      await API.post("/sales/orders", {
        ...form,
        quantity: Number(form.quantity),
        totalAmount: Number(form.totalAmount)
      });

      loadOrders();

      setForm({
        customerName: "",
        productName: "",
        quantity: "",
        totalAmount: "",
        paymentType: "Cash",
        status: "Completed"
      });
    } catch (error) {
      console.log("Error saving order", error);
    }
  };

  // DATE FILTER
  const filteredOrders = orders.filter((o) =>
    selectedDate ? o.orderDate === selectedDate : true
  );

  // SUMMARY
  const totalSales = filteredOrders.reduce(
    (sum, item) => sum + (item.totalAmount || 0),
    0
  );

  const totalOrders = filteredOrders.length;

  const totalQty = filteredOrders.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  return (
    <div className="sales-container">
      <h2>Sales Management</h2>

      {/* Summary Cards */}
      <div className="sales-cards">
        <div className="sales-card blue">
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>

        <div className="sales-card green">
          <h3>Total Sales</h3>
          <p>₹ {totalSales}</p>
        </div>

        <div className="sales-card orange">
          <h3>Total Quantity</h3>
          <p>{totalQty}</p>
        </div>
      </div>

      {/* Add Order Form */}
      <div className="sales-form">
        <input
          type="text"
          name="customerName"
          placeholder="Customer Name"
          value={form.customerName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={form.productName}
          onChange={handleChange}
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
        />

        <input
          type="number"
          name="totalAmount"
          placeholder="Total Amount"
          value={form.totalAmount}
          onChange={handleChange}
        />

        <select
          name="paymentType"
          value={form.paymentType}
          onChange={handleChange}
        >
          <option>Cash</option>
          <option>UPI</option>
          <option>Card</option>
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option>Completed</option>
          <option>Pending</option>
          <option>Cancelled</option>
        </select>

        <button onClick={saveOrder}>Add Order</button>
      </div>

      {/* Date Filter */}
      <div className="date-filter">
        <label>Select Date: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <button onClick={() => setSelectedDate("")}>
          Show All
        </button>
      </div>

      {/* Orders Table */}
      <table className="sales-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customerName}</td>
              <td>{o.productName}</td>
              <td>{o.quantity}</td>
              <td>₹ {o.totalAmount}</td>
              <td>{o.paymentType}</td>
              <td>
                <span
                  className={
                    o.status === "Completed"
                      ? "done"
                      : o.status === "Pending"
                      ? "pending"
                      : "cancel"
                  }
                >
                  {o.status}
                </span>
              </td>
              <td>{o.orderDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Sales;