const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MpathPlugin = require("mongoose-mpath");
const { tagLevels } = require("../services/config");
const colorValidator = str => /^#([0-9a-f]{3}){1,2}$/i.test(str);

const tagSchema = new Schema({
  type: {
    // Use values from tagTypes in config.js
    // DEPRECATED: USE DISCRIMINATOR
    type: Number,
    required: true
  },
  difficulty: {
    // Use values from difficultyTypes in config.js e.g : BEGINNER, INTERMEDIATE or ADVANCED
    type: Number,
    required: true
  },
  value: {
    // Value of tag to display to user, e.g. "thema", "luisteren", etc.
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: false,
    default: ""
  },
  color: {
    type: String,
    validator: [colorValidator, "Invalid color"],
    default: "#000000",
    required: true
  },
  root: {
    type: Schema.Types.ObjectId,
    ref: "tag",
    required: false
  },
  order: {
    type: Number,
    required: false
  },
  bridgeId: {
    type: Schema.Types.ObjectId,
    required: false
  }
});

/**
 * Plugin that adds parent and path fields to schema (DO NOT ADD THEM YOURSELF!)
 * Also gives access to nice methods for generating and recursively navigating
 * through a tree hierarchy
 */
tagSchema.plugin(MpathPlugin);

/**
 * Prevent duplicate tag values per container tag.
 */
tagSchema.index({ parent: 1, value: 1, difficulty: 1 }, { unique: true });

// Export
const Tag = mongoose.model("tag", tagSchema);

// Theme tag
var PublicationSchema = new Schema({});
const Publication = Tag.discriminator(tagLevels.PUBLICATION, PublicationSchema);

// Theme tag
var ThemeSchema = new Schema({});
const Theme = Tag.discriminator(tagLevels.THEME, ThemeSchema);

// Paragraph tag
var ParagraphSchema = new Schema({});
const Paragraph = Tag.discriminator(tagLevels.PARAGRAPH, ParagraphSchema);

// Assignment tag
var AssignmentSchema = new Schema({
  slides: [{ type: Schema.Types.ObjectId, ref: "slide" }],
  shuffle: { type: Boolean, default: false }
});

const Assignment = Tag.discriminator(tagLevels.ASSIGNMENT, AssignmentSchema);

module.exports = { Tag, Publication, Theme, Paragraph, Assignment };
