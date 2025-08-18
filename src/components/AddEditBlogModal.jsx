import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiFileText, FiUser, FiLink, FiToggleLeft, FiToggleRight, FiImage, FiUpload, FiTrash2, FiCamera } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './AddEditBlogModal.module.css';
import { 
  generateSlug, 
  countWords, 
  countCharacters, 
  validateBlogData,
  stripHtml,
  authors,
  validateBlogImage,
  getBlogImagePreview
} from '../constants/blogData';

// Simple Rich Text Editor Component (placeholder for react-quill)
const RichTextEditor = ({ value, onChange, maxWords = 1000, placeholder = "Write your blog content here..." }) => {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize editor content when component mounts or value changes externally
  useEffect(() => {
    if (editorRef.current && (!isInitialized || editorRef.current.innerHTML !== value)) {
      const currentSelection = saveSelection();
      editorRef.current.innerHTML = value || '';
      setIsInitialized(true);
      
      // Restore selection if editor was focused
      if (isFocused && currentSelection) {
        setTimeout(() => restoreSelection(currentSelection), 0);
      }
    }
  }, [value, isInitialized]);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.getRangeAt && selection.rangeCount) {
      return selection.getRangeAt(0);
    }
    return null;
  };

  const restoreSelection = (range) => {
    if (range) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const handleInput = (e) => {
    const content = e.target.innerHTML;
    const wordCount = countWords(content);
    
    if (wordCount <= maxWords) {
      onChange(content);
    } else {
      // Prevent further input if max words exceeded
      e.preventDefault();
      return false;
    }
  };

  const handleKeyDown = (e) => {
    const content = editorRef.current.innerHTML;
    const wordCount = countWords(content);
    
    // Allow delete, backspace, and navigation keys even when at limit
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    
    if (wordCount >= maxWords && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      return false;
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const currentContent = editorRef.current.innerHTML;
    const currentWordCount = countWords(currentContent);
    const pasteWordCount = countWords(text);
    
    if (currentWordCount + pasteWordCount <= maxWords) {
      const selection = window.getSelection();
      if (selection.getRangeAt && selection.rangeCount) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Trigger change event
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  const applyFormat = (command, value = null) => {
    if (!editorRef.current) return;
    
    const savedRange = saveSelection();
    
    try {
      if (document.queryCommandSupported && document.queryCommandSupported(command)) {
        const success = document.execCommand(command, false, value);
        if (!success) {
          console.warn(`Command ${command} failed to execute`);
        }
      } else {
        console.warn(`Command ${command} not supported`);
      }
    } catch (error) {
      console.warn(`Command ${command} not supported or failed:`, error);
    }
    
    editorRef.current.focus();
    
    // Restore selection if needed
    if (savedRange) {
      setTimeout(() => restoreSelection(savedRange), 0);
    }
    
    // Always trigger onChange to update parent state
    setTimeout(() => {
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }, 10);
  };

  return (
    <div className={styles.richTextContainer}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => applyFormat('bold')}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => applyFormat('italic')}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => applyFormat('underline')}
          title="Underline"
        >
          <u>U</u>
        </button>
        <div className={styles.toolbarSeparator}></div>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => applyFormat('insertUnorderedList')}
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => applyFormat('insertOrderedList')}
          title="Numbered List"
        >
          1.
        </button>
        <div className={styles.toolbarSeparator}></div>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => applyFormat('removeFormat')}
          title="Clear Formatting"
        >
          Clear
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        className={classNames(styles.editor, {
          [styles.focused]: isFocused,
          [styles.empty]: !value || stripHtml(value).trim() === ''
        })}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  );
};

const AddEditBlogModal = ({ isOpen, onClose, onSave, blog, mode }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    author: '',
    status: 'draft',
    featuredImage: ''
  });

  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (blog && mode === 'edit') {
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        content: blog.content || '',
        author: blog.author || '',
        status: blog.status || 'draft',
        featuredImage: blog.featuredImage || ''
      });
      setCharCount(blog.charCount || 0);
      setWordCount(blog.wordCount || 0);
      setImagePreviewUrl(blog.featuredImage || '');
      setIsSlugManuallyEdited(true);
      setSelectedImageFile(null);
    } else if (mode === 'add') {
      setFormData({
        title: '',
        slug: '',
        content: '',
        author: authors[0] || '',
        status: 'draft',
        featuredImage: ''
      });
      setCharCount(0);
      setWordCount(0);
      setImagePreviewUrl('');
      setIsSlugManuallyEdited(false);
      setSelectedImageFile(null);
    }
    setErrors({});
  }, [blog, mode, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from title if not manually edited
    if (field === 'title' && !isSlugManuallyEdited) {
      const newSlug = generateSlug(value);
      setFormData(prev => ({
        ...prev,
        slug: newSlug
      }));
    }

    // Update character and word counts for content
    if (field === 'content') {
      const chars = countCharacters(value);
      const words = countWords(value);
      setCharCount(chars);
      setWordCount(words);
    }

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSlugChange = (value) => {
    setIsSlugManuallyEdited(true);
    handleInputChange('slug', value);
  };

  const handleStatusToggle = () => {
    const newStatus = formData.status === 'published' ? 'draft' : 'published';
    handleInputChange('status', newStatus);
  };

  // Image handling functions
  const handleImageSelect = (file) => {
    const validation = validateBlogImage(file);
    
    if (!validation.valid) {
      setErrors(prev => ({
        ...prev,
        featuredImage: validation.error
      }));
      return;
    }

    setSelectedImageFile(file);
    const preview = getBlogImagePreview(file);
    setImagePreviewUrl(preview);
    
    if (errors.featuredImage) {
      setErrors(prev => ({
        ...prev,
        featuredImage: ''
      }));
    }
  };

  const handleImageInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleImageDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleImageDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImagePreviewUrl('');
    setFormData(prev => ({
      ...prev,
      featuredImage: ''
    }));
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const validation = validateBlogData({
      ...formData,
      charCount,
      wordCount
    });

    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const blogData = {
        ...formData,
        charCount,
        wordCount,
        featuredImage: selectedImageFile ? getBlogImagePreview(selectedImageFile) : formData.featuredImage
      };
      
      if (mode === 'edit' && blog) {
        blogData.id = blog.id;
      }
      
      onSave(blogData);
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <FiFileText className={styles.modalIcon} />
            {mode === 'add' ? 'Add Blog' : 'Edit Blog'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              {/* Blog Title */}
              <div className={classNames(styles.formGroup, styles.fullWidth)}>
                <label className={styles.formLabel}>
                  <FiFileText className={styles.labelIcon} />
                  Blog Title *
                </label>
                <input
                  type="text"
                  className={classNames(styles.formInput, {
                    [styles.error]: errors.title
                  })}
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter blog title"
                />
                {errors.title && (
                  <span className={styles.errorText}>{errors.title}</span>
                )}
              </div>

              {/* Slug */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FiLink className={styles.labelIcon} />
                  Slug *
                </label>
                <input
                  type="text"
                  className={classNames(styles.formInput, {
                    [styles.error]: errors.slug
                  })}
                  value={formData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="url-friendly-slug"
                />
                {errors.slug && (
                  <span className={styles.errorText}>{errors.slug}</span>
                )}
              </div>

              {/* Author */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FiUser className={styles.labelIcon} />
                  Author *
                </label>
                <select
                  className={classNames(styles.formInput, {
                    [styles.error]: errors.author
                  })}
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                >
                  {authors.map(author => (
                    <option key={author} value={author}>
                      {author}
                    </option>
                  ))}
                </select>
                {errors.author && (
                  <span className={styles.errorText}>{errors.author}</span>
                )}
              </div>

              {/* Featured Image */}
              <div className={classNames(styles.formGroup, styles.fullWidth, styles.imageGroup)}>
                <label className={styles.formLabel}>
                  <FiImage className={styles.labelIcon} />
                  Featured Image
                </label>
                <div className={styles.imageUploadContainer}>
                  {imagePreviewUrl ? (
                    <div className={styles.imagePreviewContainer}>
                      <img 
                        src={imagePreviewUrl} 
                        alt="Featured image preview" 
                        className={styles.imagePreview}
                      />
                      <div className={styles.imageOverlay}>
                        <button
                          type="button"
                          className={styles.changeImageButton}
                          onClick={() => imageInputRef.current?.click()}
                        >
                          <FiCamera />
                        </button>
                        <button
                          type="button"
                          className={styles.removeImageButton}
                          onClick={handleRemoveImage}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={classNames(styles.imageUploadArea, {
                        [styles.dragOver]: isDragOver,
                        [styles.error]: errors.featuredImage
                      })}
                      onDragOver={handleImageDragOver}
                      onDragLeave={handleImageDragLeave}
                      onDrop={handleImageDrop}
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <div className={styles.uploadContent}>
                        <FiUpload className={styles.uploadIcon} />
                        <span className={styles.uploadText}>
                          Drag & drop an image or click to browse
                        </span>
                        <span className={styles.uploadSubtext}>
                          JPEG, PNG, WebP up to 5MB (Optional)
                        </span>
                      </div>
                    </div>
                  )}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageInputChange}
                    className={styles.hiddenFileInput}
                  />
                </div>
                {errors.featuredImage && (
                  <span className={styles.errorText}>{errors.featuredImage}</span>
                )}
              </div>

              {/* Content */}
              <div className={classNames(styles.formGroup, styles.fullWidth, styles.contentGroup)}>
                <label className={styles.formLabel}>
                  Blog Content *
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => handleInputChange('content', value)}
                  maxWords={1000}
                  placeholder="Write your blog content here..."
                />
                
                {/* Word Count */}
                <div className={styles.contentStats}>
                  <span className={classNames(styles.wordCount, {
                    [styles.warning]: wordCount > 800,
                    [styles.error]: wordCount >= 1000
                  })}>
                    {wordCount} / 1000 words
                  </span>
                </div>
                
                {errors.content && (
                  <span className={styles.errorText}>{errors.content}</span>
                )}
              </div>

              {/* Status Toggle */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Status
                </label>
                <div className={styles.statusToggle}>
                  <button
                    type="button"
                    className={classNames(styles.toggleButton, {
                      [styles.active]: formData.status === 'published'
                    })}
                    onClick={handleStatusToggle}
                  >
                    {formData.status === 'published' ? (
                      <FiToggleRight className={styles.toggleIcon} />
                    ) : (
                      <FiToggleLeft className={styles.toggleIcon} />
                    )}
                    <span className={styles.toggleLabel}>
                      {formData.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Blog Preview */}
            {formData.content && (
              <div className={styles.previewSection}>
                <h4 className={styles.previewTitle}>Content Preview</h4>
                <div 
                  className={styles.previewContent}
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                />
              </div>
            )}
          </form>
        </div>

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <button
            type="button"
            className={classNames(styles.modalButton, styles.cancelButton)}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={classNames(styles.modalButton, styles.saveButton)}
            onClick={handleSubmit}
            disabled={!formData.title || !formData.content || wordCount > 1000}
          >
            {mode === 'add' ? 'Create Blog' : 'Update Blog'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditBlogModal;