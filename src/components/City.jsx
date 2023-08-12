/* eslint-disable no-unused-vars */
// import styles from "./City.module.css";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useCitiesContext } from "../contexts/CitiesContext";
import styles from "./City.module.css";
import Spinner from "./Spinner";
import ButtonBack from "./ButtonBack";
const BASE_URL = "http://localhost:8000/";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  const { currentCity, getCity, isLoading } = useCitiesContext();
  const { id } = useParams();
  // const [searchParams, setSearchParams] = useSearchParams();
  // const lat = searchParams.get('lat');
  // const lng = searchParams.get('lng');

  useEffect(() => {
    getCity(id);
  }, [id, getCity]);
  
  console.log(id);

  if (isLoading) return <Spinner />;

  const { cityName, emoji, date, notes } = currentCity;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <ButtonBack />
      </div>
    </div>
  );
}

export default City;
