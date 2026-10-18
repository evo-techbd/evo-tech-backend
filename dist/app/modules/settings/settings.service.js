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
const DEFAULT_CONTACT_SETTINGS = {
    email: "evotech.bd22@gmail.com",
    phones: ["+880 1799 424854", "+880 1761 490093"],
    whatsapp: "+880 1799 424854",
    address: "72/A, Matikata Bazar, Dhaka Cantonment, Dhaka-1206, Bangladesh",
    businessHours: "Saturday – Thursday: 10:00 AM – 7:00 PM\nFriday: Closed\nPublic holidays: By appointment",
    mapUrl: "",
    facebook: "https://www.facebook.com/EvoTechBD22",
    instagram: "",
    linkedin: "",
    youtube: "",
};
// Contact info is a singleton document - create it with defaults on first read
const getContactSettingsFromDB = async () => {
    let settings = await settings_model_1.ContactSettings.findOne();
    if (!settings) {
        settings = await settings_model_1.ContactSettings.create(DEFAULT_CONTACT_SETTINGS);
    }
    return settings;
};
const updateContactSettingsIntoDB = async (payload) => {
    const settings = await getContactSettingsFromDB();
    Object.assign(settings, payload);
    await settings.save();
    return settings;
};
exports.SettingsService = {
    getDeliveryChargeSettingsFromDB,
    updateDeliveryChargeSettingsIntoDB,
    getContactSettingsFromDB,
    updateContactSettingsIntoDB,
};
//# sourceMappingURL=settings.service.js.map