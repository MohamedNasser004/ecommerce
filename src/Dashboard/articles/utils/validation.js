export const validateSlug = (slug) => {
  if (!slug) return "الرابط المختصر مطلوب";
  if (slug.length < 3) return "الرابط المختصر قصير جداً";
  if (!/^[a-z0-9-]+$/.test(slug)) return "يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط";
  return "";
};

export const validateImage = (file) => {
  if (!file) return "صورة المقالة مطلوبة";
  
  if (file.size > 5 * 1024 * 1024) {
    return "حجم الصورة يجب أن يكون أقل من 5 ميجابايت";
  }
  
  if (!file.type.startsWith('image/')) {
    return "الرجاء اختيار ملف صورة فقط";
  }
  
  return "";
};

export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\u0621-\u064A\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const validateBlogForm = (formData) => {
  const errors = {};
  
  if (!formData.title?.trim()) {
    errors.title = "عنوان المقالة مطلوب";
  }
  
  if (!formData.slug?.trim()) {
    errors.slug = "الرابط المختصر مطلوب";
  } else {
    const slugError = validateSlug(formData.slug);
    if (slugError) errors.slug = slugError;
  }
  
  if (!formData.image) {
    errors.image = "صورة المقالة مطلوبة";
  }
  
  if (!formData.content?.trim()) {
    errors.content = "محتوى المقالة مطلوب";
  }
  
  if (!formData.category) {
    errors.category = "التصنيف مطلوب";
  }
  
  return errors;
};