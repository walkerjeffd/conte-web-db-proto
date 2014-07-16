var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crate = require('mongoose-crate')
  , LocalFS = require('mongoose-crate-localfs');

var FileSchema = new Schema({
  description: String,
  filename: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

FileSchema.plugin(crate, {
  storage: new LocalFS({
    directory: './files'
  }),
  fields: {
    file: {}
  }
});

mongoose.model('File', FileSchema);