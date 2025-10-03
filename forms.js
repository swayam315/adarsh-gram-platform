// Forms Management System
class FormsManager {
    constructor(app) {
        this.app = app;
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
    }

    initializeForms() {
        this.setupFormValidation();
        this.setupFileUploads();
        this.loadFormTemplates();
    }

    setupFormValidation() {
        // Add real-time validation to all forms
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
            
            // Add input validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', this.validateField.bind(this));
                input.addEventListener('input', this.clearFieldError.bind(this));
            });
        });
    }

    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        const fieldName = field.name || field.id;

        // Clear previous errors
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid 10-digit phone number');
                return false;
            }
        }

        // Number validation
        if (field.type === 'number' && value) {
            if (field.min && parseFloat(value) < parseFloat(field.min)) {
                this.showFieldError(field, `Value must be at least ${field.min}`);
                return false;
            }
            if (field.max && parseFloat(value) > parseFloat(field.max)) {
                this.showFieldError(field, `Value must be at most ${field.max}`);
                return false;
            }
        }

        return true;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const inputs = form.querySelectorAll('input, select, textarea');
        let isValid = true;

        // Validate all fields
        inputs.forEach(input => {
            if (!this.validateField({ target: input })) {
                isValid = false;
            }
        });

        if (isValid) {
            this.submitForm(form);
        } else {
            this.showFormError(form, 'Please fix the errors above before submitting.');
        }
    }

    showFormError(form, message) {
        let errorElement = form.querySelector('.form-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error alert alert-error';
            form.insertBefore(errorElement, form.firstChild);
        }
        
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorElement.style.display = 'block';

        // Scroll to error
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    submitForm(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitButton.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;

            // Show success message
            this.showFormSuccess(form, 'Form submitted successfully!');
            
            // Reset form
            form.reset();
            
            // Update dashboard
            if (window.app) {
                window.app.loadDashboard();
            }
        }, 2000);
    }

    showFormSuccess(form, message) {
        let successElement = form.querySelector('.form-success');
        if (!successElement) {
            successElement = document.createElement('div');
            successElement.className = 'form-success alert alert-success';
            form.insertBefore(successElement, form.firstChild);
        }
        
        successElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        successElement.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 5000);
    }

    setupFileUploads() {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleFileSelect(e);
            });
            
            // Add drag and drop support
            const container = input.closest('.file-upload');
            if (container) {
                container.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    container.classList.add('dragover');
                });
                
                container.addEventListener('dragleave', (e) => {
                    e.preventDefault();
                    container.classList.remove('dragover');
                });
                
                container.addEventListener('drop', (e) => {
                    e.preventDefault();
                    container.classList.remove('dragover');
                    
                    if (e.dataTransfer.files.length) {
                        input.files = e.dataTransfer.files;
                        this.handleFileSelect({ target: input });
                    }
                });
            }
        });
    }

    handleFileSelect(e) {
        const fileInput = e.target;
        const file = fileInput.files[0];
        
        if (!file) return;

        // Validate file type
        const allowedTypes = fileInput.getAttribute('accept');
        if (allowedTypes && !this.isFileTypeAllowed(file, allowedTypes)) {
            this.showFieldError(fileInput, 'File type not allowed. Please select a valid file.');
            fileInput.value = '';
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            this.showFieldError(fileInput, 'File size too large. Please select a file smaller than 10MB.');
            fileInput.value = '';
            return;
        }

        // Show file preview
        this.showFilePreview(fileInput, file);
    }

    isFileTypeAllowed(file, allowedTypes) {
        const allowedExtensions = allowedTypes.split(',').map(ext => ext.trim());
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        return allowedExtensions.some(ext => {
            if (ext.startsWith('.')) {
                return ext.toLowerCase() === fileExtension;
            } else {
                return file.type.startsWith(ext.replace('/*', ''));
            }
        });
    }

    showFilePreview(fileInput, file) {
        // Remove existing preview
        const existingPreview = fileInput.parentNode.querySelector('.file-preview');
        if (existingPreview) {
            existingPreview.remove();
        }

        const preview = document.createElement('div');
        preview.className = 'file-preview';
        
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `
                    <div class="preview-image">
                        <img src="${e.target.result}" alt="Preview">
                        <div class="file-info">
                            <strong>${file.name}</strong>
                            <span>${this.formatFileSize(file.size)}</span>
                        </div>
                    </div>
                `;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = `
                <div class="preview-document">
                    <i class="fas fa-file"></i>
                    <div class="file-info">
                        <strong>${file.name}</strong>
                        <span>${this.formatFileSize(file.size)}</span>
                    </div>
                </div>
            `;
        }

        fileInput.parentNode.appendChild(preview);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    loadFormTemplates() {
        // This would load dynamic form templates in a real application
        console.log('Form templates loaded');
    }

    // Multi-step form navigation
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateStepDisplay();
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    updateStepDisplay() {
        // Update step indicators
        document.querySelectorAll('.form-step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
            step.classList.toggle('completed', index + 1 < this.currentStep);
        });

        // Update step content
        document.querySelectorAll('.form-step-content').forEach((content, index) => {
            content.classList.toggle('active', index + 1 === this.currentStep);
        });

        // Update progress bar
        const progressFill = document.querySelector('.progress-bar-fill');
        if (progressFill) {
            progressFill.style.width = `${(this.currentStep / this.totalSteps) * 100}%`;
        }
    }
}

// Initialize forms manager
let formsManager;
document.addEventListener('DOMContentLoaded', function() {
    if (window.app) {
        formsManager = new FormsManager(window.app);
        window.formsManager = formsManager;
    }
});

console.log('🚀 Forms Manager Loaded');
