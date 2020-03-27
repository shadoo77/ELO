import React from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

//////// View options //////////
const viewOptions = {
  responsive: true,
  title: {
    display: false,
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
    display: false,
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

export default ({ data }) => {
  return (
    <div style={{ width: "100%" }}>
      <Bar
        data={data}
        options={viewOptions}
        // onElementsClick={elems => {
        //   console.log(elems[0]._datasetIndex + ", " + elems[0]._index);
        // }}
        getElementAtEvent={e => console.log(e)}
      />
    </div>
  );
};
