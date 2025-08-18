import React, { useEffect, useRef } from 'react';
import { FiX, FiDownload } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './ImageModal.module.css';

const ImageModal = ({ isOpen, onClose, imageSrc, imageAlt = 'Image' }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = imageAlt || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className={classNames(styles.modalOverlay, { [styles.open]: isOpen })}>
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.modalHeader}>
          <div className={styles.modalActions}>
            <button
              className={styles.downloadButton}
              onClick={handleDownload}
              title="Download image"
            >
              <FiDownload />
            </button>
            <button
              className={styles.closeButton}
              onClick={onClose}
              title="Close modal"
            >
              <FiX />
            </button>
          </div>
        </div>
        
        <div className={styles.modalBody}>
          <img
            src={imageSrc}
            alt={imageAlt}
            className={styles.modalImage}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;