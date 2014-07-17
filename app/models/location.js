var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var LocationSchema = new Schema({
  name: String,
  description: String,
  state: String,
  latitude: Number,
  longitude: Number,
  user: {type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('Location', LocationSchema);