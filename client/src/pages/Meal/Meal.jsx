//pages/Meal/Meal.jsx

import React, { useContext, useState } from "react";
import Navbar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import useFetch from "../../useFetch";
import { AuthContext } from "../../AuthContext";
import "./meal.css";
import CreateMeal from "../../components/create/CreateMeal";

const Meal = () => {
  const { user } = useContext(AuthContext);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data, loading, error } = useFetch(
    `https://workoutbuddy-l3uu.onrender.com/api/meals/${user?._id}`
  );

  if (!user) {
    return (
      <div className="mealsView">
        <Navbar />
        <div className="noMeals">
          <h2>Please Log In</h2>
          <p>You need to be logged in to view your meals.</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mealsView">
        <Navbar />
        <div className="noMeals">
          <h2>Loading...</h2>
          <p>Fetching your meals...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mealsView">
        <Navbar />
        <div className="noMeals">
          <h2>Error</h2>
          <p>Failed to load meals. Please try again later.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="mealsView">
      <Navbar />
      <div className="pageHeader">
        <h1>My Meals</h1>
        <button
          className="createButton"
          onClick={() => setShowCreateModal(true)}
        >
          Create New Meal
        </button>
      </div>
      <div className="mealsViewContainer">
        {!Array.isArray(data) || data.length === 0 ? (
          <div className="noMeals">
            <h2>No Meals Yet</h2>
            <p>Start by adding your favorite meals!</p>
            <button
              className="createButton"
              onClick={() => setShowCreateModal(true)}
            >
              Add Your First Meal
            </button>
          </div>
        ) : (
          data.map((meal) => (
            <div className="mealViewItem" key={meal._id}>
              <h1>{meal.name}</h1>
              <div className="mealContent">
                <div className="mealSection">
                  <h2>Description</h2>
                  <div className="mealText">
                    {meal.description || "No description available"}
                  </div>
                </div>

                <div className="mealSection">
                  <h2>Details</h2>
                  <div className="mealItem">
                    <span>⏱ Preparation Time</span>
                    <span>{meal.time} minutes</span>
                  </div>
                  <div className="mealItem">
                    <span>📋 Category</span>
                    <span className="mealCat">{meal.category}</span>
                  </div>
                </div>

                {meal.recipe && (
                  <div className="mealSection">
                    <h2>Recipe</h2>
                    <div className="mealItem">
                      <span>📝 Instructions</span>
                      <a
                        href={meal.recipe}
                        className="recipeLink"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Recipe
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {showCreateModal && <CreateMeal setOpen={setShowCreateModal} />}
      <Footer />
    </div>
  );
};

export default Meal;
