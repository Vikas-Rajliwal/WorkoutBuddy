//components/create/CreateRoutine.jsx

import "./popUp.css";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext.jsx";
import "./createEntry.css";

const CreateRoutine = ({ setOpen }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    workout_type: "strength",
    body_part: "full_body",
    link: "",
    author: user?._id,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Example workout types
  const workoutTypes = [
    "strength",
    "cardio",
    "flexibility",
    "hiit",
    "endurance",
    "balance",
  ];

  // Example body parts
  const bodyParts = [
    "full_body",
    "upper_body",
    "lower_body",
    "core",
    "arms",
    "legs",
    "back",
    "chest",
    "shoulders",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // console.log("Submitting data:", formData);
    try {
      const response = await axios.post("https://workoutbuddy-l3uu.onrender.com/api/routines/", formData);

      if (response.data) {
        setOpen(false);
        window.location.reload();
      }
    } catch (err) {
      console.error("Error creating routine:", err);
      setError(
        err.response?.data?.message  ||
          "Failed to create routine. Please ensure all fields are filled correctly."
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
    return <div className="error-message">Please log in to create a routine.</div>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button
          className="close-button"
          onClick={() => setOpen(false)}
          aria-label="Close modal"
        >
          ×
        </button>

        <h2 className="modal-title">Create New Routine</h2>

        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-group">
            <label htmlFor="name">Routine Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Full Body Strength Training"
            />
          </div>

          <div className="form-group">
            <label htmlFor="workout_type">Workout Type *</label>
            <select
              id="workout_type"
              name="workout_type"
              value={formData.workout_type}
              onChange={handleChange}
              required
              className="select-input"
            >
              {workoutTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="body_part">Body Part *</label>
            <select
              id="body_part"
              name="body_part"
              value={formData.body_part}
              onChange={handleChange}
              required
              className="select-input"
            >
              {bodyParts.map((part) => (
                <option key={part} value={part}>
                  {part.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="link">Video/Resource Link</label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="e.g., YouTube tutorial link"
            />
            <small className="helper-text">Optional: Add a link to a video demonstration or resource</small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="submit-button"
            disabled={loading || !formData.name || !formData.workout_type || !formData.body_part}
          >
            {loading ? "Creating..." : "Create Routine"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoutine;
