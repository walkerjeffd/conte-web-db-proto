var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var VariableSchema = new Schema({
  name: String,
  units: String
});

mongoose.model('Variable', VariableSchema);