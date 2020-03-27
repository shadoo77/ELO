const XLSX = require("xlsx");
const fs = require("fs");
const mongoose = require("mongoose");
// Services
const { contentTypes } = require("../../services/config");

// Write errors to a text file instead of log to console
//const trueLog = console.log;
function appendErrorsToTextFile(errorMssg, errPlace) {
  if (!fs.existsSync("./tmp")) {
    fs.mkdirSync("./tmp");
  }
  const errTxt = errPlace
    ? `- ${errPlace} : ${errorMssg}\n`
    : `- ${errorMssg}\n`;
  fs.appendFile("./tmp/log.log", errTxt, err => {
    if (err) {
      return console.log(err);
    }
  });
}

// Read CSV file function to return the data of this file
function readXlxsFile(xlsxFile) {
  // Return promise
  return new Promise(async (resolve, reject) => {
    // Read file
    try {
      const deleteFile = file => {
        fs.unlink(file, err => {
          if (err) throw err;
        });
      };

      setTimeout(() => {
        deleteFile(xlsxFile);
      }, 30 * 6000);

      /// loop throw the data &&&&&&&&&&&&&&&&&&
      const workbook = XLSX.readFile(xlsxFile);
      const sheet_name_list = workbook.SheetNames;
      let results = [];
      sheet_name_list.forEach(sheet => {
        const sheetElements = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        results = [...results, ...sheetElements];
      });
      resolve(results);
    } catch (err) {
      reject(err);
    }
  });
}

// // This function returns a unique value (unrepeated) from array of objects
function getUniqueKeysNames(fileContent, propKey) {
  const allKeys = fileContent
    .filter(row => row[`${propKey}`])
    .map(row => row[`${propKey}`]);
  return allKeys.filter((item, index) => {
    return allKeys.indexOf(item) === index;
  });
}

// Get answers in object of arrays (e.g: answer1: ["antwoord_1_image", "antwoord_1_audio"])
function objectOfAnswers(answersCount, answers) {
  const answersObject = {};
  for (let i = 1; i <= answersCount; i++) {
    answersObject[`answer${i}`] = [];
    answers.forEach(answer => {
      const ansNr = answer.split("_")[1];
      if (i === Number(ansNr)) {
        answersObject[`answer${i}`] = [...answersObject[`answer${i}`], answer];
      }
    });
  }
  return answersObject;
}

// Get content type
function getContentTypeOfAnswer(item) {
  let contentType;
  if (Array.isArray(item)) {
    if (item.length > 1) {
      const isCover =
        item.some(el => el.includes("image")) &&
        item.some(el => el.includes("audio"));
      const isImage = item.some(el => el.includes("image"));
      const isAudio = item.some(el => el.includes("audio"));
      contentType = isCover
        ? contentTypes.AUDIOCOVER
        : isImage
        ? contentTypes.IMAGE
        : isAudio && contentTypes.AUDIO;
    } else {
      contentType = item[0].includes("audio")
        ? contentTypes.AUDIO
        : item[0].includes("video")
        ? contentTypes.VIDEO
        : item[0].includes("image")
        ? contentTypes.IMAGE
        : item[0].includes("text")
        ? contentTypes.TEXT
        : contentTypes.QUOTE;
    }
  } else {
    contentType = item.includes("image")
      ? contentTypes.IMAGE
      : item.includes("audio")
      ? contentTypes.AUDIO
      : item.includes("video")
      ? contentTypes.VIDEO
      : item.includes("text")
      ? contentTypes.TEXT
      : contentTypes.QUOTE;
  }
  return contentType;
}

function getAnswerId(correctAnswers, correctKey) {
  const correctAnswer = correctAnswers.find(el => el.answersNr === correctKey);
  return correctAnswer.answerId;
}

// Generating possible answers
function genPossibleAnswers(question, correctAnswers) {
  const answers = Object.keys(question).filter(
    el => el.startsWith("antwoord") && !el.endsWith("descr")
  );
  console.log("====== Answers ====== ", answers);
  const answersCount = answers[answers.length - 1].split("_")[1];
  const answersObject = objectOfAnswers(answersCount, answers);
  let possibleAnswers = [];
  for (const key in answersObject) {
    if (answersObject[key].length) {
      let correctKey = key
        .split("answer")
        .pop()
        .toString();
      const possibleAnswer = {
        _id: correctAnswers.some(el => el.answersNr === correctKey)
          ? getAnswerId(correctAnswers, correctKey)
          : mongoose.Types.ObjectId(),
        type: getContentTypeOfAnswer(answersObject[key]),
        items: answersObject[key].map(el => ({
          _id: mongoose.Types.ObjectId(),
          type: getContentTypeOfAnswer(el),
          value: question[el]
        }))
      };
      possibleAnswers.push(possibleAnswer);
    }
  }

  return possibleAnswers;
}

function getContentTypeOfAnswers(arr) {
  let isImage = arr.filter(item => item.type === contentTypes.IMAGE).length > 0;
  let isAudio = arr.filter(item => item.type === contentTypes.AUDIO).length > 0;
  return isImage === true && isAudio === true
    ? contentTypes.AUDIOCOVER
    : isImage === true && isAudio === false
    ? contentTypes.IMAGE
    : isAudio === true && isImage === false
    ? contentTypes.AUDIO
    : contentTypes.VIDEO;
}

function genMatchingAnswer(question, answersObject, key) {
  let items = [];
  answersObject[key].map(el => {
    let str = question[el];
    const splitted = str.match(/(\S+)(\s?\,\s?)(\S+)/);
    const tested = str.match(/^([0-9])\.place\s?$/);

    if (splitted !== null && splitted.length >= 4) {
      items.push({
        _id: mongoose.Types.ObjectId(),
        type: getContentTypeOfAnswer(el),
        value: splitted[1]
      });
      items.push({
        _id: mongoose.Types.ObjectId(),
        type: getContentTypeOfAnswer(el),
        value: splitted[3]
      });
    } else if (tested !== null && tested.length === 2) {
      const t = getContentTypeOfAnswer(el);
      items.push({
        _id: mongoose.Types.ObjectId(),
        type: getContentTypeOfAnswer(el),
        value: tested[0]
      });
    } else {
      items.push({
        _id: mongoose.Types.ObjectId(),
        type: getContentTypeOfAnswer(el),
        value: question[el]
      });
    }
  });

  return {
    _id: mongoose.Types.ObjectId(),
    type: getContentTypeOfAnswers(items),
    items: items
  };
}

// Generating possible answers
function genMatchingAnswers(question) {
  const answers = Object.keys(question).filter(
    el => el.startsWith("antwoord") && !el.endsWith("descr")
  );
  const answersCount = answers[answers.length - 1].split("_")[1];
  const answersObject = objectOfAnswers(answersCount, answers);
  let possibleAnswers = [];

  for (const key in answersObject) {
    if (answersObject[key].length) {
      const possibleAnswer = genMatchingAnswer(question, answersObject, key);

      if (possibleAnswer) {
        possibleAnswers.push(possibleAnswer);
      }
    }
  }

  return possibleAnswers;
}

// Get content type
function getContentTypeOfContent(contents) {
  let contentType;
  if (Array.isArray(contents) && contents.length) {
    if (contents.length > 1) {
      const isCover =
        contents.some(el => el.includes("image")) &&
        contents.some(el => el.includes("audio"));
      contentType = isCover && contentTypes.AUDIOCOVER;
    } else {
      contentType = contents[0].includes("image")
        ? contentTypes.IMAGE
        : contents[0].includes("audio")
        ? contentTypes.AUDIO
        : contents[0].includes("video")
        ? contentTypes.VIDEO
        : contents[0].includes("text")
        ? contentTypes.TEXT
        : contentTypes.QUOTE;
    }
  } else {
    contentType = contents.includes("image")
      ? contentTypes.IMAGE
      : contents.includes("audio")
      ? contentTypes.AUDIO
      : contents.includes("video")
      ? contentTypes.VIDEO
      : contents.includes("text")
      ? contentTypes.TEXT
      : contentTypes.QUOTE;
  }
  return contentType;
}

// Generating contents for MuliChoice slide
function genContents(question) {
  const contentsKeys = Object.keys(question).filter(
    el => el.startsWith("content") && !el.endsWith("descr")
  );
  if (!contentsKeys.length) {
    return [];
  }
  const contentType = getContentTypeOfContent(contentsKeys);
  const contentItem = {
    _id: mongoose.Types.ObjectId(),
    type: contentType,
    items: []
  };
  if (contentsKeys.length) {
    contentItem.items = contentsKeys.map(el => {
      const description =
        getContentTypeOfContent(el) === contentTypes.AUDIO
          ? question.content_audio_descr
          : "";
      return {
        _id: mongoose.Types.ObjectId(),
        type: getContentTypeOfContent(el),
        value: question[el],
        description
      };
    });
  }
  return [contentItem];
}

function genInstrucions(question) {
  const instrAudio = question.vraag_audio;
  const instrAudioDescr = question.vraag_audio_descr;
  if (!instrAudio) return [];
  return [
    {
      _id: mongoose.Types.ObjectId(),
      type: contentTypes.AUDIO,
      items: [
        {
          type: contentTypes.AUDIO,
          value: instrAudio,
          description: instrAudioDescr || ""
        }
      ]
    }
  ];
}

module.exports = {
  appendErrorsToTextFile,
  readXlxsFile,
  getUniqueKeysNames,
  genPossibleAnswers,
  genMatchingAnswers,
  genContents,
  genInstrucions
};
