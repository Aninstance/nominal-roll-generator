const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

mongoose.Promise = global.Promise;
const rollsDatabase = mongoose.createConnection('mongodb://sasoriginals:9SP*0sx@mongo:27017/db-nominal-roll');
const userDatabase = mongoose.createConnection('mongodb://keymaster:dHBJSPZW5as7isQjEaSUPqj7uPsE9WZ9gLJ@mongo:27017/User/ps?authSource=admin');

// create Soldier record schema
const SoldierRecordSchema = new Schema({
  soldier_surname: {
    type: String,
    required: [true, 'A name is required!'],
    index: true // define an index for this field
  },
  soldier_firstname: {
    type: String,
    required: [true, 'A name is required!']
  },
  soldier_middlenames: {
    type: [String],
    required: [false]
  },
  soldier_serial_number: {
    type: [Number],
    required: [false],
  },
  soldier_units: {
    type: [{
      unit: {
        _id: String,
        unit_name: String,
      },
      unit_period: [Date]
    }],
    required: [true, 'At least one unit is required']
  },
  kia: {
    type: String,
    required: [true, 'A KIA status is required']
  },
  kiaDate: {
    type: Date,
    required: [false]
  },
}).plugin(uniqueValidator);

// create military unit schema
const UnitSchema = new Schema({
  unit_name: {
    type: String,
    required: [true, 'A unit name is required!'],
    unique: [true, 'This unit name already exists!'],
    uniqueCaseInsensitive: true,
    index: true
  }
}).plugin(uniqueValidator);

// create user schema (for authentication)
const UserSchema = new Schema({
  fullName: {
    type: String,
    trim: true,
    required: [true, 'A name is required!'],
  },
  email: {
    type: String,
    unique: [true, 'This email is prohibited!'],
    uniqueCaseInsensitive: true,
    lowercase: true,
    trim: true,
    required: [true, 'An email is required!'],
    index: true,
  },
  role: {
    type: [String],
    required: [true, 'A user roll required!'],
    default: ['user']
  },
  hash_password: {
    type: String,
    required: [true, 'A password is required!']
  },
  created: {
    type: Date,
    default: Date.now
  },
  tokenCounter: {
    type: Number,
    default: 0
  },
  revokedTokens: {
    type: [String],
    required: [false]
  }
}).plugin(uniqueValidator)

// add method to compare submitted password to stored hash
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.hash_password)
}

// create models (these corresponds to collections (like sql tables) in mongodb)
SoldierRecords = rollsDatabase.model('records', SoldierRecordSchema);
MilitaryUnits = rollsDatabase.model('military-units', UnitSchema);
User = userDatabase.model('User', UserSchema);
module.exports = {
  SoldierRecords: SoldierRecords,
  MilitaryUnits: MilitaryUnits,
  User: User,
};
