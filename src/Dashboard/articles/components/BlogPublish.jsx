import React from 'react';
import { FiUser, FiEye, FiEdit3, FiSave } from 'react-icons/fi';

const BlogPublish = ({ 
  status, 
  author, 
  onStatusChange, 
  onAuthorChange, 
  isSubmitting, 
  onSubmit,
  buttonText = "حفظ المقالة" // إضافة خاصية buttonText
}) => {
  return (
    <div className="space-y-6">
      {/* Status Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          حالة المقالة
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onStatusChange("draft")}
            className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
              status === "draft"
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
            }`}
          >
            <FiEdit3 className="w-5 h-5" />
            <div className="text-right">
              <div className="font-semibold">مسودة</div>
              <div className="text-xs opacity-75">حفظ للتحرير لاحقاً</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onStatusChange("published")}
            className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
              status === "published"
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
            }`}
          >
            <FiEye className="w-5 h-5" />
            <div className="text-right">
              <div className="font-semibold">نشر</div>
              <div className="text-xs opacity-75">نشر للمستخدمين</div>
            </div>
          </button>
        </div>
      </div>

      {/* Author */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          <FiUser className="w-4 h-4" />
          المؤلف
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => onAuthorChange(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
          placeholder="اسم المؤلف"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md hover:shadow-lg"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جاري الحفظ...
            </>
          ) : (
            <>
              <FiSave className="w-5 h-5" />
              {buttonText} {/* استخدام buttonText هنا */}
            </>
          )}
        </button>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
          {status === "draft"
            ? "سيتم حفظ المقالة كمسودة يمكنك تعديلها ونشرها لاحقاً"
            : "سيتم نشر المقالة مباشرة للمستخدمين"}
        </p>
      </div>
    </div>
  );
};

export default BlogPublish;