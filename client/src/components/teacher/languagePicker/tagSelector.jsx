import React, { Component } from "react";
import update from "immutability-helper";
//Components
import Tag from "./tag";
import languages from "./../../../services/language";

class TagSelector extends Component {
  state = {
    //chosen: [],
    languageChoices: languages,
    selection: languages[0]
  };

  selectionChangeHandler(event) {
    var index = event.nativeEvent.target.selectedIndex;
    this.setState(
      update(this.state, {
        selection: {
          $set: {
            id: event.target[index].value,
            name: event.target[index].text,
            selected: false
          }
        }
      })
    );
  }

  addClickHandler() {
    const languageIndex = this.state.languageChoices.findIndex(
      obj => obj.name === this.state.selection.name
    );

    this.setState(
      update(this.state, {
        /* chosen: {
          $push: [this.state.languageSelected]
        },*/

        // languageChoices: { $splice: [[languageIndex, 1]] }
        languageChoices: { [languageIndex]: { selected: { $set: true } } }
        //  selection: { $set: this.state.languageChoices[0] }
      })
    );
  }

  removeClickHandler(event) {
    event.preventDefault();

    const languageIndex = this.state.languageChoices.findIndex(
      obj => obj.name === event.currentTarget.name
    );
    this.setState(
      update(this.state, {
        // languageChoices: { $push: [this.state.chosen[languageIndex]] },
        // chosen: { $splice: [[languageIndex, 1]] },
        languageChoices: { [languageIndex]: { selected: { $set: false } } }
      })
    );
  }

  render() {
    return (
      <div className="container">
        <div className="input-group p-2">
          {this.state.languageChoices.map(choice =>
            choice.selected ? (
              <Tag
                key={choice.id}
                name={choice.name}
                id={choice.id}
                onRemoveClick={event => {
                  this.removeClickHandler(event);
                }}
              />
            ) : (
              ""
            )
          )}{" "}
        </div>
        <div className="input-group">
          <select
            name="languagePickerName"
            id="languagePickerId"
            className="custom-select m-2"
            onChange={event => {
              this.selectionChangeHandler(event);
            }}
          >
            {this.state.languageChoices.map(option => (
              <option
                key={option.id}
                value={option.id}
                disabled={option.selected}
              >
                {option.name}
              </option>
            ))}
          </select>

          <button
            name="add"
            type="button"
            className="btn btn-primary m-2"
            onClick={event => {
              this.addClickHandler(event);
            }}
          >
            <i className="fas fa-plus-square" /> Voeg toe
          </button>
        </div>
      </div>
    );
  }
}

export default TagSelector;
