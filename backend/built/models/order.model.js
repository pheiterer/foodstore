"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = exports.OrderItemSchema = exports.LatLngSchema = void 0;
var mongoose_1 = require("mongoose");
var food_models_1 = require("./food.models");
var order_status_1 = require("../constants/order_status");
exports.LatLngSchema = new mongoose_1.Schema({
    lat: { type: String, required: true },
    lng: { type: String, required: true },
});
exports.OrderItemSchema = new mongoose_1.Schema({
    food: { type: food_models_1.FoodSchema, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
});
var orderSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    addressLatLng: { type: exports.LatLngSchema, required: true },
    items: { type: [exports.OrderItemSchema], required: true },
    totalPrice: { type: Number, required: true },
    paymentId: { type: String },
    status: { type: String, default: order_status_1.OrderStatus.NEW },
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});
exports.OrderModel = (0, mongoose_1.model)("Order", orderSchema);
