import { DeliveryChargeSettings } from "./settings.model";
import { IDeliveryChargeSettings } from "./settings.interface";

const DEFAULT_DELIVERY_CHARGE_SETTINGS = {
  insideDhakaCharge: 70,
  outsideDhakaCharge: 120,
  additionalChargePerKg: 20,
};

// Delivery charge is a singleton document - create it with defaults on first read
const getDeliveryChargeSettingsFromDB = async () => {
  let settings = await DeliveryChargeSettings.findOne();

  if (!settings) {
    settings = await DeliveryChargeSettings.create(
      DEFAULT_DELIVERY_CHARGE_SETTINGS
    );
  }

  return settings;
};

const updateDeliveryChargeSettingsIntoDB = async (
  payload: Partial<IDeliveryChargeSettings>
) => {
  const settings = await DeliveryChargeSettings.findOne();

  if (!settings) {
    return DeliveryChargeSettings.create({
      ...DEFAULT_DELIVERY_CHARGE_SETTINGS,
      ...payload,
    });
  }

  Object.assign(settings, payload);
  await settings.save();
  return settings;
};

export const SettingsService = {
  getDeliveryChargeSettingsFromDB,
  updateDeliveryChargeSettingsIntoDB,
};
