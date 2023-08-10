/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const CitiesContext = createContext();

const BASE_URL = "http://localhost:8000/";

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    setIsLoading(true);
    fetch(BASE_URL + "cities")
      .then((res) => res.json())
      .then((data) => {
        setCities(data);
        console.log(data);
        setIsLoading(false);
        console.log(isLoading);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  function getCity(id) {
    fetch(BASE_URL + "cities/" + id)
      .then((res) => res.json())
      .then((city) => {
        setCurrentCity(city);
        console.log("Current City", city);
        setIsLoading(false);
        console.log(isLoading);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }

  async function createCity(newCity) {
    setIsLoading(true);
    fetch(BASE_URL + "cities", {
      method: "POST",
      body: JSON.stringify(newCity),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setCities((cities) => [...cities, data]))
      .catch((err) => console.log(err))
      .finally(setIsLoading(false));
  }

  async function deleteCity(id) {
    setIsLoading(true);
    fetch(BASE_URL + "cities/" + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      // eslint-disable-next-line no-unused-vars
      .then((data) => setCities((cities) => cities.filter(city=>city.id!==id)))
      .catch((err) => console.log(err))
      .finally(setIsLoading(false));
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        setCurrentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCitiesContext() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext is used outside its scope");
  return context;
}

CitiesProvider.propTypes = {
  children: PropTypes.object,
};

export { CitiesProvider, useCitiesContext };
