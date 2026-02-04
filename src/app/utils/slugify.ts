import slugify from "slugify";

export const createSlug = (text: string): string => {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};

export const generateUniqueSlug = async (
  text: string,
  Model: any,
  fieldName: string = "slug"
): Promise<string> => {
  let slug = createSlug(text);
  let counter = 1;

  // Check if slug exists
  while (await Model.findOne({ [fieldName]: slug })) {
    slug = `${createSlug(text)}-${counter}`;
    counter++;
  }

  return slug;
};
