export function generateBarChartData(barRatingsData: any, theme: string) {
  let colors: {
    [key: string]: {
      gradientOne: string;
      gradientTwo: string;
      gradientThree: string;
      borderColor: string;
    };
  } = {
    dark: {
      gradientOne: "254, 94, 82",
      gradientTwo: "255, 0, 0",
      gradientThree: "255, 0, 0",
      borderColor: "255, 99, 132",
    },
    light: {
      gradientOne: "91, 82, 254",
      gradientTwo: "0, 0, 255",
      gradientThree: "0, 0, 255",
      borderColor: "90, 122, 250",
    },
  };

  const numLabels = Array.from(
    { length: barRatingsData.length },
    (_, index) => `#${index + 1}`
  );

  return {
    labels: numLabels,

    datasets: [
      {
        label: "Episode Rating",
        data: barRatingsData.map((item: any) => parseFloat(item.imdbRating)),
        pointBackgroundColor: "#fff",
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(1000, 0, 0, 0);
          gradient.addColorStop(0, `rgba(${colors[theme].gradientOne}, 0.5)`);
          gradient.addColorStop(
            0.5,
            `rgba(${colors[theme].gradientTwo}, 0.25)`
          );
          gradient.addColorStop(1, `rgba(${colors[theme].gradientThree}, 0)`);
          return gradient;
        },
        borderColor: `rgba(${colors[theme].borderColor}, 1)`,
        borderWidth: 1,
        moreData: barRatingsData,
      },
    ],
  };
}

export function generateBarChartOptions(theme: string) {
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
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        // enabled: false,
        // display: false,
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
      },
      y: {
        grid: {
          color: `${colors[theme].gridColor}`,
          lineWidth: 1,
        },
        ticks: {
          display: true,
        },
      },
    },
    point: {
      backgroundColor: "white",
    },
  };
}
