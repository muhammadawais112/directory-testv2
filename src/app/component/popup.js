import React from "react";
import PropTypes from "prop-types";

const Modal = ({ isOpen, onClose, title, children, size, style }) => {
  if (!isOpen) return null;

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
        aria-hidden="true"
       />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 ${
              size || "container"
            }`}
            style={style}
          >
            {/* Header with Close Button */}
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="flex justify-between items-start">
                <h3
                  className="text-base font-semibold text-gray-900 uppercase"
                  id="modal-title"
                >
                  {title}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  aria-label="Close"
                >
                  Close
                </button>
              </div>
              <div className="mt-2">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
