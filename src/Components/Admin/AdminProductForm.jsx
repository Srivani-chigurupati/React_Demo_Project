import { useState } from "react";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  discountPercentage: "0",
  rating: "0",
  stock: "0",
  image: "",
  imageName: "",
};

const MAX_IMAGE_SIZE = 1024 * 1024;
const PUBLIC_IMAGE_PREFIX = "/product-images/";

const readImageFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read the selected image."));
      }
    };
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });

const AdminProductForm = ({
  initialProduct,
  loading,
  submitLabel,
  onSubmit,
  onCancel,
}) => {
  const initialImage =
    initialProduct?.images?.[0] || initialProduct?.thumbnail || "";
  const initialIsPublicImage = initialImage.startsWith(PUBLIC_IMAGE_PREFIX);
  const [form, setForm] = useState(
    initialProduct
      ? {
          title: initialProduct.title || "",
          description: initialProduct.description || "",
          category: initialProduct.category || "",
          brand: initialProduct.brand || "",
          price: String(initialProduct.price ?? ""),
          discountPercentage: String(initialProduct.discountPercentage ?? 0),
          rating: String(initialProduct.rating ?? 0),
          stock: String(initialProduct.stock ?? 0),
          image: initialImage,
          imageName: initialIsPublicImage
            ? initialImage.slice(PUBLIC_IMAGE_PREFIX.length)
            : "",
        }
      : emptyForm,
  );
  const [imageSource, setImageSource] = useState(
    initialIsPublicImage ? "public" : "upload",
  );
  const [formError, setFormError] = useState("");

  const updateFormField = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormError("Select an image file.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setFormError("Choose an image smaller than 1 MB.");
      event.target.value = "";
      return;
    }

    try {
      const image = await readImageFile(file);
      setForm((currentForm) => ({ ...currentForm, image, imageName: "" }));
      setFormError("");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Could not read the image file.",
      );
      event.target.value = "";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");
    const imageName = form.imageName.trim();
    const image =
      imageSource === "public" && imageName
        ? `${PUBLIC_IMAGE_PREFIX}${encodeURIComponent(imageName)}`
        : imageSource === "upload"
          ? form.image.trim()
          : "";

    if (!image) {
      setFormError(
        imageSource === "public"
          ? "Enter the image filename from public/product-images."
          : "Choose an image file before saving the product.",
      );
      return;
    }
    if (
      imageSource === "public" &&
      (imageName.includes("/") || imageName.includes("\\"))
    ) {
      setFormError("Enter only the image filename, not a folder path.");
      return;
    }

    const productData = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      brand: form.brand.trim(),
      price: Number(form.price),
      discountPercentage: Number(form.discountPercentage),
      rating: Number(form.rating),
      stock: Number(form.stock),
      thumbnail: image,
      images: [image],
    };

    try {
      onSubmit(productData);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Could not save this product.",
      );
    }
  };

  const previewImage =
    imageSource === "upload"
      ? form.image.startsWith(PUBLIC_IMAGE_PREFIX)
        ? ""
        : form.image
      : form.imageName.trim()
        ? `${PUBLIC_IMAGE_PREFIX}${encodeURIComponent(form.imageName.trim())}`
        : "";

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">
          {initialProduct ? "Update product" : "Add a product"}
        </h2>
        {formError && (
          <p className="alert alert-danger" role="alert">
            {formError}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="admin-product-title">
                Product name
              </label>
              <input
                className="form-control"
                id="admin-product-title"
                name="title"
                value={form.title}
                onChange={updateFormField}
                required
                maxLength="120"
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="admin-product-category">
                Category
              </label>
              <input
                className="form-control"
                id="admin-product-category"
                name="category"
                value={form.category}
                onChange={updateFormField}
                placeholder="For example: home-decoration"
                required
                maxLength="80"
              />
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="admin-product-description">
                Description
              </label>
              <textarea
                className="form-control"
                id="admin-product-description"
                name="description"
                rows="3"
                value={form.description}
                onChange={updateFormField}
                required
                maxLength="1000"
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label" htmlFor="admin-product-price">
                Price
              </label>
              <input
                className="form-control"
                id="admin-product-price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={updateFormField}
                required
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label" htmlFor="admin-product-discount">
                Discount (%)
              </label>
              <input
                className="form-control"
                id="admin-product-discount"
                name="discountPercentage"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={form.discountPercentage}
                onChange={updateFormField}
                required
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label" htmlFor="admin-product-rating">
                Rating
              </label>
              <input
                className="form-control"
                id="admin-product-rating"
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={updateFormField}
                required
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label" htmlFor="admin-product-stock">
                Stock
              </label>
              <input
                className="form-control"
                id="admin-product-stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={updateFormField}
                required
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="admin-product-brand">
                Brand (optional)
              </label>
              <input
                className="form-control"
                id="admin-product-brand"
                name="brand"
                value={form.brand}
                onChange={updateFormField}
                maxLength="100"
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="admin-product-image">
                Product image
              </label>
              <div
                className="btn-group mb-2"
                role="group"
                aria-label="Image source"
              >
                <input
                  className="btn-check"
                  id="admin-image-source-upload"
                  type="radio"
                  name="imageSource"
                  checked={imageSource === "upload"}
                  onChange={() => {
                    setImageSource("upload");
                    if (form.image.startsWith(PUBLIC_IMAGE_PREFIX)) {
                      setForm((currentForm) => ({
                        ...currentForm,
                        image: "",
                      }));
                    }
                  }}
                />
                <label
                  className="btn btn-outline-primary"
                  htmlFor="admin-image-source-upload"
                >
                  Upload image
                </label>
                <input
                  className="btn-check"
                  id="admin-image-source-public"
                  type="radio"
                  name="imageSource"
                  checked={imageSource === "public"}
                  onChange={() => setImageSource("public")}
                />
                <label
                  className="btn btn-outline-primary"
                  htmlFor="admin-image-source-public"
                >
                  Use public image
                </label>
              </div>
              {imageSource === "upload" ? (
                <>
                  <input
                    className="form-control"
                    id="admin-product-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="form-text">
                    Choose an image up to 1 MB. It is saved in this browser’s
                    local storage.
                  </div>
                </>
              ) : (
                <>
                  <div className="input-group">
                    <span className="input-group-text">
                      {PUBLIC_IMAGE_PREFIX}
                    </span>
                    <input
                      className="form-control"
                      id="admin-product-image"
                      name="imageName"
                      value={form.imageName}
                      onChange={updateFormField}
                      placeholder="mug.jpg"
                      maxLength="255"
                    />
                  </div>
                  <div className="form-text">
                    Copy the image into public/product-images and enter only
                    its filename, including the extension.
                  </div>
                </>
              )}
              {previewImage && (
                <img
                  className="mt-2 rounded border object-fit-contain"
                  src={previewImage}
                  alt="Product preview"
                  width="120"
                  height="120"
                />
              )}
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2 mt-4">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {submitLabel}
            </button>
            {onCancel && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={onCancel}
              >
                Choose another product
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default AdminProductForm;
