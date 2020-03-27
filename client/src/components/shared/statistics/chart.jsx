import React from "react";
import { Bar, Chart } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
// Import helpers functions
import { numberOfAnswers } from "./helpers";

//////// View options //////////
const viewOptions = {
  responsive: true,
  title: {
    display: true,
    text: "Average pogingen per vraag"
  },
  tooltips: {
    filter: function(tooltipItem) {
      if (
        tooltipItem.label === "info vraag" ||
        tooltipItem.label === "hotspot vraag"
      ) {
        return false;
      }
      return true;
    }
  },
  legend: {
    position: "bottom",
    display: true,
    labels: {
      filter: function(label) {
        if (label.text === "rest") {
          return false;
        }
        return true;
      }
    }
  },
  hover: {
    mode: "nearest",
    intersect: true
  },
  scales: {
    xAxes: [
      {
        ticks: {
          padding: 20
        },
        maxBarThickness: 70,
        display: true,
        stacked: true,
        scaleLabel: {
          display: false,
          labelString: "Vragen"
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          padding: 10,
          callback: function(tick, index, ticksArray) {
            // return the string representation of the tick value. Return undefined to hide the grid line
            return Number.isInteger(tick) ? tick : undefined;
          }
        },
        display: true,
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: "Pogingen"
        }
      }
    ]
  },
  plugins: {
    datalabels: {
      display: true,
      color: "white",
      align: "center",
      anchor: "center",
      font: {
        weight: "bold"
      },
      ChartDataLabels
    }
  }
};

function chartData(data) {
  const cloud = new Image();
  cloud.src = "https://i.imgur.com/DIbr9q1.png";
  const slidesFilter = (item, index) => {
    item.questionName =
      item.__t === "multichoice_slide"
        ? "Vraag" + (index + 1)
        : item.__t === "info_slide"
        ? "info vraag"
        : "hotspot vraag";
    //return item.__t !== "info_slide" && item.__t === "multichoice_slide";
    return item;
  };

  const slides = data.filter(slidesFilter);
  const labels = slides.map(el => el.questionName);
  const datasets = {
    correctAttempts: [],
    wrongAttempts: [],
    theRest: []
  };

  slides.forEach((slide, i) => {
    const corrects = numberOfAnswers(
      slide.interactions || [],
      "CORRECT_ANSWERS"
    );
    const wrongs = numberOfAnswers(slide.interactions || [], "WRONG_ANSWERS");
    datasets.correctAttempts = [
      ...datasets.correctAttempts,
      slide.__t === "multichoice_slide" && corrects > 0 ? corrects : null
    ];
    datasets.wrongAttempts = [
      ...datasets.wrongAttempts,
      slide.__t === "multichoice_slide" && wrongs > 0 ? wrongs : null
    ];
    datasets.theRest = [
      ...datasets.theRest,
      slide.__t !== "multichoice_slide" ? 0 : null
    ];
    if (slide.__t !== "multichoice_slide") {
      Chart.pluginService.register({
        afterUpdate: function(chart) {
          if (chart.config.data) {
            if (chart.config.data.datasets[2]) {
              if (chart.config.data.datasets[2]._meta) {
                const chartMeta = chart.config.data.datasets[2]._meta;
                for (var key in chartMeta) {
                  if (chartMeta[key].data[i])
                    if (chartMeta[key].data[i]._model)
                      chartMeta[key].data[i]._model.pointStyle = cloud;
                  //chartMeta[key].data[i]._model.y = 300;
                }
              }
            }
          }
        }
      });
    }
  });

  return {
    labels,
    datasets: [
      {
        label: "Goed",
        backgroundColor: "#00695c",
        data: datasets.correctAttempts
      },
      {
        label: "Fout",
        backgroundColor: "#f50057",
        data: datasets.wrongAttempts
      },
      {
        label: "rest",
        type: "line",
        backgroundColor: "#f00",
        pointStyle: "image",
        data: datasets.theRest
      }
    ]
  };
}

export default function(props) {
  const barData = chartData(props.questions);
  return (
    <div style={{ width: "100%" }}>
      <Bar
        data={barData}
        options={viewOptions}
        // onElementsClick={elems => {
        //   console.log(elems[0]._datasetIndex + ", " + elems[0]._index);
        // }}
        getElementAtEvent={e => console.log(e)}
      />
    </div>
  );
}
