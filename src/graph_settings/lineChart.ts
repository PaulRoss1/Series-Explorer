export function generateLineChartData(lineRatingsData: any, theme: string) {
  let colors: {
    [key: string]: {
      gradientOne: string;
      gradientTwo: string;
      gradientThree: string;
      pointBackgroundColor: string;
      borderColor: string;
    };
  } = {
    dark: {
      gradientOne: "254, 132, 123",
      gradientTwo: "255, 0, 0",
      // gradientTwo: "254, 132, 123",
      gradientThree: "255, 0, 0",
      pointBackgroundColor: "#000",
      borderColor: "255, 99, 132",
    },
    light: {
      // gradientOne: "91, 82, 254",
      // gradientTwo: "0, 0, 255",
      // gradientThree: "0, 0, 255",
      // pointBackgroundColor: "#fff",
      // borderColor: "90, 122, 250",

      gradientOne: "254, 132, 123",
      gradientTwo: "255, 0, 0",
      // gradientTwo: "254, 132, 123",
      gradientThree: "255, 0, 0",
      pointBackgroundColor: "#000",
      borderColor: "255, 99, 132",
    },
  };

  return {
    labels: lineRatingsData.map((item: any) => {
      const formattedSeason = item.season.toString().padStart(2, "0");
      const formattedEpisode = item.episode.toString().padStart(2, "0");
      return `${item.title} (S${formattedSeason}E${formattedEpisode})`;
    }),
    datasets: [
      {
        label: "Episode Rating",
        data: lineRatingsData.map((item: any) => parseFloat(item.imdbRating)),
        pointBackgroundColor: `${colors[theme].pointBackgroundColor}`,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, `rgba(${colors[theme].gradientOne}, 0.3)`);
          gradient.addColorStop(0.5, `rgba(${colors[theme].gradientTwo}, 0.2)`);
          gradient.addColorStop(1, `rgba(${colors[theme].gradientThree}, 0)`);
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

export function generateLineChartOptions(theme: string) {
  let colors: {
    [key: string]: {
      gridColor: string;
    };
  } = {
    dark: {
      gridColor: "rgba(200, 200, 200, 0.08)",
    },
    light: {
      gridColor: "rgba(50, 49, 49, 0.3)",
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
          color: `${colors[theme].gridColor}`,
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
