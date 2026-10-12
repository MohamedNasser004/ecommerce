export const CATEGORIES = [
  { id: 1, name: "تقنية", value: "tech" },
  { id: 2, name: "برمجة", value: "programming" },
  { id: 3, name: "تصميم", value: "design" },
  { id: 4, name: "تسويق", value: "marketing" },
  { id: 5, name: "أعمال", value: "business" },
  { id: 6, name: "تطوير الذات", value: "self-development" }
];

export const STATUS_OPTIONS = {
  DRAFT: { value: "draft", label: "مسودة", color: "bg-yellow-100 text-yellow-800" },
  PUBLISHED: { value: "published", label: "منشور", color: "bg-green-100 text-green-800" }
};

export const FORM_CONFIG = {
  TITLE_MAX_LENGTH: 100,
  META_DESC_MAX_LENGTH: 160,
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};