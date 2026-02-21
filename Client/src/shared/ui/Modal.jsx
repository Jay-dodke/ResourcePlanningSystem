const Modal = ({open, title, onClose, children, footer, hideClose = false, disableBackdropClose = false}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        className="absolute inset-0 bg-[color:rgb(var(--overlay)/0.55)]"
        aria-label="Close modal"
        onClick={disableBackdropClose ? undefined : onClose}
      />
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-default surface-card p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-primary">{title}</h3>
          </div>
          {hideClose ? null : (
            <button
              type="button"
              className="rounded-lg px-2 py-1 text-sm text-secondary hover:bg-[color:rgb(var(--surface-hover))] hover:text-primary"
              onClick={onClose}
            >
              Close
            </button>
          )}
        </div>
        <div className="mt-4">{children}</div>
        {footer ? <div className="mt-6 flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
};

export default Modal;



