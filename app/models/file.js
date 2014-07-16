var mongoose = require('mongoose')
  , crate = require('mongoose-crate')
  , LocalFS = require('mongoose-crate-localfs');

var FileSchema = new mongoose.Schema({
  description: String,
  filename: String
});

FileSchema.plugin(crate, {
  storage: new LocalFS({
    directory: './files'
  }),
  fields: {
    file: {}
  }
});

module.exports = mongoose.model('File', FileSchema);