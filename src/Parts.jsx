import { useEffect, useState } from "react";

export default function Parts() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");

  async function loadParts() {
    try {
      const res = await fetch("http://127.0.0.1:8000/parts");
      if (!res.ok) throw new Error("Failed to fetch parts");
      const data = await res.json();
      setParts(data);
    } catch (err) {
      setError("Could not load parts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadParts();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();

    const newPart = {
      id: Number(id),
      name,
      quantity: Number(quantity),
      location,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/parts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPart),
      });

      const data = await res.json();
      setParts((prev) => [...prev, data.part]);

      setId("");
      setName("");
      setQuantity("");
      setLocation("");
    } catch (err) {
      setError("Failed to add part");
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`http://127.0.0.1:8000/parts/${id}`, {
        method: "DELETE",
      });

      setParts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError("Failed to delete part");
    }
  }

  if (loading) return <h2>Loading parts...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Inventory Parts</h1>

      <form onSubmit={handleAdd} style={{ marginBottom: "20px" }}>
        <h2>Add Part</h2>

        <input
          type="number"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button type="submit">Add Part</button>
      </form>

      <ul>
        {parts.map((part) => (
          <li key={part.id} style={{ marginBottom: "10px" }}>
            <strong>{part.name}</strong> — {part.quantity} units —{" "}
            {part.location}
            <button
              onClick={() => handleDelete(part.id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
