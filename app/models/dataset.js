var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var DatasetSchema = new Schema({
  file: { type: Schema.Types.ObjectId, ref: 'File' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  series: [{type: Schema.Types.ObjectId, ref: 'Series' }],
  meta: Schema.Types.Mixed
});

mongoose.model('Dataset', DatasetSchema);