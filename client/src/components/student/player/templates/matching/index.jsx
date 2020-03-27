import React, { useState } from "react";
// Components
import AudioMatchAnswer from "./answers/audio";
import ImageMatchAnswer from "./answers/image";
import TextMatchAnswer from "./answers/text";
// Services
import { contentTypes, bucketUrl } from "services/config";
// Helpers
import { getContentByType } from "./../utils/contentManagement";
// Drag'n'Drop list
import { Draggable, Droppable, DragDropContext } from "react-beautiful-dnd";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme =>
  createStyles({
    grid: {
      flex: 1,
      display: "grid",
      gridAutoFlow: "column",
      gridTemplateColumns: "1fr auto 1fr"
    }
  })
);

const Matching = ({ sets, setSets, ...props }) => {
  const classes = useStyles();

  const onDragEnd = result => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const newSet = [...sets.set2];
    newSet.splice(source.index, 1);
    newSet.splice(
      destination.index,
      0,
      sets.set2.find(item => item._id === draggableId)
    );
    setSets({ set1: sets.set1, set2: newSet });
  };

  const answerPicker = (answer, other, isDraggable, isDragging) => {
    switch (answer.type) {
      case contentTypes.AUDIO:
        return (
          <AudioMatchAnswer
            key={answer._id}
            slide={props.slide}
            audio={getContentByType(answer.items, contentTypes.AUDIO)}
            isDraggable={isDraggable}
            isDragging={isDragging}
            isCorrect={isDraggable ? answer._id === other._id : false}
          />
        );
      case contentTypes.IMAGE:
        const image = getContentByType(answer.items, contentTypes.IMAGE);
        const imageParts = image.value.split(".place");

        if (imageParts.length === 2) {
          return <TextMatchAnswer text={imageParts[0]} />;
        } else {
          return (
            <ImageMatchAnswer
              key={answer._id}
              slide={props.slide}
              image={image}
              isDraggable={isDraggable}
              isDragging={isDragging}
              isCorrect={isDraggable ? answer._id === other._id : false}
            />
          );
        }
      default:
        throw Error("Could not determine type of content for this answer");
    }
  };

  const [lastPlayedFile, setLastPlayedFile] = useState();
  const playAudio = answerId => {
    const tmp = sets.set2.find(item => item._id === answerId);
    if (tmp) {
      var audio = new Audio(`${bucketUrl}/${tmp.items[0].value}`);
      audio.play();
    }
  };

  return (
    <DragDropContext
      onDragStart={test => {
        playAudio(test.draggableId);
      }}
      onDragUpdate={test => {
        console.log(test);
      }}
      onDragEnd={result => onDragEnd(result)}
    >
      <Droppable droppableId="set2_column">
        {(dropProvided, dropSnapshot) => (
          <>
            <div {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
              <div
                className={classes.grid}
                style={{
                  gridTemplateRows: `repeat(${sets.set1.length}, 1fr)`
                }}
              >
                {sets.set1.length > 0 &&
                  sets.set1.map((answer, index) => {
                    return (
                      <div
                        key={`matchanswer_${index}`}
                        style={{ padding: "6px 0px" }}
                      >
                        {answerPicker(answer, sets.set2[index], false, false)}
                      </div>
                    );
                  })}
                {sets.set1.length > 0 &&
                  sets.set1.map((answer, index) => {
                    return (
                      <div
                        key={`equal_sign_${index}`}
                        style={{
                          display: "flex",
                          alignSelf: "center",
                          padding: "6px 12px"
                        }}
                      >
                        <p
                          style={{
                            fontSize: "2em",
                            fontWeight: 600,
                            color: "rgba(0,0,0,0.5)"
                          }}
                        >
                          {"="}
                        </p>
                      </div>
                    );
                  })}
                {sets.set2.length > 0 &&
                  sets.set2.map((answer, index) => {
                    return (
                      <Draggable
                        index={index}
                        key={`draggable_answer_${answer._id}`}
                        draggableId={answer._id}
                        isDragDisabled={!props.enableDnD}
                      >
                        {(dragProvided, dragSnapshot) => (
                          <div
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            ref={dragProvided.innerRef}
                            style={{
                              padding: "6px 0px",
                              ...dragProvided.draggableProps.style
                            }}
                            onClick={() => playAudio(answer._id)}
                          >
                            {answerPicker(
                              answer,
                              sets.set1[index],
                              true,
                              dragSnapshot.isDragging
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}

                {dropProvided.placeholder}
              </div>
            </div>
          </>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Matching;
