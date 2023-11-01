import { Episode } from "../api/interfaces";

export function generateLineChartData(
  lineRatingsData: Episode[],
  theme: string
) {
  let colors: {
    [key: string]: {
      gradientOne: string;
      gradientTwo: string;
      pointBackgroundColor: string;
      borderColor: string;
    };
  } = {
    dark: {
      gradientOne: "255, 90, 10",
      gradientTwo: "255, 90, 10",
      pointBackgroundColor: "#202040",
      borderColor: "255,90,10",
    },
    light: {
      gradientOne: "255, 90, 10",
      gradientTwo: "255, 90, 10",
      pointBackgroundColor: "#fff",
      borderColor: "255,90,10",
    },
  };

  return {
    labels: lineRatingsData.map((item: Episode) => {
      const formattedSeason = item.season.toString().padStart(2, "0");
      const formattedEpisode = item.episode.toString().padStart(2, "0");
      return `${item.title} (S${formattedSeason}E${formattedEpisode})`;
    }),
    datasets: [
      {
        label: "Episode Rating",
        data: lineRatingsData.map((item: Episode) =>
          parseFloat(item.imdbRating)
        ),
        pointBackgroundColor: `${colors[theme].pointBackgroundColor}`,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, `rgba(${colors[theme].gradientOne}, 0.25)`);
          gradient.addColorStop(1, `rgba(${colors[theme].gradientTwo}, 0)`);
          return gradient;
        },
        borderColor: `rgba(${colors[theme].borderColor}, 1)`,
        borderWidth: 2,
        cubicInterpolationMode: "monotone",
        fill: true,
        moreData: lineRatingsData,
      },
    ],
  };
}

export function generateLineChartOptions(
  theme: string,
  lineRatingsData: Episode[]
) {
  let colors: {
    [key: string]: {
      gridColor: string;
      firstEpisodeGridColor: string;
    };
  } = {
    dark: {
      gridColor: "rgba(200, 200, 200, 0.08)",
      firstEpisodeGridColor: "rgba(200, 200, 200, 0.4)",
    },
    light: {
      gridColor: "rgb(243,236,238)",
      firstEpisodeGridColor: "#C2BDBE",
    },
  };

  return {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          labelColor: function () {
            return {
              borderColor: "#000",
              backgroundColor: "#000",
              borderWidth: 0,
            };
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: (context: any) => {
            const labelIndex = context.tick && context.tick.value;
            const isFirstEpisode =
              labelIndex && lineRatingsData[labelIndex]?.episode === 1;

            return isFirstEpisode
              ? colors[theme].firstEpisodeGridColor
              : colors[theme].gridColor;
          },
          lineWidth: 1,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        grid: {
          color: `${colors[theme].gridColor}`,
          lineWidth: 1,
        },
        beginAtZero: true,
      },
    },
    point: {
      backgroundColor: "white",
    },
  };
}
