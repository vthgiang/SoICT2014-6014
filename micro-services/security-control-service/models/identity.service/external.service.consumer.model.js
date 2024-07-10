const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ExternalServiceConsumerSchema = new Schema ({
  name: String,

  portal: String,

  description: String,

  clientCredential: {
    clientId: String,
    clientSecret: String,
  },
  
  attributes: Object
});

ExternalServiceConsumerSchema.plugin(mongoosePaginate);

module.exports = (db) => {
  if (!db.models.ExternalServiceConsumer)
      return db.model('ExternalServiceConsumer', ExternalServiceConsumerSchema);
  return db.models.ExternalServiceConsumer;
}
