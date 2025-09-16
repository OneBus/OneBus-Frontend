import React from 'react';
import styles from './Modal.module.css';
import { FaTimes } from 'react-icons/fa';

function Modal({ isOpen, onClose, children,showCloseButton = true }) {
  if (!isOpen) 
    return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        {showCloseButton && (
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        )}
        {children}
      </div>
    </div>
  );
}

export default Modal;