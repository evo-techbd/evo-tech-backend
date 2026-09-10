"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const settings_model_1 = require("./settings.model");
const DEFAULT_DELIVERY_CHARGE_SETTINGS = {
    insideDhakaCharge: 70,
    outsideDhakaCharge: 120,
    additionalChargePerKg: 20,
    expressInsideDhakaCharge: 150,
    expressOutsideDhakaCharge: 250,
};
// Delivery charge is a singleton document - create it with defaults on first read
const getDeliveryChargeSettingsFromDB = async () => {
    let settings = await settings_model_1.DeliveryChargeSettings.findOne();
    if (!settings) {
        settings = await settings_model_1.DeliveryChargeSettings.create(DEFAULT_DELIVERY_CHARGE_SETTINGS);
    }
    return settings;
};
const updateDeliveryChargeSettingsIntoDB = async (payload) => {
    const settings = await settings_model_1.DeliveryChargeSettings.findOne();
    if (!settings) {
        return settings_model_1.DeliveryChargeSettings.create({
            ...DEFAULT_DELIVERY_CHARGE_SETTINGS,
            ...payload,
        });
    }
    Object.assign(settings, payload);
    await settings.save();
    return settings;
};
exports.SettingsService = {
    getDeliveryChargeSettingsFromDB,
    updateDeliveryChargeSettingsIntoDB,
};
//# sourceMappingURL=settings.service.js.map