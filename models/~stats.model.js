// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// // const assignmentSchema = new Schema({
// //   _id: false,
// //   tag: { type: Schema.Types.ObjectId, ref: "tag" }, // Slideshow._id
// //   correct: { type: Number },
// //   wrong: { type: Number },
// //   attempts: { type: Number }
// // });

// // const paragraphSchema = new Schema({
// //   _id: false,
// //   tag: { type: Schema.Types.ObjectId, ref: "tag" }, // Paragraph._id
// //   correct: { type: Number },
// //   wrong: { type: Number },
// //   attempts: { type: Number },
// //   difficulty: { type: Number, required: true },
// //   difficultyBridge: { type: Schema.Types.ObjectId, required: true },
// //   children: [assignmentSchema]
// // });

// // const themeSchema = new Schema({
// //   _id: false,
// //   tag: { type: Schema.Types.ObjectId, ref: "tag" }, // Thema._id
// //   correct: { type: Number },
// //   wrong: { type: Number },
// //   attempts: { type: Number },
// //   children: [paragraphSchema]
// // });

// // const pubSchema = new Schema({
// //   tag: { type: Schema.Types.ObjectId, ref: "tag" },
// //   user: {
// //     type: Schema.Types.ObjectId,
// //     ref: "account"
// //   },
// //   tag: { type: Schema.Types.ObjectId, ref: "tag" }, // Publication._id
// //   children: [themeSchema]
// // });

// // const StatsModel = mongoose.model("statistics", pubSchema);

// const publicationProgressSchema = new Schema({
//   user: {
//     type: Schema.Types.ObjectId,
//     ref: "account"
//   },
//   themes: [{ type: Schema.Types.ObjectId, ref: "tag" }],

// });

// const pubProgress = mongoose.model("progress", publicationProgressSchema);

// const themeProgressSchema = new Schema({
//   parent:
//   user: {
//     type: Schema.Types.ObjectId,
//     ref: "account"
//   },
//   themes: [{ type: Schema.Types.ObjectId, ref: "tag" }],
//   paragraphs: [{ type: Schema.Types.ObjectId, ref: "tag" }],
//   assignments: [{ type: Schema.Types.ObjectId, ref: "tag" }]
// });

// const themeProgress = mongoose.model("statistics", themeProgressSchema);

// module.exports = {
//   StatsModel
// };
