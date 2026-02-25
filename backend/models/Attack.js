const mongoose = require("mongoose");

const AttackSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    attackType: {
        type: String,
        default: "Normal"
    },
    severity: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low"
    },
    status: {
        type: String,
        enum: ["Attempt", "Successful"],
        default: "Attempt"
    },
    responseCode: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Attack", AttackSchema);