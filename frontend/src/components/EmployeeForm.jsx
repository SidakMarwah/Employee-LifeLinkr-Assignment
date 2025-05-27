import { useState, useEffect, useRef } from "react";

const validateForm = (form) => {
  const errors = {};

  // Name*
  if (!form.name.trim()) {
    errors.name = "Name is required.";
  }

  // Email*
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!emailRegex.test(form.email)) {
    errors.email = "Invalid email address.";
  }

  // Mobile*
  if (!form.mobile.trim()) {
    errors.mobile = "Mobile number is required.";
  } else if (!/^\d{10}$/.test(form.mobile)) {
    errors.mobile = "Mobile must be exactly 10 digits.";
  }

  // Designation*
  const validDesignations = ["HR", "Manager", "Sales"];
  if (!validDesignations.includes(form.designation)) {
    errors.designation = "Designation is required.";
  }

  // Gender*
  if (!["M", "F"].includes(form.gender)) {
    errors.gender = "Gender is required.";
  }

  // Course*
  if (!Array.isArray(form.course) || form.course.length === 0) {
    errors.course = "Select at least one course.";
  }

  // Image (optional but if present check type + size)
  if (form.image) {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(form.image.type)) {
      errors.image = "Only JPG/PNG images allowed.";
    }
    const maxSizeMB = 2;
    if (form.image.size > maxSizeMB * 1024 * 1024) {
      errors.image = `Image must be < ${maxSizeMB}MB.`;
    }
  }

  return errors;
};

export default function EmployeeForm({ initialValues = {}, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "HR",
    gender: "M",
    course: [],
    image: null,
    ...initialValues,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialValues?.image || null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length) {
      setForm((prev) => ({
        ...prev,
        ...initialValues,
        image: null,
      }));
    }
    if (initialValues && initialValues.image) {
      setImagePreview(initialValues.image);
    }
  }, [initialValues]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleClearImage = () => {
    setForm((prev) => ({
      ...prev,
      image: null,
    }));

    setImagePreview(null);
    setRemoveExistingImage(true); // flag to remove old image

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        course: checked
          ? [...prev.course, value]
          : prev.course.filter((c) => c !== value),
      }));
    } else if (type === "file") {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setRemoveExistingImage(false); // New file overrides clear
      setErrors((prev) => ({ ...prev, image: null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const newErrors = validateForm(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      setSubmitting(false);
      return; // Stop submission if there are validation errors
    }

    // Upload to S3 then call onSubmit with form + image URL
    let imageUrl = initialValues.image || null;

    // Remove existing image if user cleared it
    if (removeExistingImage) {
      imageUrl = "";
    }

    // Upload new image if provided
    if (form.image) {
      // 1) get signed URL
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/s3-url`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: form.image.name,
            type: form.image.type,
          }),
        }
      );
      const { url, key } = await res.json();

      // 2) upload file
      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": form.image.type },
        body: form.image,
      });

      imageUrl = `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`;
    }

    // 3) submit rest of data
    onSubmit({
      name: form.name,
      email: form.email,
      mobile: form.mobile,
      designation: form.designation,
      gender: form.gender,
      course: form.course,
      image: imageUrl,
    });
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/** Name */}
        <div>
          <label className="block mb-1 font-medium">
            Name<span className="text-gray-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/** Email */}
        <div>
          <label className="block mb-1 font-medium">
            Email<span className="text-gray-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/** Mobile */}
        <div>
          <label className="block mb-1 font-medium">
            Mobile<span className="text-gray-500">*</span>
          </label>
          <input
            name="mobile"
            type="text"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
            value={form.mobile}
            onChange={handleChange}
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
          )}
        </div>

        {/** Designation */}
        <div>
          <label className="block mb-1 font-medium">
            Designation<span className="text-gray-500">*</span>
          </label>
          <select
            name="designation"
            value={form.designation}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
          >
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
          {errors.designation && (
            <p className="text-red-500 text-sm mt-1">
              {errors.designation}
            </p>
          )}
        </div>

        {/** Gender */}
        <div>
          <label className="block mb-1 font-medium">
            Gender<span className="text-gray-500">*</span>
          </label>
          <div className="flex gap-4 mt-2">
            {["M", "F"].map((g) => (
              <label key={g} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={form.gender === g}
                  onChange={handleChange}
                  className="form-radio"
                />
                {g === "M" ? "Male" : "Female"}
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
          )}
        </div>

        {/** Courses */}
        <div>
          <label className="block mb-1 font-medium">
            Courses<span className="text-gray-500">*</span>
          </label>
          <div className="flex flex-wrap gap-4 mt-2">
            {["MCA", "BCA", "BSC"].map((c) => (
              <label key={c} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="course"
                  value={c}
                  checked={form.course.includes(c)}
                  onChange={handleChange}
                />
                {c}
              </label>
            ))}
          </div>
          {errors.course && (
            <p className="text-red-500 text-sm mt-1">{errors.course}</p>
          )}
        </div>
      </div>

      {/** Image Upload */}
      <div>
        <label className="block mb-1 font-medium">Image Upload</label>
        <div className="flex items-center gap-4 flex-wrap">
          <input
            ref={fileInputRef}
            id="file-upload"
            name="image"
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleChange}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition"
          >
            Choose File
          </label>
        </div>

        {imagePreview && (
          <div className="flex items-center gap-4 mt-4 bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-700">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-gray-600"
            />
            <button
              type="button"
              onClick={handleClearImage}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition duration-200"
            >
              Remove Image
            </button>
          </div>
        )}



        {errors.image && (
          <p className="text-red-500 text-sm mt-1">{errors.image}</p>
        )}
      </div>

      {/** Submit */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-lg font-semibold cursor-pointer "
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
