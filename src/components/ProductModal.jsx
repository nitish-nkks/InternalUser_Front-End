import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiUpload, FiTrash2, FiSave } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './ProductModal.module.css';
import { addProduct, getCategoryTree, uploadProductImage, updateProduct } from '../api/api';
import axiosInstance from '../api/axiosInstance';

const PRODUCT_TYPE_OPTIONS = [
  { value: 0, label: 'Simple' },
  { value: 1, label: 'Pack' },
  { value: 2, label: 'Combo' }
];

const FORM_TYPE_OPTIONS = [
  { value: 0, label: 'Pellet' },
  { value: 1, label: 'Powder' },
  { value: 2, label: 'Liquid' },
  { value: 3, label: 'Tablets' }
];

const UOM_OPTIONS = [
  { value: 0, label: 'KG' },
  { value: 1, label: 'MT' },
  { value: 2, label: 'EA' },
  { value: 3, label: 'BAG' },
  { value: 4, label: 'Box' },
  { value: 5, label: 'Carton' },
  { value: 6, label: 'Tin' },
  { value: 7, label: 'SET' },
  { value: 8, label: 'TO' },
  { value: 9, label: 'Litre' }
];

const renderCategoryOptions = (categories, prefix = "") => {
  return categories.map(cat => (
    <React.Fragment key={cat.id}>
      <option value={cat.id}>
        {prefix}{cat.name}
      </option>
      {cat.subCategories && cat.subCategories.length > 0 &&
        renderCategoryOptions(cat.subCategories, prefix + "-- ")}
    </React.Fragment>
  ));
};

const ProductModal = ({ isOpen, onClose, onSave, product = null, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    // Basic Product Fields
    name: '',
    productCode: '',
    description: '',
    price: '',
    discountPercentage: '',
    stockQuantity: '',
    minOrderQuantity: '',
    categoryId: null,
    image: '',
    productImages: [],
    isFeatured: false,
    isNewProduct: false,
    isBestSeller: false,
    // Product Specification Fields
    productType: 0,
    uom: 0,
    weight: '',
    packSize: '',
    formType: 0,
    shelfLifeMonths: '',
    dosageApplication: '',
    storageInstructions: '',
    certifications: '',
    hsnSacCode: '',
    taxRate: '',
  });
  const [categoryTree, setCategoryTree] = useState([]);
  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const res = await getCategoryTree();
          setCategoryTree(res.data.data);
        } catch (err) {
          console.error("Error fetching categories:", err);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (product && (mode === 'edit' || mode === 'view')) {
        const existingImages = product.productImages
          ? product.productImages.map(img => img.imageUrl)
          : [];
        setFormData({
          // Basic fields
          name: product.name || '',
          productCode: product.productCode || '',
          description: product.description || '',
          price: product.price || '',
          discountPercentage: product.discountPercentage || '',
          stockQuantity: product.stockQuantity || '',
          minOrderQuantity: product.minOrderQuantity || '',
          categoryId: product.categoryId || '',
          image: product.image || '',
          productImages: existingImages,
          isFeatured: product.isFeatured ?? false,
          isNewProduct: product.isNewProduct ?? false,
          isBestSeller: product.isBestSeller ?? false,
          // Product Specification fields (from nested specification object)
          productType: product.productSpecification?.productType ?? 0,
          uom: product.productSpecification?.uom ?? 0,
          weight: product.productSpecification?.weight || '',
          packSize: product.productSpecification?.packSize || '',
          formType: product.productSpecification?.formType ?? 0,
          shelfLifeMonths: product.productSpecification?.shelfLifeMonths || '',
          dosageApplication: product.productSpecification?.dosageApplication || '',
          storageInstructions: product.productSpecification?.storageInstructions || '',
          certifications: product.productSpecification?.certifications || '',
          hsnSacCode: product.productSpecification?.hsnSacCode || '',
          taxRate: product.productSpecification?.taxRate || '',
          isActive: product.productSpecification?.isActive ?? true
        });
        setImagePreviews(existingImages);
      } else if (mode === 'add') {
        setFormData({
          name: '',
          productCode: '',
          description: '',
          price: '',
          discountPercentage: '',
          stockQuantity: '',
          minOrderQuantity: '',
          categoryId: null,
          image: '',
          productImages: [],
          isFeatured: false,
          isNewProduct: false,
          isBestSeller: false,
          productType: 0,
          uom: 0,
          weight: '',
          packSize: '',
          formType: 0,
          shelfLifeMonths: '',
          dosageApplication: '',
          storageInstructions: '',
          certifications: '',
          hsnSacCode: '',
          taxRate: '',
          isActive: true
        });
        setImagePreviews([]);
        setImageFiles([]);
      }
      setErrors({});
    }
  }, [isOpen, product, mode]);

  // Handle outside click and ESC key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    if (name === 'description') {
      const wordCount = getWordCount(inputValue);
      if (wordCount > 500) {
        return;
      }
    }
    if (name === 'dosageApplication' && inputValue.length > 300) {
      return;
    }
    if ((name === 'storageInstructions' || name === 'certifications') && inputValue.length > 300) {
      return;
    }
    if (name === 'hsnSacCode' && inputValue.length > 100) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getWordCount = (text) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const handleImageUpload = (files) => {
    const newImageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    const combinedFiles = [...imageFiles, ...newImageFiles];
    if (combinedFiles.length > 5) {
      setErrors({ api: "Maximum 5 images allowed." });
      return;
    }
    setImageFiles(combinedFiles);

    const newImagePreviews = newImageFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newImagePreviews]);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleImageUpload(files);
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    // Basic validations
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.productCode.trim()) newErrors.productCode = 'Product code is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.discountPercentage && formData.discountPercentage >= 100) newErrors.discountPercentage = 'Discount percentage must be less than 100';
    if (!formData.stockQuantity || formData.stockQuantity < 0) newErrors.stockQuantity = 'Stock must be 0 or greater';
    if (!formData.minOrderQuantity || formData.minOrderQuantity <= 0) newErrors.minOrderQuantity = 'Minimum order quantity must be greater than 0';
    if (getWordCount(formData.description) > 500) newErrors.description = 'Description cannot exceed 500 words';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';

    // Product Specification validations
    if (!formData.weight || formData.weight <= 0) newErrors.weight = 'Weight must be greater than 0';
    if (!formData.packSize || formData.packSize <= 0) newErrors.packSize = 'Pack size must be greater than 0';
    if (!formData.shelfLifeMonths || formData.shelfLifeMonths <= 0) newErrors.shelfLifeMonths = 'Shelf life must be greater than 0';
    if (!formData.dosageApplication.trim()) newErrors.dosageApplication = 'Dosage/Application is required';
    if (!formData.hsnSacCode.trim()) newErrors.hsnSacCode = 'HSN/SAC Code is required';
    if (!formData.taxRate || formData.taxRate < 0 || formData.taxRate > 100) newErrors.taxRate = 'Tax rate must be between 0 and 100';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const extractProductId = (productResp) => {
    const candidates = [
      productResp?.data?.Id,
      productResp?.data?.id,
      productResp?.Id,
      productResp?.id,
    ];
    for (const c of candidates) {
      if (typeof c === 'number' && c > 0) return c;
      if (typeof c === 'string' && c.trim() !== '') {
        const n = parseInt(c, 10);
        if (!isNaN(n)) return n;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'view') {
      onClose();
      return;
    }

    if (!validateForm()) {
      return;
    }

    const productData = {
      // Basic fields
      name: formData.name,
      productCode: formData.productCode,
      description: formData.description,
      price: parseFloat(formData.price),
      discountPercentage: parseFloat(formData.discountPercentage) || 0,
      stockQuantity: parseInt(formData.stockQuantity),
      minOrderQuantity: parseInt(formData.minOrderQuantity),
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      image: formData.image ? formData.image.name || formData.image : '',
      productImages: formData.productImages || [],
      isFeatured: formData.isFeatured,
      isNewProduct: formData.isNewProduct,
      isBestSeller: formData.isBestSeller,
      // Product Specification fields (nested object)
      specification: {
        productType: parseInt(formData.productType),
        uom: parseInt(formData.uom),
        weight: parseFloat(formData.weight),
        packSize: parseInt(formData.packSize),
        formType: parseInt(formData.formType),
        shelfLifeMonths: parseInt(formData.shelfLifeMonths),
        dosageApplication: formData.dosageApplication,
        storageInstructions: formData.storageInstructions || null,
        certifications: formData.certifications || null,
        hsnSacCode: formData.hsnSacCode,
        taxRate: parseFloat(formData.taxRate)
      }
    };

    setIsLoading(true);
    setErrors({});

    try {
      if (mode === 'edit' && product?.id) {
        // Edit mode
        const updatedProduct = await updateProduct(product.id, productData);
        console.log('Product updated successfully:', updatedProduct);

        if (imageFiles && imageFiles.length > 0) {
          for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            try {
              await uploadProductImage(product.id, file, i === 0);
            } catch (uploadErr) {
              console.warn("Upload failed for file:", file.name, uploadErr);
            }
          }
        }

        alert("✅ Product updated successfully!");
        if (onSave) {
          onSave({ ...updatedProduct, id: product.id });
        }
        onClose();
      } else {
        // Add mode
        const productResp = await addProduct(productData);
        const productId = extractProductId(productResp);

        if (!productId) {
          throw new Error("Product saved but no productId was returned.");
        }

        if (imageFiles && imageFiles.length > 0) {
          for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            try {
              await uploadProductImage(productId, file, i === 0);
            } catch (uploadErr) {
              console.warn("Upload failed for file:", file.name, uploadErr);
            }
          }
        }

        alert("✅ Product added successfully!");
        if (onSave) {
          onSave(productResp);
        }

        if (window.location.pathname.includes('/products')) {
          window.location.reload();
        } else {
          onClose();
        }
      }
    } catch (err) {
      console.error("Error saving product:", err);
      const message = err?.response?.data?.message || err?.message || JSON.stringify(err);
      setErrors({ api: message });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={classNames(styles.modalOverlay, { [styles.open]: isOpen })}>
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {mode === 'view' ? 'Product Details' : mode === 'edit' ? 'Update Feed Product' : 'Create New Feed Product'}
          </h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>
        <div className={styles.modalBody}>
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Basic Product Information Section */}
            <h3 className={styles.sectionTitle}>Basic Information</h3>

            <div className={styles.formGroup}>
              <label className={styles.label}>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={classNames(styles.input, { [styles.error]: errors.name })}
                placeholder="Enter product name"
                disabled={mode === 'view' || isLoading}
                required
              />
              {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Product Code *</label>
              <input
                type="text"
                name="productCode"
                value={formData.productCode}
                onChange={handleInputChange}
                className={classNames(styles.input, { [styles.error]: errors.productCode })}
                placeholder="Enter product code (e.g., PRD001)"
                disabled={mode === 'view' || isLoading}
                required
              />
              {errors.productCode && <span className={styles.errorMessage}>{errors.productCode}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={classNames(styles.textarea, { [styles.error]: errors.description })}
                placeholder="Enter product description..."
                rows={4}
                disabled={mode === 'view' || isLoading}
              />
              <div className={styles.characterCount}>
                {getWordCount(formData.description)} / 500 words
              </div>
              {errors.description && <span className={styles.errorMessage}>{errors.description}</span>}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={classNames(styles.input, { [styles.error]: errors.price })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  disabled={mode === 'view' || isLoading}
                  required
                />
                {errors.price && <span className={styles.errorMessage}>{errors.price}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Discount Percentage (%)</label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  className={classNames(styles.input, { [styles.error]: errors.discountPercentage })}
                  placeholder="0"
                  min="0"
                  max="100"
                  disabled={mode === 'view' || isLoading}
                />
                {errors.discountPercentage && <span className={styles.errorMessage}>{errors.discountPercentage}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Stock/Inventory *</label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  className={classNames(styles.input, { [styles.error]: errors.stockQuantity })}
                  placeholder="0"
                  min="0"
                  disabled={mode === 'view' || isLoading}
                  required
                />
                {errors.stockQuantity && <span className={styles.errorMessage}>{errors.stockQuantity}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Min Order Quantity *</label>
                <input
                  type="number"
                  name="minOrderQuantity"
                  value={formData.minOrderQuantity}
                  onChange={handleInputChange}
                  className={classNames(styles.input, { [styles.error]: errors.minOrderQuantity })}
                  placeholder="1"
                  min="1"
                  disabled={mode === 'view' || isLoading}
                  required
                />
                {errors.minOrderQuantity && <span className={styles.errorMessage}>{errors.minOrderQuantity}</span>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Category *</label>
              <select
                name="categoryId"
                value={formData.categoryId ?? ""}
                onChange={handleInputChange}
                className={classNames(styles.select, { [styles.error]: errors.categoryId })}
                disabled={mode === "view" || isLoading}
                required
              >
                <option value="" disabled>Select a category</option>
                {renderCategoryOptions(categoryTree)}
              </select>
              {errors.categoryId && <span className={styles.errorMessage}>{errors.categoryId}</span>}
            </div>

            {/* Thumbnail Image Section */}
            <h3 className={styles.sectionTitle}>Thumbnail Image *</h3>
            <div className={styles.formGroup}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData(prev => ({ ...prev, image: file }));
                  }
                }}
                disabled={mode === 'view' || isLoading}
                required={mode !== 'view'}
              />
              {formData.image && (
                <div className={styles.imagePreviewGrid}>
                  <div className={styles.imagePreview}>
                    <img
                      src={typeof formData.image === 'string'
                        ? formData.image.startsWith('/uploads')
                          ? formData.image
                          : `/uploads/products/${formData.image}`
                        : URL.createObjectURL(formData.image)}
                      alt="Thumbnail"
                      className={styles.previewImage}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Product Specification Section */}
            <h3 className={styles.sectionTitle}>Product Specifications</h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Product Type *</label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleInputChange}
                  className={styles.select}
                  disabled={mode === 'view' || isLoading}
                  required
                >
                  {PRODUCT_TYPE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Unit of Measurement *</label>
                <select
                  name="uom"
                  value={formData.uom}
                  onChange={handleInputChange}
                  className={styles.select}
                  disabled={mode === 'view' || isLoading}
                  required
                >
                  {UOM_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Weight *</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className={classNames(styles.input, { [styles.error]: errors.weight })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  disabled={mode === 'view' || isLoading}
                  required
                />
                {errors.weight && <span className={styles.errorMessage}>{errors.weight}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Pack Size *</label>
                <input
                  type="number"
                  name="packSize"
                  value={formData.packSize}
                  onChange={handleInputChange}
                  className={classNames(styles.input, { [styles.error]: errors.packSize })}
                  placeholder="0"
                  min="1"
                  disabled={mode === 'view' || isLoading}
                  required
                />
                {errors.packSize && <span className={styles.errorMessage}>{errors.packSize}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Form Type *</label>
                <select
                  name="formType"
                  value={formData.formType}
                  onChange={handleInputChange}
                  className={styles.select}
                  disabled={mode === 'view' || isLoading}
                  required
                >
                  {FORM_TYPE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Shelf Life (Months) *</label>
                <input
                  type="number"
                  name="shelfLifeMonths"
                  value={formData.shelfLifeMonths}
                  onChange={handleInputChange}
                  className={classNames(styles.input, { [styles.error]: errors.shelfLifeMonths })}
                  placeholder="0"
                  min="1"
                  disabled={mode === 'view' || isLoading}
                  required
                />
                {errors.shelfLifeMonths && <span className={styles.errorMessage}>{errors.shelfLifeMonths}</span>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Dosage/Application *</label>
              <textarea
                name="dosageApplication"
                value={formData.dosageApplication}
                onChange={handleInputChange}
                className={classNames(styles.textarea, { [styles.error]: errors.dosageApplication })}
                placeholder="Enter dosage and application instructions..."
                rows={3}
                maxLength={300}
                disabled={mode === 'view' || isLoading}
                required
              />
              <div className={styles.characterCount}>
                {formData.dosageApplication.length} / 300 characters
              </div>
              {errors.dosageApplication && <span className={styles.errorMessage}>{errors.dosageApplication}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Storage Instructions</label>
              <textarea
                name="storageInstructions"
                value={formData.storageInstructions}
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder="Enter storage instructions..."
                rows={2}
                maxLength={300}
                disabled={mode === 'view' || isLoading}
              />
              <div className={styles.characterCount}>
                {formData.storageInstructions.length} / 300 characters
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Certifications</label>
              <input
                type="text"
                name="certifications"
                value={formData.certifications}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="e.g., ISO 9001, FSSAI"
                maxLength={300}
                disabled={mode === 'view' || isLoading}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>HSN/SAC Code *</label>
                <input
                  type="text"
                  name="hsnSacCode"
                  value={formData.hsnSacCode}
                  onChange={handleInputChange}
                  className={classNames(styles.input, { [styles.error]: errors.hsnSacCode })}
                  placeholder="Enter HSN/SAC code"
                  maxLength={100}
                  disabled={mode === 'view' || isLoading}
                  required
                />
                {errors.hsnSacCode && <span className={styles.errorMessage}>{errors.hsnSacCode}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Tax Rate (%) *</label>
                <input
                  type="number"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleInputChange}
                  className={classNames(styles.input, { [styles.error]: errors.taxRate })}
                  placeholder="0.00"
                  min="0"
                  max="100"
                  step="0.01"
                  disabled={mode === 'view' || isLoading}
                  required
                />
                {errors.taxRate && <span className={styles.errorMessage}>{errors.taxRate}</span>}
              </div>
            </div>

            {/* Product Flags Section */}
            <h3 className={styles.sectionTitle}>Product Flags</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    disabled={mode === 'view' || isLoading}
                  />
                  Is Featured
                </label>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isNewProduct"
                    checked={formData.isNewProduct}
                    onChange={handleInputChange}
                    disabled={mode === 'view' || isLoading}
                  />
                  Is New Product
                </label>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isBestSeller"
                    checked={formData.isBestSeller}
                    onChange={handleInputChange}
                    disabled={mode === 'view' || isLoading}
                  />
                  Is Best Seller
                </label>
              </div>
            </div>

            {/* Image Upload Section */}
            <h3 className={styles.sectionTitle}>Product Images</h3>
            <div className={styles.imageUpload}>
              {mode !== 'view' && (
                <div
                  className={classNames(styles.imageUploadArea, {
                    [styles.dragOver]: isDragOver
                  })}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FiUpload className={styles.uploadIcon} />
                  <div className={styles.uploadText}>
                    Click to upload or drag and drop
                  </div>
                  <div className={styles.uploadSubtext}>
                    PNG, JPG, GIF up to 10MB each (Max 5 images)
                  </div>
                </div>
              )}

              {imagePreviews.length > 0 && (
                <div className={styles.imagePreviewGrid}>
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className={styles.imagePreview}>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className={styles.previewImage}
                      />
                      {mode !== 'view' && (
                        <button
                          type="button"
                          className={styles.removeImageButton}
                          onClick={() => removeImage(index)}
                          aria-label="Remove image"
                          disabled={isLoading}
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {mode !== 'view' && (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInputChange}
                  className={styles.hiddenInput}
                  disabled={isLoading}
                />
              )}
            </div>
            {isLoading && <div className={styles.loading}>Saving product...</div>}
            {errors.api && <div className={styles.errorMessage}>{errors.api}</div>}
          </form>
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={classNames(styles.button, styles.cancelButton)}
            onClick={onClose}
            disabled={isLoading}
          >
            {mode === 'view' ? 'Close' : 'Cancel'}
          </button>
          {mode !== 'view' && (
            <button
              type="submit"
              className={classNames(styles.button, styles.saveButton)}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              <FiSave />
              {mode === 'edit' ? 'Update Product' : 'Save Product'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;