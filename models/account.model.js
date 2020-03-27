const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Client = require("./client.model");

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  // TODO: Add array of publications the account has access to (activated subscriptions)
  name: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    required: true
  },
  isActivated: {
    type: Boolean,
    required: true,
    default: false
  },
  account: {
    username: {
      type: String,
      required: true,
      index: {
        unique: true
      }
    },
    email: {
      type: String
    },
    password: {
      type: String,
      required: true
    }
  },
  unlocked: [
    // Teacher can overwrite default behavior by pushing slideshows to
    // this array and restrict access to the rest that aren't unlocked
    {
      type: Schema.Types.ObjectId,
      ref: "slideshow"
    }
  ]
});

accountSchema.methods.generateAuthToken = function(
  client_ip,
  sessionStart,
  username = undefined
) {
  try {
    if (username === undefined) {
      username = this.account.username;
    }
    const token = jwt.sign(
      {
        _id: this._id,
        name: this.name,
        role: this.role,
        account: this.account,
        sessionStart
      },
      "SomeSecretKey",
      { expiresIn: "999m" }
    );

    Client.findOne({
      client: this._id
    })
      .then((result) => {
        if (result) {
          // Update Client's session time
          result.sessionStart = sessionStart;
          result.save((err) => {
            if (err) {
              console.log(err);
            }
          });
        } else {
          // Start new session for Client
          new Client({
            client: this._id,
            ip: client_ip,
            sessionStart
          }).save((err) => {
            if (err) {
              console.log(err);
            }
          });
        }
      })
      .catch((err) => console.log(err));

    return "Bearer " + token;
  } catch (ex) {
    return ex;
  }
};

const Account = mongoose.model("account", accountSchema);
module.exports = Account;
