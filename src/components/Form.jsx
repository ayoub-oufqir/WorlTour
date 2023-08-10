/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import { useUrlPosition } from "../hooks/useUrlPosition";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Form.module.css";
import Button from "./Button";
import ButtonBack from "./ButtonBack";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCitiesContext } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  // extract the lat and lng from the URL
  const [lat, lng] = useUrlPosition();

  const navigate = useNavigate();

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [geoCodingError, setGeoCodingError] = useState("");

  const {createCity, isLoading} = useCitiesContext();

  useEffect(() => {
    // form should be empty if we don't have lat and lng in the URL so we don't fire the request
    if (!lat && !lng) return;

    async function fetchCityData() {
      try {
        setIsLoadingGeoCoding(true);
        setGeoCodingError("");
        const res = await fetch(BASE_URL + `?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();

        // throw an error if we click on the sea
        if (!data.countryCode)
          throw new Error(
            "that doesn't seem to be a city, click somewhere else"
          );

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(data.countryCode);
        console.log(data);
      } catch (err) {
        setGeoCodingError(err.message);
        console.log(err);
      } finally {
        setIsLoadingGeoCoding(false);
      }
    }
    fetchCityData();
  }, [lat, lng]);

  // form submittion function
  async function handleSubmit(e) {
    e.preventDefault();
    if(!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position:{lat , lng},
    }
    await createCity(newCity);
    console.log(newCity);
    navigate("/app/cities")
  }

  // if we have no lat and lng show this msg instead of the form
  if (!lat && !lng)
    return <Message message={"start by clicking somewhere in the map"} />;

  if (geoCodingError) return <Message message={geoCodingError}>Thash</Message>;

  if (isLoadingGeoCoding) return <Spinner />;

  return (
    <form className={`${styles.form} ${isLoading? styles.loading : ''}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}

        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
