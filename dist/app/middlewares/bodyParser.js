"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBody = void 0;
const parseBody = (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    // Convert array fields from features[] to features
    const arrayFields = ["features", "colors", "removeImages", "categories", "subcategories"];
    arrayFields.forEach((field) => {
        const arrayKey = `${field}[]`;
        if (req.body[arrayKey]) {
            // If it's already an array, use it
            if (Array.isArray(req.body[arrayKey])) {
                req.body[field] = req.body[arrayKey];
            }
            else {
                // If it's a single value, wrap it in an array
                req.body[field] = [req.body[arrayKey]];
            }
            delete req.body[arrayKey];
        }
    });
    next();
};
exports.parseBody = parseBody;
//# sourceMappingURL=bodyParser.js.map