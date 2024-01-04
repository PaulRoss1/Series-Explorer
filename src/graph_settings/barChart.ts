import { Episode } from "../types/types";

export function generateBarChartData(barRatingsData: Episode[], theme: string) {
  let colors: {
    [key: string]: {
      gradientOne: string;
      gradientTwo: string;
      borderColor: string;
    };
  } = {
    dark: {
      gradientOne: "255, 90, 10",
      gradientTwo: "255, 90, 10",
      borderColor: "255,90,10",
    },
    light: {
      gradientOne: "255, 90, 10",
      gradientTwo: "255, 90, 10",
      borderColor: "255,90,10",
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
        data: barRatingsData.map((item: Episode) =>
          parseFloat(item.imdbRating)
        ),
        pointBackgroundColor: "#fff",
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(1000, 0, 0, 0);
          gradient.addColorStop(0, `rgba(${colors[theme].gradientOne}, 0.25)`);
          gradient.addColorStop(1, `rgba(${colors[theme].gradientTwo}, 0)`);
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
      gridColor: "rgb(243,236,238)",
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
