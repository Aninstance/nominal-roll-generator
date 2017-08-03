const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');


// create Soldier record schema
const SoldierRecordSchema = new Schema({
  soldier_surname: {
    type: String,
    required: [true, 'A name is required!']
  },
  soldier_firstname: {
    type: String,
    required: [true, 'A name is required!']
  },
  soldier_middlenames: {
    type: Array,
    required: [true, 'A middle name array is required, even if empty!']
  },
  soldier_serial_number: {
    type: Array,
    required: [false],
  },
  soldier_units: {
    type: Array,
    required: [true, 'At least one unit is required']
  },
  kia: {
    type: String,
    required: [false]
  },
}).plugin(uniqueValidator);

// create military unit schema
const UnitSchema = new Schema({
  unit_display_name: {
    type: String,
    required: [true, 'A descriptive name is required!']
  },
  unit_name: {
    type: String,
    required: [true, 'A unit name is required!'],
    unique: false,
    //uniqueCaseInsensitive: true
  },
  unit_period: {
    type: Date,
    required: [false],
    unique: false
  }
}).plugin(uniqueValidator);

// create models (these corresponds to collections (like sql tables) in mongodb)
SoldierRecords = mongoose.model('soldier-records', SoldierRecordSchema);
MilitaryUnits = mongoose.model('military-units', UnitSchema);
module.exports = {
  SoldierRecords: SoldierRecords,
  MilitaryUnits: MilitaryUnits
};
