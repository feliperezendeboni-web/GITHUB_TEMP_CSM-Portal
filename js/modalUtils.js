window.ModalUtils = {
    // Basic Alert
    showAlert: function (message, title = null) {
        return new Promise((resolve) => {
            this._createModal({
                title: title || (window.t ? window.t('alertTitle') : 'Aviso'),
                content: message,
                buttons: [
                    {
                        text: 'OK',
                        class: 'btn-primary',
                        onClick: () => resolve(true)
                    }
                ]
            });
        });
    },

    // Confirm Dialog
    showConfirm: function (message, onConfirm, title = null) {
        // Support both callback and Promise
        if (onConfirm && typeof onConfirm === 'function') {
            this._createModal({
                title: title || (window.t ? window.t('confirmAction') : 'Confirmação'),
                content: message,
                buttons: [
                    {
                        text: window.t ? window.t('cancel') : 'Cancelar',
                        class: 'btn-secondary',
                        onClick: () => { /* Just close */ }
                    },
                    {
                        text: window.t ? window.t('confirm') : 'Confirmar',
                        class: 'btn-primary',
                        onClick: onConfirm
                    }
                ]
            });
        } else {
            return new Promise((resolve) => {
                this._createModal({
                    title: title || (window.t ? window.t('confirmAction') : 'Confirmação'),
                    content: message,
                    buttons: [
                        {
                            text: window.t ? window.t('cancel') : 'Cancelar',
                            class: 'btn-secondary',
                            onClick: () => resolve(false)
                        },
                        {
                            text: window.t ? window.t('confirm') : 'Confirmar',
                            class: 'btn-primary',
                            onClick: () => resolve(true)
                        }
                    ]
                });
            });
        }
    },

    // Toast Notification
    showToast: function (message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            // Ensure z-index is high
            container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 10000;';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast show';
        toast.textContent = message;

        // Inline styles for reliability if CSS is missing
        toast.style.cssText = `
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 12px 24px;
            margin-top: 10px;
            border-radius: 8px;
            border-left: 5px solid ${type === 'error' ? '#FF4136' : (type === 'success' ? '#2ECC40' : '#0074D9')};
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-family: sans-serif;
            min-width: 200px;
            transition: opacity 0.3s, transform 0.3s;
            animation: slideIn 0.3s;
        `;

        container.appendChild(toast);

        // Hide after 3s
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => {
                if (toast.parentElement) toast.parentElement.removeChild(toast);
            }, 300);
        }, 4000);
    },

    // Internal helper to render modal
    _createModal: function (options) {
        // Remove existing modals
        const existing = document.querySelectorAll('.custom-modal-overlay');
        existing.forEach(el => el.remove());

        const overlay = document.createElement('div');
        overlay.className = 'custom-modal-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 9999;
            display: flex; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.3s ease;
        `;

        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.style.cssText = `
            background: rgba(16, 28, 68, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 30px;
            min-width: 400px;
            max-width: 90%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            transform: translateY(20px);
            transition: transform 0.3s ease;
            text-align: center;
        `;

        // Title
        if (options.title) {
            const h3 = document.createElement('h3');
            h3.textContent = options.title;
            h3.style.cssText = 'color: white; margin-top: 0; margin-bottom: 15px; font-size: 1.4rem;';
            modal.appendChild(h3);
        }

        // Content
        const p = document.createElement('div');
        p.innerHTML = options.content; // Allow HTML
        p.style.cssText = 'color: rgba(255,255,255,0.9); margin-bottom: 30px; line-height: 1.5; font-size: 1.1rem;';
        modal.appendChild(p);

        // Buttons
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = 'display: flex; justify-content: center; gap: 15px;';

        options.buttons.forEach(btnConfig => {
            const btn = document.createElement('button');
            btn.textContent = btnConfig.text;
            btn.className = `btn-premium ${btnConfig.class || ''}`; // Reuse existing premium classes
            btn.style.minWidth = '120px';

            // Apply specific styles based on class pseudo-imitation if needed, 
            // but relying on main.css 'btn-premium' is better. 
            // We'll add some inline defaults to ensure visibility.
            if (btnConfig.class === 'btn-secondary') {
                btn.style.background = 'transparent';
                btn.style.border = '1px solid rgba(255,255,255,0.3)';
            } else {
                btn.style.background = 'var(--status-blue, #00A3C4)';
                btn.style.border = 'none';
            }

            btn.style.color = 'white';
            btn.style.padding = '10px 20px';
            btn.style.borderRadius = '6px';
            btn.style.cursor = 'pointer';

            btn.onclick = () => {
                if (btnConfig.onClick) btnConfig.onClick();
                closeModal();
            };
            btnContainer.appendChild(btn);
        });

        modal.appendChild(btnContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Animate in
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            modal.style.transform = 'translateY(0)';
        });

        function closeModal() {
            overlay.style.opacity = '0';
            modal.style.transform = 'translateY(20px)';
            setTimeout(() => overlay.remove(), 300);
        }

        // Close on click outside (optional, maybe safer to force choice?)
        // Let's allow click outside to cancel if it's not strictly blocking
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                // If there's a cancel button, treat as cancel, otherwise just close
                const cancelBtn = options.buttons.find(b => b.class === 'btn-secondary');
                if (cancelBtn && cancelBtn.onClick) cancelBtn.onClick();
                closeModal();
            }
        };
    }
};

// Global shortcuts
window.showAlert = window.ModalUtils.showAlert.bind(window.ModalUtils);
window.showConfirm = window.ModalUtils.showConfirm.bind(window.ModalUtils);
window.showToast = window.ModalUtils.showToast.bind(window.ModalUtils);
