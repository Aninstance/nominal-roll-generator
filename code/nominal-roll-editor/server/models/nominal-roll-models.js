const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

mongoose.connect('mongodb://sasoriginals:9SP*0sx@mongo:27017/db-nominal-roll');
mongoose.Promise = global.Promise;

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
    type: [String],
    required: [false]
  },
  soldier_serial_number: {
    type: [Number],
    required: [false],
  },
  soldier_units: {
    type: [
      {
        unit:
          {
            _id: String,
            unit_name: String,
          },
        unit_period: [Date]
      }
    ],
    required: [true, 'At least one unit is required']
  },
  kia: {
    type: String,
    required: [true, 'A KIA status is required']
  },
}).plugin(uniqueValidator);

// create military unit schema
const UnitSchema = new Schema({
  unit_name: {
    type: String,
    required: [true, 'A unit name is required!'],
    unique: [true, 'This unit name already exists!'],
    uniqueCaseInsensitive: true
  }
}).plugin(uniqueValidator);


// create models (these corresponds to collections (like sql tables) in mongodb)
SoldierRecords = mongoose.model('records', SoldierRecordSchema);
MilitaryUnits = mongoose.model('military-units', UnitSchema);
module.exports = {
  SoldierRecords: SoldierRecords,
  MilitaryUnits: MilitaryUnits,
};
