import React, { useState, useRef, useEffect } from "react";
import ReactSwitch from "react-switch";
import axios from "axios";
import { ShowData, ShowDataError, ThemeOptions } from "../api/interfaces";

const OMDB_API_URL = "https://www.omdbapi.com/";
const OMDB_API_KEY = "8ea4c4c5";

export interface SearchProps {
  setTheme: React.Dispatch<React.SetStateAction<ThemeOptions>>;
  setSearchedShow: React.Dispatch<React.SetStateAction<string>>;
  setInfoText: React.Dispatch<React.SetStateAction<string>>;
  setShowData: React.Dispatch<
    React.SetStateAction<ShowData | ShowDataError | null>
  >;
}

export default function Search({
  setTheme,
  setSearchedShow,
  setInfoText,
  setShowData,
}: SearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const suggestionsRef = useRef<HTMLInputElement | null>(null);

  const toggleTheme = () => {
    setTheme((current) =>
      current === ThemeOptions.Light ? ThemeOptions.Dark : ThemeOptions.Light
    );
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(OMDB_API_URL, {
          params: {
            apikey: OMDB_API_KEY,
            s: query,
            type: "series",
          },
        });

        const data = response.data;

        if (data.Search) {
          setSuggestions(
            data.Search.map(
              (item: { Title: string; Year: string }) =>
                `${item.Title} (${item.Year.split("–")[0]})`
            )
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleSuggestionClick = (item: string) => {
    setSuggestions([]);
    setSearchedShow(item.split("(")[0]);
  };

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === "Enter") {
      setSuggestions([]);
      setSearchedShow(query);
    }
  };

  const handleClickOutside = (event: { target: any }) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target)
    ) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogoClick = () => {
    setSearchedShow("");
    setShowData(null);
    setInfoText(
      "Track how your favorite TV show's ratings have evolved and uncover its best episodes by entering the name above."
    );
  };

  return (
    <div className="search">
      <img
        onClick={() => handleLogoClick()}
        className="search__logo"
        src="https://svgshare.com/getbyhash/sha1-3YuKJbuAYyH8Yn6dbSvIJcCiaxs="
      />

      <h1 onClick={() => handleLogoClick()} className="search__title">
        Series Explorer
      </h1>

      <ReactSwitch
        checked={true}
        onChange={toggleTheme}
        className="search__switch"
      />

      <div className="search__container">
        <div className="search__input-container">
          <input
            type="text"
            className="search__input"
            placeholder="Enter a TV show name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          {suggestions.length > 0 && (
            <div className="search__suggestions-box" ref={suggestionsRef}>
              <ul className="search__suggestions">
                {suggestions.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(item)}
                    className="search__suggestion"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <button
            className={
              query.length > 0 ? "search__button" : "search__button-disabled"
            }
            onClick={() => setSearchedShow(query)}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
