//components/create/CreateEntry.jsx

import "./popUp.css";
import "./createEntry.css";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";

const CreateEntry = ({ setOpen }) => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    routines: [],
    meals: [],
    author: user?._id,
  });

  const [availableRoutines, setAvailableRoutines] = useState([]);
  const [availableMeals, setAvailableMeals] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchRoutine, setSearchRoutine] = useState("");
  const [searchMeal, setSearchMeal] = useState("");
  const [showNewRoutineForm, setShowNewRoutineForm] = useState(false);
  const [showNewMealForm, setShowNewMealForm] = useState(false);

  // Quick add options
  const quickRoutines = [
    {
      name: "Quick Walk",
      workout_type: "cardio",
      body_part: "full_body",
      link: "",
    },
    {
      name: "Push-ups",
      workout_type: "strength",
      body_part: "upper_body",
      link: "",
    },
    {
      name: "Squats",
      workout_type: "strength",
      body_part: "lower_body",
      link: "",
    },
    {
      name: "Yoga",
      workout_type: "flexibility",
      body_part: "full_body",
      link: "",
    },
    {
      name: "Running",
      workout_type: "cardio",
      body_part: "full_body",
      link: "",
    },
  ];

  const quickMeals = [
    {
      name: "Breakfast Oatmeal",
      category: "breakfast",
      time: 10,
      recipe: "Oats with milk and honey",
      description: "Quick and healthy breakfast",
    },
    {
      name: "Protein Shake",
      category: "post-workout",
      time: 5,
      recipe: "Protein powder with milk",
      description: "Post workout recovery",
    },
    {
      name: "Chicken Salad",
      category: "lunch",
      time: 15,
      recipe: "Grilled chicken with mixed greens",
      description: "Healthy lunch option",
    },
    {
      name: "Greek Yogurt",
      category: "snack",
      time: 5,
      recipe: "Greek yogurt with honey",
      description: "Protein-rich snack",
    },
    {
      name: "Grilled Salmon",
      category: "dinner",
      time: 20,
      recipe: "Grilled salmon with vegetables",
      description: "Nutritious dinner",
    },
  ];

  const [newRoutine, setNewRoutine] = useState({
    name: "",
    workout_type: "strength",
    body_part: "full_body",
    link: "",
    author: user?._id,
  });

  const [newMeal, setNewMeal] = useState({
    name: "",
    category: "breakfast",
    time: 15,
    recipe: "",
    description: "",
    author: user?._id,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?._id) return;

      try {
        const [routinesRes, mealsRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/routines/user/${user._id}`),
          axios.get(`http://localhost:8000/api/meals/user/${user._id}`),
        ]);

        setAvailableRoutines(
          Array.isArray(routinesRes.data) ? routinesRes.data : []
        );
        setAvailableMeals(Array.isArray(mealsRes.data) ? mealsRes.data : []);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load your routines and meals. Please try again.");
        setAvailableRoutines([]);
        setAvailableMeals([]);
      }
    };

    fetchUserData();
  }, [user?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.author) {
      setError("Date and author are required");
      return;
    }

    if (!formData.routines.length && !formData.meals.length) {
      setError("Please select at least one routine or meal");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const entryData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        author: user._id,
      };

      const response = await axios.post(
        "http://localhost:8000/api/entries",
        entryData
      );

      if (response.data) {
        setOpen(false);
        window.location.reload();
      }
    } catch (err) {
      console.error("Error creating entry:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create entry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (item, type) => {
    try {
      const itemData = {
        ...item,
        author: user._id,
      };

      const response = await axios.post(
        `http://localhost:8000/api/${type}`,
        itemData
      );

      if (response.data) {
        if (type === "routines") {
          setAvailableRoutines((prev) => [...prev, response.data]);
          handleSelectItem(response.data, "routines");
        } else {
          setAvailableMeals((prev) => [...prev, response.data]);
          handleSelectItem(response.data, "meals");
        }
      }
    } catch (err) {
      console.error(`Error creating quick ${type.slice(0, -1)}:`, err);
      setError(`Failed to create ${type.slice(0, -1)}. Please try again.`);
    }
  };

  const handleCreateNew = async (type) => {
    try {
      const newItem = type === "routines" ? newRoutine : newMeal;

      if (!newItem.name) {
        setError(`Please enter a name for the new ${type.slice(0, -1)}`);
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/api/${type}`,
        newItem
      );

      if (response.data) {
        if (type === "routines") {
          setAvailableRoutines((prev) => [...prev, response.data]);
          handleSelectItem(response.data, "routines");
          setNewRoutine({
            name: "",
            workout_type: "strength",
            body_part: "full_body",
            link: "",
            author: user?._id,
          });
          setShowNewRoutineForm(false);
        } else {
          setAvailableMeals((prev) => [...prev, response.data]);
          handleSelectItem(response.data, "meals");
          setNewMeal({
            name: "",
            category: "breakfast",
            time: 15,
            recipe: "",
            description: "",
            author: user?._id,
          });
          setShowNewMealForm(false);
        }
        setError("");
      }
    } catch (err) {
      console.error(`Error creating new ${type.slice(0, -1)}:`, err);
      setError(
        err.response?.data?.message ||
          `Failed to create ${type.slice(0, -1)}. Please try again.`
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectItem = (item, type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].includes(item._id)
        ? prev[type].filter((id) => id !== item._id)
        : [...prev[type], item._id],
    }));
  };

  const filteredRoutines = availableRoutines.filter(
    (routine) =>
      routine.name.toLowerCase().includes(searchRoutine.toLowerCase()) ||
      routine.workout_type
        .toLowerCase()
        .includes(searchRoutine.toLowerCase()) ||
      routine.body_part.toLowerCase().includes(searchRoutine.toLowerCase())
  );

  const filteredMeals = availableMeals.filter(
    (meal) =>
      meal.name.toLowerCase().includes(searchMeal.toLowerCase()) ||
      meal.category.toLowerCase().includes(searchMeal.toLowerCase())
  );

  if (!user) {
    return (
      <div className="error-message">Please log in to create an entry.</div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Create New Entry</h2>
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
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                max={new Date().toISOString().split("T")[0]}
              />
              <small className="helper-text">
                Select the date for this entry (cannot be in the future)
              </small>
            </div>

            <div className="form-group">
              <label>Workouts</label>
              <div className="quick-add-section">
                <h4>Quick Add Workouts:</h4>
                <div className="quick-options">
                  {quickRoutines.map((routine, index) => (
                    <button
                      key={index}
                      type="button"
                      className="quick-add-btn"
                      onClick={() => handleQuickAdd(routine, "routines")}
                    >
                      {routine.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="searchable-select">
                <div className="search-header">
                  <input
                    type="text"
                    placeholder="Search workouts..."
                    value={searchRoutine}
                    onChange={(e) => setSearchRoutine(e.target.value)}
                    className="search-input"
                  />
                  <button
                    type="button"
                    className="add-new-btn"
                    onClick={() => setShowNewRoutineForm(!showNewRoutineForm)}
                  >
                    {showNewRoutineForm ? "Cancel" : "Add New"}
                  </button>
                </div>

                {showNewRoutineForm && (
                  <div className="new-item-form">
                    <input
                      type="text"
                      placeholder="Workout name"
                      value={newRoutine.name}
                      onChange={(e) =>
                        setNewRoutine((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="new-item-input"
                    />
                    <input
                      type="text"
                      placeholder="Video/Tutorial Link (optional)"
                      value={newRoutine.link}
                      onChange={(e) =>
                        setNewRoutine((prev) => ({
                          ...prev,
                          link: e.target.value,
                        }))
                      }
                      className="new-item-input"
                    />
                    <select
                      value={newRoutine.workout_type}
                      onChange={(e) =>
                        setNewRoutine((prev) => ({
                          ...prev,
                          workout_type: e.target.value,
                        }))
                      }
                      className="new-item-select"
                    >
                      <option value="strength">Strength</option>
                      <option value="cardio">Cardio</option>
                      <option value="flexibility">Flexibility</option>
                      <option value="hiit">HIIT</option>
                    </select>
                    <select
                      value={newRoutine.body_part}
                      onChange={(e) =>
                        setNewRoutine((prev) => ({
                          ...prev,
                          body_part: e.target.value,
                        }))
                      }
                      className="new-item-select"
                    >
                      <option value="full_body">Full Body</option>
                      <option value="upper_body">Upper Body</option>
                      <option value="lower_body">Lower Body</option>
                      <option value="core">Core</option>
                    </select>
                    <button
                      type="button"
                      className="create-new-btn"
                      onClick={() => handleCreateNew("routines")}
                      disabled={!newRoutine.name}
                    >
                      Create Workout
                    </button>
                  </div>
                )}

                <div className="options-container">
                  {filteredRoutines.length > 0 ? (
                    filteredRoutines.map((routine) => (
                      <div
                        key={routine._id}
                        className={`option-item ${
                          formData.routines.includes(routine._id)
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleSelectItem(routine, "routines")}
                      >
                        <span className="option-name">{routine.name}</span>
                        <span className="option-details">
                          {routine.workout_type} - {routine.body_part}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="no-options">No routines found</div>
                  )}
                </div>
              </div>
              <small className="helper-text">
                Click to select/deselect workouts. Selected:{" "}
                {formData.routines.length}
              </small>
            </div>

            <div className="form-group">
              <label>Meals</label>
              <div className="quick-add-section">
                <h4>Quick Add Meals:</h4>
                <div className="quick-options">
                  {quickMeals.map((meal, index) => (
                    <button
                      key={index}
                      type="button"
                      className="quick-add-btn"
                      onClick={() => handleQuickAdd(meal, "meals")}
                    >
                      {meal.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="searchable-select">
                <div className="search-header">
                  <input
                    type="text"
                    placeholder="Search meals..."
                    value={searchMeal}
                    onChange={(e) => setSearchMeal(e.target.value)}
                    className="search-input"
                  />
                  <button
                    type="button"
                    className="add-new-btn"
                    onClick={() => setShowNewMealForm(!showNewMealForm)}
                  >
                    {showNewMealForm ? "Cancel" : "Add New"}
                  </button>
                </div>

                {showNewMealForm && (
                  <div className="new-item-form">
                    <input
                      type="text"
                      placeholder="Meal name"
                      value={newMeal.name}
                      onChange={(e) =>
                        setNewMeal((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="new-item-input"
                    />
                    <textarea
                      placeholder="Recipe instructions"
                      value={newMeal.recipe}
                      onChange={(e) =>
                        setNewMeal((prev) => ({
                          ...prev,
                          recipe: e.target.value,
                        }))
                      }
                      className="new-item-input"
                      rows="3"
                    />
                    <textarea
                      placeholder="Meal description"
                      value={newMeal.description}
                      onChange={(e) =>
                        setNewMeal((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="new-item-input"
                      rows="2"
                    />
                    <select
                      value={newMeal.category}
                      onChange={(e) =>
                        setNewMeal((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="new-item-select"
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                      <option value="pre-workout">Pre-workout</option>
                      <option value="post-workout">Post-workout</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Preparation time (minutes)"
                      value={newMeal.time}
                      onChange={(e) =>
                        setNewMeal((prev) => ({
                          ...prev,
                          time: e.target.value,
                        }))
                      }
                      className="new-item-input"
                      min="1"
                      max="480"
                    />
                    <button
                      type="button"
                      className="create-new-btn"
                      onClick={() => handleCreateNew("meals")}
                      disabled={!newMeal.name}
                    >
                      Create Meal
                    </button>
                  </div>
                )}

                <div className="options-container">
                  {filteredMeals.length > 0 ? (
                    filteredMeals.map((meal) => (
                      <div
                        key={meal._id}
                        className={`option-item ${
                          formData.meals.includes(meal._id) ? "selected" : ""
                        }`}
                        onClick={() => handleSelectItem(meal, "meals")}
                      >
                        <span className="option-name">{meal.name}</span>
                        <span className="option-details">{meal.category}</span>
                      </div>
                    ))
                  ) : (
                    <div className="no-options">No meals found</div>
                  )}
                </div>
              </div>
              <small className="helper-text">
                Click to select/deselect meals. Selected:{" "}
                {formData.meals.length}
              </small>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-footer">
              <button
                type="submit"
                className="submit-button"
                disabled={
                  loading ||
                  !formData.date ||
                  (!formData.routines.length && !formData.meals.length)
                }
              >
                {loading ? "Creating..." : "Create Entry"}
              </button>
            </div>

            {!formData.routines.length && !formData.meals.length && (
              <small className="helper-text text-center">
                Please select at least one routine or meal
              </small>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEntry;
