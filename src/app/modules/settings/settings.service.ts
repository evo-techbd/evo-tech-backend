import { ContactSettings, DeliveryChargeSettings } from "./settings.model";
import {
  IContactSettings,
  IDeliveryChargeSettings,
} from "./settings.interface";

const DEFAULT_DELIVERY_CHARGE_SETTINGS = {
  insideDhakaCharge: 70,
  outsideDhakaCharge: 120,
  additionalChargePerKg: 20,
  expressInsideDhakaCharge: 150,
  expressOutsideDhakaCharge: 250,
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

const DEFAULT_CONTACT_SETTINGS = {
  email: "evotech.bd22@gmail.com",
  phones: ["+880 1799 424854", "+880 1761 490093"],
  whatsapp: "+880 1799 424854",
  address: "72/A, Matikata Bazar, Dhaka Cantonment, Dhaka-1206, Bangladesh",
  businessHours:
    "Saturday – Thursday: 10:00 AM – 7:00 PM\nFriday: Closed\nPublic holidays: By appointment",
  mapUrl: "",
  facebook: "https://www.facebook.com/EvoTechBD22",
  instagram: "",
  linkedin: "",
  youtube: "",
};

// Contact info is a singleton document - create it with defaults on first read
const getContactSettingsFromDB = async () => {
  let settings = await ContactSettings.findOne();

  if (!settings) {
    settings = await ContactSettings.create(DEFAULT_CONTACT_SETTINGS);
  }

  return settings;
};

const updateContactSettingsIntoDB = async (
  payload: Partial<IContactSettings>
) => {
  const settings = await getContactSettingsFromDB();
  Object.assign(settings, payload);
  await settings.save();
  return settings;
};

export const SettingsService = {
  getDeliveryChargeSettingsFromDB,
  updateDeliveryChargeSettingsIntoDB,
  getContactSettingsFromDB,
  updateContactSettingsIntoDB,
};
