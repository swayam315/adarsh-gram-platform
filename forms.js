// Forms Management System
class FormsManager {
    constructor(app) {
        this.app = app;
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
    }

    // Infrastructure Assessment Form (Format-2 & Format-4)
    loadInfrastructureAssessment() {
        const container = document.getElementById('infrastructure-assessment');
        if (!container) return;

        container.innerHTML = `
            <div class="form-container">
                <div class="form-progress">
                    <h3>Infrastructure Gap Assessment & Action Plan</h3>
                    <p>Format-2: Infrastructure Requirements | Format-4: Estimated Action Plan</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: 33%"></div>
                    </div>
                </div>

                <div class="form-steps-container">
                    <div class="form-step active" data-step="1">
                        <div class="step-indicator">1</div>
                        <div class="step-label">Basic Info</div>
                    </div>
                    <div class="form-step" data-step="2">
                        <div class="step-indicator">2</div>
                        <div class="step-label">Gap Assessment</div>
                    </div>
                    <div class="form-step" data-step="3">
                        <div class="step-indicator">3</div>
                        <div class="step-label">Action Plan</div>
                    </div>
                </div>

                <form id="infrastructure-form">
                    <!-- Step 1: Basic Information -->
                    <div class="form-step-content active" data-step="1">
                        <div class="form-section-card">
                            <div class="form-section-header">
                                <h3><i class="fas fa-info-circle"></i> Assessment Basic Information</h3>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group-enhanced">
                                    <label for="assessment-village">Select Village *</label>
                                    <select id="assessment-village" class="form-control" required>
                                        <option value="">Select Village</option>
                                        ${this.app.villages.map(v => `<option value="${v.id}">${v.name}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-group-enhanced">
                                    <label for="assessment-date">Assessment Date *</label>
                                    <input type="date" id="assessment-date" class="form-control" required>
                                </div>
                            </div>

                            <div class="form-group-enhanced">
                                <label for="assessing-officer">Assessing Officer *</label>
                                <input type="text" id="assessing-officer" class="form-control" required>
                            </div>
                        </div>

                        <div class="form-actions-enhanced">
                            <button type="button" class="btn btn-secondary" onclick="this.saveDraft()">
                                <i class="fas fa-save"></i> Save Draft
                            </button>
                            <button type="button" class="btn btn-primary" onclick="formsManager.nextStep()">
                                Next <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Step 2: Gap Assessment -->
                    <div class="form-step-content" data-step="2">
                        <div class="form-section-card">
                            <div class="form-section-header">
                                <h3><i class="fas fa-clipboard-check"></i> Infrastructure Gap Assessment</h3>
                                <p>Format-2: Assess current infrastructure status and gaps</p>
                            </div>

                            ${this.generateInfrastructureSections()}
                        </div>

                        <div class="form-actions-enhanced">
                            <button type="button" class="btn btn-secondary" onclick="formsManager.previousStep()">
                                <i class="fas fa-arrow-left"></i> Previous
                            </button>
                            <button type="button" class="btn btn-primary" onclick="formsManager.nextStep()">
                                Next <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Step 3: Action Plan -->
                    <div class="form-step-content" data-step="3">
                        <div class="form-section-card">
                            <div class="form-section-header">
                                <h3><i class="fas fa-tasks"></i> Estimated Action Plan</h3>
                                <p>Format-4: Proposed interventions and estimated costs</p>
                            </div>

                            <div id="action-plan-items">
                                <!-- Action plan items will be generated here -->
                            </div>

                            <button type="button" class="btn btn-secondary" onclick="formsManager.addActionItem()">
                                <i class="fas fa-plus"></i> Add Action Item
                            </button>
                        </div>

                        <div class="form-actions-enhanced">
                            <button type="button" class="btn btn-secondary" onclick="formsManager.previousStep()">
                                <i class="fas fa-arrow-left"></i> Previous
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-paper-plane"></i> Submit Assessment
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        `;

        this.attachFormHandlers();
    }

    generateInfrastructureSections() {
        const sections = [
            {
                title: 'Road Connectivity',
                fields: [
                    { name: 'road-existing', label: 'Existing Road Length (km)', type: 'number' },
                    { name: 'road-required', label: 'Required Road Length (km)', type: 'number' },
                    { name: 'road-condition', label: 'Current Condition', type: 'select', options: ['Good', 'Fair', 'Poor', 'No Road'] }
                ]
            },
            {
                title: 'Drinking Water',
                fields: [
                    { name: 'water-source', label: 'Primary Water Source', type: 'select', options: ['Tap', 'Handpump', 'Well', 'Other'] },
                    { name: 'water-coverage', label: 'Households with Access (%)', type: 'number' },
                    { name: 'water-quality', label: 'Water Quality', type: 'select', options: ['Good', 'Fair', 'Poor'] }
                ]
            },
            {
                title: 'Education Facilities',
                fields: [
                    { name: 'school-primary', label: 'Primary Schools', type: 'number' },
                    { name: 'school-middle', label: 'Middle Schools', type: 'number' },
                    { name: 'school-high', label: 'High Schools', type: 'number' }
                ]
            }
        ];

        return sections.map(section => `
            <div class="form-subsection">
                <h4>${section.title}</h4>
                <div class="form-row">
                    ${section.fields.map(field => `
                        <div class="form-group-enhanced">
                            <label for="${field.name}">${field.label}</label>
                            ${field.type === 'select' ? `
                                <select id="${field.name}" class="form-control">
                                    <option value="">Select</option>
                                    ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                                </select>
                            ` : `
                                <input type="${field.type}" id="${field.name}" class="form-control">
                            `}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    // Household Survey Form (Format-3A & Format-3B)
    loadHouseholdSurvey() {
        const container = document.getElementById('household-survey');
        if (!container) return;

        container.innerHTML = `
            <div class="form-container">
                <div class="form-progress">
                    <h3>Household Survey & Beneficiary Mapping</h3>
                    <p>Format-3A: Individual Needs Assessment | Format-3B: Scheme Mapping</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: 50%"></div>
                    </div>
                </div>

                <div class="form-tabs">
                    <button class="form-tab active" onclick="formsManager.switchSurveyTab('format3a')">
                        Format-3A: Needs Assessment
                    </button>
                    <button class="form-tab" onclick="formsManager.switchSurveyTab('format3b')">
                        Format-3B: Scheme Mapping
                    </button>
                </div>

                <div class="form-tab-content active" id="format3a-content">
                    <form id="household-survey-form">
                        <div class="form-section-card">
                            <div class="form-section-header">
                                <h3><i class="fas fa-house-user"></i> Household Basic Information</h3>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group-enhanced">
                                    <label for="survey-village">Select Village *</label>
                                    <select id="survey-village" class="form-control" required>
                                        <option value="">Select Village</option>
                                        ${this.app.villages.map(v => `<option value="${v.id}">${v.name}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-group-enhanced">
                                    <label for="household-id">Household ID *</label>
                                    <input type="text" id="household-id" class="form-control" required>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group-enhanced">
                                    <label for="head-name">Head of Household *</label>
                                    <input type="text" id="head-name" class="form-control" required>
                                </div>
                                <div class="form-group-enhanced">
                                    <label for="family-members">Family Members *</label>
                                    <input type="number" id="family-members" class="form-control" required>
                                </div>
                            </div>
                        </div>

                        <div class="form-actions-enhanced">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-paper-plane"></i> Submit Survey
                            </button>
                        </div>
                    </form>
                </div>

                <div class="form-tab-content" id="format3b-content">
                    <div class="form-section-card">
                        <h3>Scheme Mapping & Convergence</h3>
                        <p>Map households to relevant government schemes</p>
                        <!-- Scheme mapping content -->
                    </div>
                </div>
            </div>
        `;

        this.attachSurveyHandlers();
    }

    // Form Navigation Methods
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

    switchSurveyTab(tabName) {
        // Update tabs
        document.querySelectorAll('.form-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[onclick="formsManager.switchSurveyTab('${tabName}')"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.form-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-content`).classList.add('active');
    }

    attachFormHandlers() {
        const form = document.getElementById('infrastructure-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitInfrastructureAssessment();
            });
        }

        const surveyForm = document.getElementById('household-survey-form');
        if (surveyForm) {
            surveyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitHouseholdSurvey();
            });
        }
    }

    attachSurveyHandlers() {
        // Additional survey-specific handlers
    }

    submitInfrastructureAssessment() {
        const formData = this.collectFormData('infrastructure-form');
        
        // Save assessment data
        const assessment = {
            id: Date.now(),
            villageId: document.getElementById('assessment-village').value,
            date: document.getElementById('assessment-date').value,
            officer: document.getElementById('assessing-officer').value,
            data: formData,
            submittedAt: new Date().toISOString()
        };

        this.app.projects.push({
            id: Date.now(),
            type: 'infrastructure-assessment',
            villageId: assessment.villageId,
            status: 'completed',
            data: assessment,
            createdAt: new Date().toISOString()
        });

        this.app.saveToStorage();
        
        alert('Infrastructure assessment submitted successfully!');
        this.app.showSection('dashboard');
        this.app.loadDashboard();
    }

    submitHouseholdSurvey() {
        const formData = this.collectFormData('household-survey-form');
        
        const household = {
            id: Date.now(),
            villageId: document.getElementById('survey-village').value,
            householdId: document.getElementById('household-id').value,
            headName: document.getElementById('head-name').value,
            familyMembers: parseInt(document.getElementById('family-members').value),
            surveyData: formData,
            surveyedAt: new Date().toISOString()
        };

        this.app.households.push(household);
        this.app.saveToStorage();
        
        alert('Household survey submitted successfully!');
        this.app.showSection('dashboard');
        this.app.loadDashboard();
    }

    collectFormData(formId) {
        const form = document.getElementById(formId);
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    addActionItem() {
        const container = document.getElementById('action-plan-items');
        const itemId = Date.now();
        
        const itemHTML = `
            <div class="dynamic-item" id="action-item-${itemId}">
                <div class="dynamic-item-header">
                    <div class="dynamic-item-title">Action Item</div>
                    <button type="button" class="remove-item" onclick="formsManager.removeActionItem(${itemId})">
                        <i class="fas fa-times"></i> Remove
                    </button>
                </div>
                <div class="form-row">
                    <div class="form-group-enhanced">
                        <label>Activity Description</label>
                        <input type="text" name="activity-desc-${itemId}" class="form-control" required>
                    </div>
                    <div class="form-group-enhanced">
                        <label>Estimated Cost (₹)</label>
                        <input type="number" name="activity-cost-${itemId}" class="form-control" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group-enhanced">
                        <label>Timeline (Months)</label>
                        <input type="number" name="activity-timeline-${itemId}" class="form-control" required>
                    </div>
                    <div class="form-group-enhanced">
                        <label>Responsible Department</label>
                        <select name="activity-dept-${itemId}" class="form-control" required>
                            <option value="">Select Department</option>
                            <option value="rural-development">Rural Development</option>
                            <option value="education">Education</option>
                            <option value="health">Health</option>
                            <option value="water">Water Resources</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', itemHTML);
    }

    removeActionItem(itemId) {
        const item = document.getElementById(`action-item-${itemId}`);
        if (item) {
            item.remove();
        }
    }

    saveDraft() {
        // Save form data to localStorage as draft
        const formData = this.collectFormData('infrastructure-form');
        localStorage.setItem('infrastructure-draft', JSON.stringify({
            data: formData,
            currentStep: this.currentStep,
            savedAt: new Date().toISOString()
        }));
        
        alert('Draft saved successfully!');
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
