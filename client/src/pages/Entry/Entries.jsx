//pages/Entry/Entries.jsx

import React, { useContext } from "react";
import useFetch from "../../useFetch";
import Navbar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import "./entry.css";
import { AuthContext } from "../../AuthContext";

const Entries = () => {
  const { user } = useContext(AuthContext);
  const { data, loading, error } = useFetch(`http://localhost:8000/api/entries/${user._id}`);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }

  if (!user) {
    return (
      <div className="entry">
        <Navbar />
        <div className="noEntries">
          <h2>Please Log In</h2>
          <p>You need to be logged in to view your entries.</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="entry">
        <Navbar />
        <div className="noEntries">
          <h2>Loading...</h2>
          <p>Fetching your entries...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="entry">
        <Navbar />
        <div className="noEntries">
          <h2>Error</h2>
          <p>Failed to load entries. Please try again later.</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="entry">
        <Navbar />
        <div className="noEntries">
          <h2>No Entries Yet</h2>
          <p>
            Start tracking your fitness journey by creating your first entry!
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="entry">
      <Navbar />
      <div className="entriesContainer">
        {data.map((entry) => (
          <div className="entryItem" key={entry._id}>
            <h1>{formatDate(entry.date)}</h1>

            <div className="entryContent">
              {entry.meals && entry.meals.length > 0 && (
                <>
                  <h2>Meals ({entry.meals.length})</h2>
                  <div className="mealsContainer">
                    {entry.meals.map((meal) => (
                      <div className="mealItem" key={meal._id}>
                        {meal.name}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {entry.routines && entry.routines.length > 0 && (
                <>
                  <h2>Workouts ({entry.routines.length})</h2>
                  <div className="routinesContainer">
                    {entry.routines.map((routine) => (
                      <div className="routineItem" key={routine._id}>
                        {routine.name}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!entry.meals?.length && !entry.routines?.length && (
                <p className="text-center helper-text">
                  No meals or workouts recorded for this day
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Entries;
