const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const InternalServiceIdentitySchema = new Schema({
  name: String,

  apiPrefix: String,

  description: String,

  clientCredential: {
    clientId: { type: String },
    clientSecret: { type: String },
  },

  internalPolicies: [
    {
      type: String,
      ref: 'InternalPolicy'
    }
  ],

  externalPolicies: [
    {
      type: String,
      ref: 'ExternalPolicy'
    }
  ],
});

module.exports = (db) => {
  if (!db.models.InternalServiceIdentity)
      return db.model('InternalServiceIdentity', InternalServiceIdentitySchema);
  return db.models.InternalServiceIdentity;
}
