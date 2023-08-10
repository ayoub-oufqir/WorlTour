import styles from "./CityList.module.css";
import PropTypes from "prop-types";
import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCitiesContext } from "../contexts/CitiesContext";

export default function CityList() {
  const { cities, isLoading } = useCitiesContext();
  if (isLoading) return <Spinner />;
  if(!cities.length) return <Message message={"add your first city by clicking on a city on the map "} />
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
          <CityItem key={city.cityName} city={city} />
      ))}
    </ul>
  );
}
CityList.propTypes = {
  cities: PropTypes.array,
  isLoading: PropTypes.bool,
};
