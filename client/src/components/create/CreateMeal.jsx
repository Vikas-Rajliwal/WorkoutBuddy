//components/create/CreateMeal.jsx

import "./popUp.css";
import "./createMeal.css";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";

const CreateMeal = ({ setOpen }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    recipe: "",
    time: 30,
    description: "",
    category: "breakfast",
    author: user?._id,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Example meal categories
  const mealCategories = [
    "breakfast",
    "lunch",
    "dinner",
    "snack",
    "pre-workout",
    "post-workout",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/meals", formData);

      if (response.data) {
        setOpen(false);
        window.location.reload();
      }
    } catch (err) {
      console.error("Error creating meal:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create meal. Please ensure all fields are filled correctly."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!user) {
    return <div className="error-message">Please log in to create a meal.</div>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Create New Meal</h2>
          <button
            className="close-button"
            onClick={() => setOpen(false)}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="create-form">
            <div className="form-group">
              <label htmlFor="name">Meal Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Protein Smoothie"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="select-input"
              >
                {mealCategories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="time">Preparation Time (minutes) *</label>
              <input
                type="number"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                min="1"
                max="480"
              />
            </div>

            <div className="form-group">
              <label htmlFor="recipe">Recipe</label>
              <textarea
                id="recipe"
                name="recipe"
                value={formData.recipe}
                onChange={handleChange}
                placeholder="List your ingredients and steps..."
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add any additional notes or description..."
                rows="3"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-footer">
              <button
                type="submit"
                className="submit-button"
                disabled={
                  loading ||
                  !formData.name ||
                  !formData.category ||
                  !formData.time
                }
              >
                {loading ? "Creating..." : "Create Meal"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMeal;
