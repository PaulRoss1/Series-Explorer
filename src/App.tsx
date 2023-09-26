import React, { useState } from "react";
import "./App.scss";
import "./themes/light-theme.scss";
import "./themes/dark-theme.scss";
import Search from "./components/Search";
import ShowInfo from "./components/ShowInfo";
import Graph from "./components/Graph";
import { ShowData, ShowDataError, ThemeOptions } from "./api/interfaces";

export default function App() {
  const [theme, setTheme] = useState(ThemeOptions.Dark);
  const [showData, setShowData] = useState<ShowData | ShowDataError | null>(
    null
  );
  const [searchedShow, setSearchedShow] = useState("");
  const [infoText, setInfoText] = useState<string>(
    "Track how your favorite TV show's ratings have evolved and uncover its best episodes by entering the name above."
  );

  const searchProps = {
    setTheme,
    setSearchedShow,
    setShowData,
    setInfoText,
  };

  const showInfoProps = {
    showData,
  };

  const graphProps = {
    searchedShow,
    showData,
    setShowData,
    theme,
    infoText,
    setInfoText,
  };

  return (
    <div className="App" id={theme}>
      <Search {...searchProps} />

      <div className="content-wrapper">
        <ShowInfo {...showInfoProps} />

        <Graph {...graphProps} />
      </div>
    </div>
  );
}
