// Main Application Controller for Village Volunteer Portal
class VillageVolunteerPortal {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'dashboard';
        this.currentVillage = null;
        this.requirements = JSON.parse(localStorage.getItem('village_requirements')) || [];
        this.surveys = JSON.parse(localStorage.getItem('village_surveys')) || [];
        this.villageData = JSON.parse(localStorage.getItem('village_data')) || {};
        this.init();
    }

    init() {
        this.checkLoginStatus();
        this.setupEventListeners();
        this.loadSampleData();
        
        console.log('🚀 PM-AJAY Village Volunteer Portal Initialized');
    }

    checkLoginStatus() {
        const savedUser = localStorage.getItem('current_village_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.currentVillage = JSON.parse(localStorage.getItem('current_village_data'));
            this.showMainApp();
        }
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Requirement forms
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'new-requirement-form') {
                e.preventDefault();
                this.submitNewRequirement();
            }
            if (e.target.id === 'issue-report-form') {
                e.preventDefault();
                this.submitIssueReport();
            }
            if (e.target.id === 'survey-upload-form') {
                e.preventDefault();
                this.submitSurveyData();
            }
        });

        // File upload preview
        const surveyFile = document.getElementById('survey-file');
        if (surveyFile) {
            surveyFile.addEventListener('change', (e) => {
                this.previewFile(e.target.files[0]);
            });
        }
    }

    handleLogin() {
        const villageName = document.getElementById('village-name').value;
        const password = document.getElementById('password').value;

        if (villageName && password) {
            this.currentUser = {
                villageName: villageName,
                loginTime: new Date().toISOString(),
                role: 'volunteer'
            };

            this.currentVillage = this.getVillageData(villageName);
            
            localStorage.setItem('current_village_user', JSON.stringify(this.currentUser));
            localStorage.setItem('current_village_data', JSON.stringify(this.currentVillage));
            
            this.showMainApp();
        } else {
            alert('Please enter village name and password.');
        }
    }

    loginAsDemo() {
        this.currentUser = {
            villageName: 'Demo Village',
            loginTime: new Date().toISOString(),
            role: 'volunteer'
        };

        this.currentVillage = {
            name: 'Demo Village',
            gramPanchayat: 'Demo Gram Panchayat',
            district: 'Sample District',
            state: 'Sample State',
            population: 1250,
            scPopulation: 680,
            scPercentage: 54.4,
            committee: [
                { name: 'Rajesh Kumar', designation: 'Sarpanch', phone: '9876543210' },
                { name: 'Priya Singh', designation: 'Volunteer', phone: '9876543211' }
            ]
        };

        localStorage.setItem('current_village_user', JSON.stringify(this.currentUser));
        localStorage.setItem('current_village_data', JSON.stringify(this.currentVillage));
        
        this.showMainApp();
    }

    getVillageData(villageName) {
        return {
            name: villageName,
            gramPanchayat: `${villageName} Gram Panchayat`,
            district: 'Sample District',
            state: 'Sample State',
            population: 1200,
            scPopulation: 650,
            scPercentage: 54.2,
            committee: [
                { name: 'Committee Member 1', designation: 'Sarpanch', phone: '9876543210' },
                { name: 'Committee Member 2', designation: 'Volunteer', phone: '9876543211' }
            ]
        };
    }

    showMainApp() {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        
        this.updateVillageInfo();
        this.showSection('dashboard');
        this.loadDashboard();
    }

    logout() {
        this.currentUser = null;
        this.currentVillage = null;
        localStorage.removeItem('current_village_user');
        localStorage.removeItem('current_village_data');
        
        document.getElementById('login-page').style.display = 'block';
        document.getElementById('main-app').style.display = 'none';
        
        document.getElementById('login-form').reset();
    }

    updateVillageInfo() {
        if (this.currentVillage) {
            document.getElementById('current-village-name').textContent = this.currentVillage.name;
            document.getElementById('dashboard-village-name').textContent = this.currentVillage.name;
            
            document.getElementById('profile-village-name').textContent = this.currentVillage.name;
            document.getElementById('profile-gram-panchayat').textContent = this.currentVillage.gramPanchayat;
            document.getElementById('profile-district').textContent = this.currentVillage.district;
            document.getElementById('profile-population').textContent = this.currentVillage.population;
            document.getElementById('profile-sc-population').textContent = `${this.currentVillage.scPopulation} (${this.currentVillage.scPercentage}%)`;
            
            const committeeList = document.getElementById('committee-members-list');
            if (committeeList && this.currentVillage.committee) {
                committeeList.innerHTML = this.currentVillage.committee.map(member => `
                    <div class="committee-member-item">
                        <strong>${member.name}</strong>
                        <div>${member.designation}</div>
                        <div class="phone">${member.phone}</div>
                    </div>
                `).join('');
            }
        }
    }

    showSection(sectionName) {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;

            const correspondingLink = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }

            this.loadSectionContent(sectionName);
        }
    }

    loadSectionContent(sectionName) {
        switch(sectionName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'village-profile':
                this.loadVillageProfile();
                break;
            case 'infrastructure-assessment':
                this.loadInfrastructureAssessment();
                break;
            case 'household-survey':
                this.loadHouseholdSurvey();
                break;
        }
    }

    loadDashboard() {
        this.updateDashboardStats();
        this.loadRecentActivity();
        this.loadRequirementsStatus();
    }

    updateDashboardStats() {
        const totalRequirements = this.requirements.length;
        const approvedRequirements = this.requirements.filter(r => r.status === 'approved').length;
        const ongoingProjects = this.requirements.filter(r => r.status === 'implementation').length;
        const completedSurveys = this.surveys.length;

        document.getElementById('total-requirements').textContent = totalRequirements;
        document.getElementById('approved-requirements').textContent = approvedRequirements;
        document.getElementById('ongoing-projects').textContent = ongoingProjects;
        document.getElementById('household-surveys').textContent = completedSurveys;
    }

    loadRecentActivity() {
        const activityContainer = document.getElementById('recent-activity');
        if (!activityContainer) return;

        const activities = [
            {
                title: 'New Requirement Submitted',
                description: 'Road repair requirement sent to admin',
                time: '2 hours ago',
                type: 'requirement'
            },
            {
                title: 'Survey Data Uploaded',
                description: 'Household survey data submitted for analysis',
                time: '1 day ago',
                type: 'survey'
            },
            {
                title: 'Requirement Approved',
                description: 'Water supply project approved by admin',
                time: '3 days ago',
                type: 'approval'
            }
        ];

        this.requirements.slice(0, 3).forEach(req => {
            activities.unshift({
                title: `Requirement: ${req.title}`,
                description: req.description.substring(0, 50) + '...',
                time: this.formatTimeAgo(new Date(req.submittedAt)),
                type: 'requirement'
            });
        });

        activityContainer.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-desc">${activity.description}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');
    }

    loadRequirementsStatus() {
        const container = document.getElementById('requirements-status');
        if (!container) return;

        const requirements = this.requirements.slice(0, 5);

        container.innerHTML = requirements.map(req => `
            <div class="requirement-item">
                <div class="requirement-header">
                    <div class="requirement-title">${req.title}</div>
                    <div class="requirement-status status-${req.status}">
                        ${this.getStatusText(req.status)}
                    </div>
                </div>
                <div class="requirement-desc">${req.description}</div>
                <div class="requirement-meta">
                    <span>Type: ${req.type}</span>
                    <span>Priority: ${req.priority}</span>
                    <span>Submitted: ${new Date(req.submittedAt).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    }

    loadVillageProfile() {
        this.updateProgressTracking();
        this.loadRequirementsDetails();
    }

    updateProgressTracking() {
        const submitted = this.requirements.length;
        const underReview = this.requirements.filter(r => r.status === 'review').length;
        const approved = this.requirements.filter(r => r.status === 'approved').length;
        const implementation = this.requirements.filter(r => r.status === 'implementation').length;
        const completed = this.requirements.filter(r => r.status === 'completed').length;

        document.getElementById('submitted-count').textContent = `${submitted} requirements sent to admin`;
        document.getElementById('review-count').textContent = `${underReview} requirements being reviewed`;
        document.getElementById('approved-count').textContent = `${approved} requirements approved`;
        document.getElementById('implementation-count').textContent = `${implementation} projects in progress`;
        document.getElementById('completed-count').textContent = `${completed} projects completed`;
    }

    loadRequirementsDetails() {
        const tbody = document.getElementById('requirements-details-body');
        if (!tbody) return;

        tbody.innerHTML = this.requirements.map(req => `
            <tr>
                <td>${req.title}</td>
                <td>${this.getTypeText(req.type)}</td>
                <td><span class="requirement-status status-${req.status}">${this.getStatusText(req.status)}</span></td>
                <td>${new Date(req.submittedAt).toLocaleDateString()}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${this.getProgressPercentage(req.status)}%"></div>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    loadInfrastructureAssessment() {
        this.loadCurrentRequirements();
    }

    loadCurrentRequirements() {
        const container = document.getElementById('current-requirements-list');
        if (!container) return;

        container.innerHTML = this.requirements.map(req => `
            <div class="requirement-item">
                <div class="requirement-header">
                    <div class="requirement-title">${req.title}</div>
                    <div class="requirement-status status-${req.status}">
                        ${this.getStatusText(req.status)}
                    </div>
                </div>
                <div class="requirement-desc">${req.description}</div>
                <div class="requirement-meta">
                    <span>Type: ${this.getTypeText(req.type)}</span>
                    <span>Priority: ${req.priority}</span>
                    <span>Submitted: ${new Date(req.submittedAt).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    }

    submitNewRequirement() {
        const title = document.getElementById('requirement-title').value;
        const type = document.getElementById('requirement-type').value;
        const description = document.getElementById('requirement-description').value;
        const priority = document.getElementById('requirement-priority').value;

        const requirement = {
            id: Date.now(),
            title,
            type,
            description,
            priority,
            status: 'pending',
            submittedAt: new Date().toISOString(),
            village: this.currentVillage.name
        };

        this.requirements.unshift(requirement);
        this.saveData();
        
        alert('Requirement submitted to admin successfully!');
        document.getElementById('new-requirement-form').reset();
        this.loadDashboard();
        this.loadInfrastructureAssessment();
    }

    submitIssueReport() {
        const title = document.getElementById('issue-title').value;
        const description = document.getElementById('issue-description').value;
        const location = document.getElementById('issue-location').value;

        const issue = {
            id: Date.now(),
            title: `Issue: ${title}`,
            type: 'infrastructure_issue',
            description: `Location: ${location}\n\n${description}`,
            priority: 'high',
            status: 'pending',
            submittedAt: new Date().toISOString(),
            village: this.currentVillage.name
        };

        this.requirements.unshift(issue);
        this.saveData();
        
        alert('Infrastructure issue reported to admin successfully!');
        document.getElementById('issue-report-form').reset();
        this.loadDashboard();
        this.loadInfrastructureAssessment();
    }

    submitSurveyData() {
        const fileInput = document.getElementById('survey-file');
        if (!fileInput.files.length) {
            alert('Please select an Excel file to upload.');
            return;
        }

        const survey = {
            id: Date.now(),
            fileName: fileInput.files[0].name,
            fileSize: (fileInput.files[0].size / 1024).toFixed(2) + ' KB',
            submittedAt: new Date().toISOString(),
            village: this.currentVillage.name,
            status: 'submitted'
        };

        this.surveys.unshift(survey);
        this.saveData();
        
        alert('Survey data submitted to admin for analysis! Our AI system will process the data and identify key requirements.');
        document.getElementById('survey-upload-form').reset();
        document.getElementById('file-preview').style.display = 'none';
        this.loadDashboard();
    }

    previewFile(file) {
        if (file) {
            const fileInfo = document.getElementById('file-info');
            const preview = document.getElementById('file-preview');
            
            fileInfo.innerHTML = `
                <div><strong>File Name:</strong> ${file.name}</div>
                <div><strong>File Size:</strong> ${(file.size / 1024).toFixed(2)} KB</div>
                <div><strong>File Type:</strong> ${file.type || 'Excel Spreadsheet'}</div>
            `;
            
            preview.style.display = 'block';
        }
    }

    addToInfrastructure() {
        alert('Requirement added to your local infrastructure list. Remember to submit to admin for approval.');
    }

    // Utility methods
    getStatusText(status) {
        const statusMap = {
            'pending': 'Pending',
            'review': 'Under Review',
            'approved': 'Approved',
            'implementation': 'Implementation',
            'completed': 'Completed'
        };
        return statusMap[status] || status;
    }

    getTypeText(type) {
        const typeMap = {
            'water': 'Drinking Water',
            'education': 'Education',
            'health': 'Healthcare',
            'road': 'Road Connectivity',
            'electricity': 'Electricity',
            'sanitation': 'Sanitation',
            'housing': 'Housing',
            'other': 'Other',
            'infrastructure_issue': 'Infrastructure Issue'
        };
        return typeMap[type] || type;
    }

    getProgressPercentage(status) {
        const progressMap = {
            'pending': 25,
            'review': 50,
            'approved': 75,
            'implementation': 90,
            'completed': 100
        };
        return progressMap[status] || 0;
    }

    formatTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    }

    saveData() {
        localStorage.setItem('village_requirements', JSON.stringify(this.requirements));
        localStorage.setItem('village_surveys', JSON.stringify(this.surveys));
        localStorage.setItem('village_data', JSON.stringify(this.villageData));
    }

    loadSampleData() {
        if (this.requirements.length === 0) {
            this.requirements = [
                {
                    id: 1,
                    title: 'New School Building',
                    type: 'education',
                    description: 'Require new school building with proper classrooms and facilities for 200 students',
                    priority: 'high',
                    status: 'approved',
                    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    village: 'Demo Village'
                },
                {
                    id: 2,
                    title: 'Road Repair Work',
                    type: 'road',
                    description: 'Main village road needs urgent repair before monsoon season',
                    priority: 'urgent',
                    status: 'implementation',
                    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    village: 'Demo Village'
                }
            ];
            this.saveData();
        }
    }
}

// Global functions
function showSection(sectionName) {
    if (window.app) {
        window.app.showSection(sectionName);
    }
}

function loginAsDemo() {
    if (window.app) {
        window.app.loginAsDemo();
    }
}

function logout() {
    if (window.app) {
        window.app.logout();
    }
}

function addToInfrastructure() {
    if (window.app) {
        window.app.addToInfrastructure();
    }
}

// Initialize application
let app;
document.addEventListener('DOMContentLoaded', function() {
    app = new VillageVolunteerPortal();
    window.app = app;
});
