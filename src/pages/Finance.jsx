import { useEffect, useState } from "react";
import API from "../services/api";
import "./Finance.css";

function Finance() {
  const [assets, setAssets] = useState([]);
  const [revenue, setRevenue] = useState([]);

  const [assetName, setAssetName] = useState("");
  const [assetType, setAssetType] = useState("");
  const [purchaseCost, setPurchaseCost] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const assetRes = await API.get("/admin-finance/assets");
      const revenueRes = await API.get("/admin-finance/revenue");

      setAssets(assetRes.data);
      setRevenue(revenueRes.data);
    } catch (error) {
      console.log("Error loading finance data", error);
    }
  };

  // ADD ASSET
  const addAsset = async (e) => {
    e.preventDefault();

    try {
      await API.post("/admin-finance/assets", {
        assetName,
        assetType,
        purchaseCost,
        purchaseDate,
        status,
      });

      setAssetName("");
      setAssetType("");
      setPurchaseCost("");
      setPurchaseDate("");
      setStatus("Active");

      loadData();
    } catch (error) {
      console.log("Error adding asset", error);
    }
  };

  // DELETE ASSET
  const deleteAsset = async (id) => {
    try {
      await API.delete(`/admin-finance/assets/${id}`);
      loadData();
    } catch (error) {
      console.log("Delete error", error);
    }
  };

  // TOTALS
  const totalAssets = assets.reduce(
    (sum, item) => sum + (item.purchaseCost || 0),
    0
  );

  const totalRevenue = revenue.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  const profit = totalRevenue - totalAssets;

  return (
    <div className="finance-container">
      <h2>Finance Dashboard</h2>

      {/* SUMMARY */}
      <div className="finance-cards">
        <div className="card blue">
          <h3>Total Assets</h3>
          <p>₹ {totalAssets}</p>
        </div>

        <div className="card green">
          <h3>Total Revenue</h3>
          <p>₹ {totalRevenue}</p>
        </div>

        <div className={`card ${profit >= 0 ? "green" : "red"}`}>
          <h3>{profit >= 0 ? "Profit" : "Loss"}</h3>
          <p>₹ {profit}</p>
        </div>
      </div>

      {/* ADD ASSET FORM */}
      <div className="asset-form-box">
        <h3>Add New Asset</h3>

        <form onSubmit={addAsset} className="asset-form">
          <input
            type="text"
            placeholder="Asset Name"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            required
          />

          <select
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            <option>Electronics</option>
            <option>Furniture</option>
            <option>Vehicle</option>
            <option>Machinery</option>
            <option>Office Item</option>
            <option>Inventory</option>
          </select>

          <input
            type="number"
            placeholder="Purchase Cost"
            value={purchaseCost}
            onChange={(e) => setPurchaseCost(e.target.value)}
            required
          />

          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            required
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Active</option>
            <option>Sold</option>
            <option>Damaged</option>
          </select>

          <button type="submit">Add Asset</button>
        </form>
      </div>

      {/* ASSETS TABLE */}
      <h3>Assets</h3>

      <table className="finance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Cost</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {assets.map((a) => (
            <tr key={a.id}>
              <td>{a.assetName}</td>
              <td>{a.assetType}</td>
              <td>₹ {a.purchaseCost}</td>
              <td>{a.purchaseDate}</td>
              <td>{a.status}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteAsset(a.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* REVENUE TABLE */}
      <h3>Revenue</h3>

      <table className="finance-table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Payment</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {revenue.map((r) => (
            <tr key={r.id}>
              <td>{r.source}</td>
              <td>₹ {r.amount}</td>
              <td>{r.date}</td>
              <td>{r.paymentType}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Finance;