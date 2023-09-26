import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import Chart, { ChartType, ChartTypeRegistry } from "chart.js/auto";
import ReactSwitch from "react-switch";
import {
  ShowData,
  ShowDataError,
  Episode,
  ExtraInfo,
  TypeOfChart,
} from "../api/interfaces";
import LoadingAnimation from "./LoadingAnimation";
import {
  generateLineChartData,
  generateLineChartOptions,
} from "../graph_settings/lineChart";
import {
  generateBarChartData,
  generateBarChartOptions,
} from "../graph_settings/barChart";

const OMDB_API_URL = "https://www.omdbapi.com/";
const OMDB_API_KEY = "8ea4c4c5";

export interface GraphProps {
  searchedShow: string;
  showData: ShowData | ShowDataError | null;
  setShowData: React.Dispatch<
    React.SetStateAction<ShowData | ShowDataError | null>
  >;
  theme: string;
  infoText: string;
  setInfoText: React.Dispatch<React.SetStateAction<string>>;
}

export default function Graph({
  searchedShow,
  showData,
  setShowData,
  theme,
  infoText,
  setInfoText,
}: GraphProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [chart, setChart] = useState<any>(null);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [chartType, setChartType] = useState<string>(TypeOfChart.Line);
  const [extraInfo, setExtraInfo] = useState<ExtraInfo | null>(null);
  const [lineRatingsData, setLineRatingsData] = useState<Episode[]>([]);

  const barRatingsData = [...lineRatingsData]
    .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating))
    .slice(0, 20);

  useEffect(() => {
    setIsLoading(true);
    const retrieveExtraInfo = async (id: string | undefined) => {
      let url = `https://www.omdbapi.com/?i=${id}&apikey=ed39c59`;

      try {
        const response = await axios.get(url);
        const data = response.data;

        setExtraInfo({
          image: data.Poster.replace("_V1_SX300.jpg", "_V1_SX500.jpg"),
          plot: data.Plot,
          released: data.Released,
          runtime: data.Runtime,
        });

        if (data.Error) {
          console.log("error");
        }
      } catch (error) {
        console.error(error);
      }
    };
    retrieveExtraInfo(episode?.id);
    setIsLoading(false);
  }, [episode]);

  useEffect(() => {
    chart && chart.destroy();
    const handleSearch = async () => {
      setInfoText("");

      setIsLoading(true);

      try {
        const response = await axios.get(OMDB_API_URL, {
          params: {
            apikey: OMDB_API_KEY,
            t: searchedShow,
            type: "series",
          },
        });

        if ("Error" in response.data) {
          setInfoText("xxx");
          setShowData(null);
          chart && chart.destroy();
          setIsLoading(false);
        } else {
          setShowData(response.data);
          chart && chart.destroy();
        }
      } catch (error) {
        console.error(error);
      }
    };
    searchedShow.length > 0 && handleSearch();
  }, [searchedShow]);

  useEffect(() => {
    const getRatingsData = async (showData: ShowData) => {
      let ratingsData = [];
      for (let i = 1; i <= Number(showData?.totalSeasons); i++) {
        const seasonData = await fetchSeasonData(showData.Title, i);

        for (let j = 0; j < seasonData.Episodes.length; j++) {
          const rating = seasonData.Episodes[j].imdbRating;
          if (rating === "N/A") {
            try {
              const avgRating =
                (parseFloat(seasonData.Episodes[j - 1].imdbRating) +
                  parseFloat(seasonData.Episodes[j + 1].imdbRating)) /
                2;

              ratingsData.push({
                title: seasonData.Episodes[j].Title,
                released: seasonData.Episodes[j].Released,
                imdbRating: Number(avgRating.toFixed(1)),
                id: seasonData.Episodes[j].imdbID,
                season: i,
                episode: j + 1,
              });
            } catch (error: any) {
              console.log(error.message);
            }
          } else {
            ratingsData.push({
              title: seasonData.Episodes[j].Title,
              released: seasonData.Episodes[j].Released,
              imdbRating: rating,
              id: seasonData.Episodes[j].imdbID,
              season: i,
              episode: j + 1,
            });
          }
        }
      }

      console.log("ratingsData: " + JSON.stringify(ratingsData));
      setLineRatingsData(ratingsData);
      setIsLoading(false);
    };

    const fetchSeasonData = async (title: string, season: number) => {
      const response = await axios.get(OMDB_API_URL, {
        params: {
          apikey: OMDB_API_KEY,
          t: title,
          Season: season,
        },
      });
      return response.data;
    };

    getRatingsData(showData as ShowData);
  }, [showData]);

  useEffect(() => {
    chart && chart.destroy();
    if (chartType === TypeOfChart.Line && lineRatingsData.length > 0) {
      const lineChartData = generateLineChartData(lineRatingsData, theme);
      const lineChartOptions = generateLineChartOptions(theme);

      renderChart(TypeOfChart.Line, lineChartData, lineChartOptions);
    } else if (chartType === TypeOfChart.Bar && barRatingsData.length > 0) {
      const barChartData = generateBarChartData(barRatingsData, theme);
      const barChartOptions = generateBarChartOptions(theme);

      renderChart(TypeOfChart.Bar, barChartData, barChartOptions);

      setEpisode(barRatingsData[0]);
    }
  }, [lineRatingsData, chartType, theme]);

  const renderChart = (
    chartType: keyof ChartTypeRegistry,
    chartData: any,
    chartOptions: any
  ) => {
    if (searchedShow.length > 0) {
      const canvas = document.getElementById("myChart") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");

      const hoverValue = {
        id: "hoverValue",

        afterDatasetDraw(chart: any) {
          const { data } = chart;
          let episodeData = data.datasets[0].moreData;

          try {
            setEpisode(episodeData[chart.getActiveElements()[0].index]);
          } catch (error) {
            // console.error("error");
          }
        },
      };
      if (ctx) {
        const newChart = new Chart(ctx, {
          type: chartType as ChartType,
          data: chartData,
          options: chartOptions,
          plugins: [hoverValue],
        });

        setChart(newChart);
      }
    }
  };

  return (
    <div className="graph">
      {isLoading && (
        <div className="graph__loading">
          <LoadingAnimation />
        </div>
      )}

      {/* {!showData && (
        <span className="graph__text">
          Track how your favorite TV show's ratings have evolved and uncover its
          best episodes by entering the name above.
        </span>
      )} */}

      <span className="graph__text">{infoText}</span>

      {chart && infoText.length === 0 && (
        <div className="graph__button-container">
          <button
            className={
              "graph__button-left" +
              (chartType === TypeOfChart.Bar ? "" : " graph__button-active")
            }
            onClick={() => setChartType(TypeOfChart.Line)}
          >
            Chart
          </button>
          <button
            className={
              "graph__button-right" +
              (chartType === TypeOfChart.Line ? "" : " graph__button-active")
            }
            onClick={() => setChartType(TypeOfChart.Bar)}
          >
            Top Episodes
          </button>
        </div>
      )}
      {chartType === TypeOfChart.Bar ? (
        <div className="graph__bar-container">
          <canvas className="graph__bar" id="myChart"></canvas>

          {!isLoading && infoText.length === 0 && (
            <div className="graph__info">
              <div className="graph__image-container">
                <img className="graph__image" src={extraInfo?.image} />
              </div>
              <br />
              <span className="graph__info-title">
                {episode?.title}{" "}
                <span className="graph__info-year">
                  {"(S" +
                    episode?.season?.toString().padStart(2, "0") +
                    "E" +
                    episode?.episode?.toString().padStart(2, "0") +
                    ")"}
                </span>
              </span>
              <br />
              <span>
                {episode?.imdbRating}{" "}
                <span className="graph__info-star">★</span>
              </span>
              <br></br>
              <span>{extraInfo?.runtime}</span>
              <br />
              <span>Episode aired {extraInfo?.released}</span>
              <br />
              <span className="graph__info-plot">{extraInfo?.plot}</span>
              <br />
            </div>
          )}
        </div>
      ) : (
        <canvas className="graph__line" id="myChart"></canvas>
      )}
    </div>
  );
}
