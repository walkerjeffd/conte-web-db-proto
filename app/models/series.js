var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Measurement = new Schema({
  datetime: Date,
  value: Number
});

var SeriesSchema = new Schema({
  dataset: { type: Schema.Types.ObjectId, ref: 'Dataset' },
  values: [Measurement],
  variable: {type: Schema.Types.ObjectId, ref: 'Variable' },
  location: {type: Schema.Types.ObjectId, ref: 'Location' }
}, {
  collection: 'series'
});

mongoose.model('Series', SeriesSchema);