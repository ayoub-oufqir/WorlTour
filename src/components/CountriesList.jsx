// import { Link } from "react-router-dom";
import styles from "./CountriesList.module.css";
import PropTypes from "prop-types";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
import { useCitiesContext } from "../contexts/CitiesContext";

export default function CountriesList() {
  const { cities, isLoading } = useCitiesContext();

  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message
        message={"add your first country by clicking on a country on the map"}
      />
    );
  //   const countryArr = cities.map((el) => el.country);
//   here we want to get an array of non-duplicated countries and their emoji
  // const countries = cities.reduce((arr, city) => {
  //   if (!cities.map((el) => el.country).includes(city.country)) {
  //     return [...arr, { country: city.country, emoji: city.emoji }];
  //   } else {
  //     return arr;
  //   }
  // }, []);
  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);
  
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.countryName} country={country} />
      ))}
    </ul>
  );
}
CountriesList.propTypes = {
  cities: PropTypes.array,
  isLoading: PropTypes.bool,
};
