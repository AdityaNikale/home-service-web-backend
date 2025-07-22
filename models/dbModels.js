const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  city: { type: String, required: true },
  imageUrl: { type: String },
  price: {type: Number}
});

const RegisterModel = mongoose.model("registerInfo", RegisterSchema);
const ServiceModel = mongoose.model("serviceData", ServiceSchema);

module.exports = { RegisterModel, ServiceModel };
