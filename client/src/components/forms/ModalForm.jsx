import React, { useEffect, useRef } from 'react';

export default function ModalForm({
  open,
  title,
  onClose,
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  children,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleCancel = () => {
    if (typeof onClose === 'function') onClose();
  };

  const handleDialogCancel = (event) => {
    event.preventDefault();
    handleCancel();
  };

  const handleBackdropClick = (event) => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const rect = dialog.getBoundingClientRect();
    const withinDialog =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!withinDialog) {
      handleCancel();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="card w-full max-w-2xl p-0 backdrop:bg-black/40 backdrop:backdrop-blur-sm shadow-2xl rounded-2xl border border-default m-auto"
      onCancel={handleDialogCancel}
      onClick={handleBackdropClick}
      aria-label={title || 'Modal form'}
    >
      <form method="dialog" onSubmit={onSubmit} className="flex flex-col h-full">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-default bg-surface">
          <h2 className="text-xl font-bold text-primary tracking-wide">{title}</h2>
          <button
            type="button"
            className="text-muted hover:text-primary transition-colors text-sm font-medium tracking-wider uppercase flex items-center gap-2"
            onClick={handleCancel}
            aria-label="Close"
          >
            Close ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-6 bg-main">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 bg-surface border-t border-default flex items-center justify-end gap-4 rounded-b-2xl">
          <button 
            type="button" 
            className="px-6 py-2.5 rounded-lg text-muted hover:text-primary font-medium transition-colors" 
            onClick={handleCancel}
          >
            {cancelLabel}
          </button>
          <button 
            type="submit" 
            className="btn-primary px-8 py-2.5 font-medium shadow-md-token"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </dialog>
  );
}