/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";

const CitiesContext = createContext();

const BASE_URL = "http://localhost:8000/";

// eslint-disable-next-line no-unused-vars
const initialState ={
  cities:[],
  isLoading:false,
  currentCity:{},
  error:"",
}
function reducer(state, action){
  switch (action.type) {
    case "loading":
      return {
        ...state, isLoading:true
      }
    case "cities/loaded":
      return {
        ...state, isLoading:false, cities: action.payload
      }
    case "city/loaded":
      return {
        ...state, isLoading:false, currentCity:action.payload,
      }
    case "city/created":
      return {
        ...state, isLoading:false, cities:[...state.cities, action.payload],
        currentCity:action.payload,
      }
    case "city/deleted":
      return {
        ...state, isLoading:false, cities:state.cities.filter(city=>city.id!==action.payload),
        currentCity:{},
      }
    case "rejected":
      return {
        ...state, isLoading:false, error:action.payload
      }
    default:
      throw new Error("unknown action type");
  }
}
function CitiesProvider({ children }) {

  const [{cities, isLoading, currentCity}, dispatch] = useReducer(reducer, initialState);

  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    dispatch({type:"loading"});
    fetch(BASE_URL + "cities")
      .then((res) => res.json())
      .then((data) => {
        dispatch({type:"cities/loaded", payload:data});
      })
      .catch(() => {
        dispatch({type:"rejected", payload:"there was an error loading cities..."})
      });
  }, []);

  function getCity(id) {
    // check if the city we wanna load is the same as current city and do nothing in this case (don't send a request)
    if(Number(id)===currentCity.id) return;

    dispatch({type:"loading"});
    fetch(BASE_URL + "cities/" + id)
      .then((res) => res.json())
      .then((data) => {
        dispatch({type:"city/loaded", payload:data})
      })
      .catch(() => {
        dispatch({type:"rejected", payload:"there was an error loading the city..."})
      });
  }

  async function createCity(newCity) {
    dispatch({type:"loading"});
    fetch(BASE_URL + "cities", {
      method: "POST",
      body: JSON.stringify(newCity),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => dispatch({type:"city/created", payload:data}))
      .catch(() => dispatch({type:"rejected", payload:"there was an error POSTing the city..."}));
  }

  async function deleteCity(id) {
    dispatch({type:"loading"});
    fetch(BASE_URL + "cities/" + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      // eslint-disable-next-line no-unused-vars
      .then((data) => dispatch({type:"city/deleted", payload:id}))
      .catch(() => dispatch({type:"rejected", payload:"there was an error DELETing the city..."}));
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
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
