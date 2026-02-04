"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueSlug = exports.createSlug = void 0;
const slugify_1 = __importDefault(require("slugify"));
const createSlug = (text) => {
    return (0, slugify_1.default)(text, {
        lower: true,
        strict: true,
        trim: true,
    });
};
exports.createSlug = createSlug;
const generateUniqueSlug = async (text, Model, fieldName = "slug") => {
    let slug = (0, exports.createSlug)(text);
    let counter = 1;
    // Check if slug exists
    while (await Model.findOne({ [fieldName]: slug })) {
        slug = `${(0, exports.createSlug)(text)}-${counter}`;
        counter++;
    }
    return slug;
};
exports.generateUniqueSlug = generateUniqueSlug;
//# sourceMappingURL=slugify.js.map