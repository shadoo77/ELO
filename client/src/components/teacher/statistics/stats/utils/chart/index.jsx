import React from "react";
import { Chart } from "react-chartjs-2";
// Import helpers functions
import { numberOfAnswers } from "../../../helpers";
// Import Components
import HorizontalChart from "./HorizontalChart";
import VerticalChart from "./VerticalChart";
// Services
import { slideTypes } from "services/config";
// Material ui
import { useMediaQuery } from "@material-ui/core";

function chartData(data) {
  const cloud = new Image();
  cloud.src = "https://i.imgur.com/DIbr9q1.png";

  const slidesFilter = (item, index) => {
    item.questionName =
      item.__t === slideTypes.INFO ? "info vraag" : "Vraag" + (index + 1);
    return item;
  };

  const slides = data.filter(slidesFilter);
  const labels = slides.map((el) => el.questionName);
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
      slide.__t === slideTypes.MULTICHOICE && corrects > 0 ? corrects : null
    ];
    datasets.wrongAttempts = [
      ...datasets.wrongAttempts,
      slide.__t === slideTypes.MULTICHOICE && wrongs > 0 ? wrongs : null
    ];
    datasets.theRest = [
      ...datasets.theRest,
      slide.__t !== slideTypes.MULTICHOICE ? 0 : null
    ];
    if (slide.__t !== slideTypes.MULTICHOICE) {
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
  const mobileMode = useMediaQuery("(max-width:600px)");
  //const matches = useMediaQuery(theme => theme.breakpoints.up("xs"));
  const barData = chartData(props.questions);

  return (
    <div style={{ width: "100%" }}>
      {mobileMode ? (
        // <HorizontalChart data={barData} />
        <VerticalChart data={barData} />
      ) : (
        <VerticalChart data={barData} />
      )}
    </div>
  );
}
