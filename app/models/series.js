var _ = require('lodash')
  , moment = require('moment')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Measurement = new Schema({
  datetime: Date,
  value: Number
});

var SeriesSchema = new Schema({
  dataset: { type: Schema.Types.ObjectId, ref: 'Dataset' },
  values: [Measurement],
  variable: {type: Schema.Types.ObjectId, ref: 'Variable', required: true},
  location: {type: Schema.Types.ObjectId, ref: 'Location', required: true }
}, {
  collection: 'series'
});

SeriesSchema.virtual('name').get(function () {
  return '<' + this.variable.name + ' @ ' + this.location.name + '>';
})

SeriesSchema.virtual('datespan').get(function() {
  if (this.values.length === 0) {
    return 'NO DATA';
  }
  var minDate = _.min(this.values, 'datetime').datetime
    , maxDate = _.max(this.values, 'datetime').datetime

  var spanString = moment.utc(minDate).format('YYYY-MM-DD') + ' - ' + moment.utc(maxDate).format('YYYY-MM-DD')

  return spanString;
})

mongoose.model('Series', SeriesSchema);