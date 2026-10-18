"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintPricingService = void 0;
const print_pricing_model_1 = require("./print-pricing.model");
// Option lists the storefront calculator offers
const INFILL_OPTIONS = [10, 15, 20, 30, 40, 50, 75, 100];
const LAYER_HEIGHT_OPTIONS = [0.12, 0.16, 0.2, 0.28];
const WALL_OPTIONS = [2, 3, 4, 5, 6];
const DEFAULT_PRICING_SETTINGS = {
    materials: [
        {
            name: "PLA",
            fullName: "Polylactic Acid",
            description: "Biodegradable, food safe plastic. Best for general purpose prints and decorative items.",
            density: 1.24,
            pricePerGram: 15,
            colors: [
                "White",
                "Black",
                "Red",
                "Blue",
                "Green",
                "Yellow",
                "Orange",
                "Gray",
            ],
            isActive: true,
        },
        {
            name: "ABS",
            fullName: "Acrylonitrile Butadiene Styrene",
            description: "Strong and durable plastic. Ideal for functional parts and items requiring heat resistance.",
            density: 1.04,
            pricePerGram: 18,
            colors: ["White", "Black", "Red", "Blue", "Gray"],
            isActive: true,
        },
        {
            name: "PETG",
            fullName: "Polyethylene Terephthalate Glycol",
            description: "Chemical resistant and strong. Perfect for mechanical parts and outdoor use.",
            density: 1.27,
            pricePerGram: 20,
            colors: ["Clear", "White", "Black", "Blue"],
            isActive: true,
        },
        {
            name: "TPU",
            fullName: "Thermoplastic Polyurethane",
            description: "Flexible and rubber-like. Great for phone cases, gaskets, and wearables.",
            density: 1.21,
            pricePerGram: 25,
            colors: ["White", "Black", "Clear"],
            isActive: true,
        },
    ],
    machineRatePerHour: 0,
    setupFee: 0,
    minimumCharge: 0,
};
// Pricing is a singleton document - create it with defaults on first read
const getPricingSettingsFromDB = async () => {
    let settings = await print_pricing_model_1.PrintPricingSettings.findOne();
    if (!settings) {
        settings = await print_pricing_model_1.PrintPricingSettings.create(DEFAULT_PRICING_SETTINGS);
    }
    return settings;
};
// Public view for the 3D printing page calculator
const getPublicPricingFromDB = async () => {
    const settings = await getPricingSettingsFromDB();
    return {
        materials: settings.materials.filter((material) => material.isActive),
        machineRatePerHour: settings.machineRatePerHour,
        setupFee: settings.setupFee,
        minimumCharge: settings.minimumCharge,
        infillOptions: INFILL_OPTIONS,
        layerHeightOptions: LAYER_HEIGHT_OPTIONS,
        wallOptions: WALL_OPTIONS,
    };
};
const updatePricingSettingsIntoDB = async (payload) => {
    const settings = await getPricingSettingsFromDB();
    Object.assign(settings, payload);
    await settings.save();
    return settings;
};
exports.PrintPricingService = {
    getPublicPricingFromDB,
    getPricingSettingsFromDB,
    updatePricingSettingsIntoDB,
};
//# sourceMappingURL=print-pricing.service.js.map