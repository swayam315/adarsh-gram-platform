// Village Volunteer Portal - Simplified Version
class VillagePortal {
    constructor() {
        this.currentUser = null;
        this.currentVillage = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkLoginStatus();
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

        // Requirement form
        const requirementForm = document.getElementById('requirement-form');
        if (requirementForm) {
            requirementForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitRequirement();
            });
        }

        // Survey form
        const surveyForm = document.getElementById('survey-form');
        if (surveyForm) {
            surveyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitSurvey();
            });
        }
    }

    checkLoginStatus() {
        const savedUser = localStorage.getItem('village_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.currentVillage = JSON.parse(localStorage.getItem('village_data'));
            this.showMainApp();
        }
    }

    handleLogin() {
        const villageName = document.getElementById('village-name').value;
        const password = document.getElementById('password').value;

        if (villageName && password) {
            this.currentUser = {
                villageName: villageName,
                loginTime: new Date().toISOString()
            };

            this.currentVillage = {
                name: villageName,
                gramPanchayat: `${villageName} Gram Panchayat`,
                district: 'Sample District',
                state: 'Sample State'
            };
            
            localStorage.setItem('village_user', JSON.stringify(this.currentUser));
            localStorage.setItem('village_data', JSON.stringify(this.currentVillage));
            
            this.showMainApp();
        } else {
            alert('Please enter village name and password.');
        }
    }

    loginAsDemo() {
        this.currentUser = {
            villageName: 'Demo Village',
            loginTime: new Date().toISOString()
        };

        this.currentVillage = {
            name: 'Demo Village',
            gramPanchayat: 'Demo Gram Panchayat',
            district: 'Sample District',
            state: 'Sample State'
        };

        localStorage.setItem('village_user', JSON.stringify(this.currentUser));
        localStorage.setItem('village_data', JSON.stringify(this.currentVillage));
        
        this.showMainApp();
    }

    showMainApp() {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        
        this.updateVillageInfo();
        this.showSection('dashboard');
    }

    logout() {
        this.currentUser = null;
        this.currentVillage = null;
        localStorage.removeItem('village_user');
        localStorage.removeItem('village_data');
        
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
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Add active class to corresponding nav link
        const correspondingLink = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
        if (correspondingLink) {
            correspondingLink.classList.add('active');
        }
    }

    submitRequirement() {
        const title = document.getElementById('req-title').value;
        const description = document.getElementById('req-desc').value;

        if (title && description) {
            alert('Requirement submitted to admin successfully!');
            document.getElementById('requirement-form').reset();
            
            // Update activity
            this.addActivity(`New requirement submitted: ${title}`);
        } else {
            alert('Please fill all fields.');
        }
    }

    submitSurvey() {
        const fileInput = document.getElementById('survey-file');
        if (fileInput.files.length === 0) {
            alert('Please select an Excel file to upload.');
            return;
        }

        alert('Survey data submitted to admin for analysis!');
        document.getElementById('survey-form').reset();
        
        // Update activity
        this.addActivity('Household survey data uploaded');
    }

    addActivity(message) {
        const activityContainer = document.getElementById('recent-activity');
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-title">${message}</div>
            <div class="activity-time">Just now</div>
        `;
        activityContainer.insertBefore(activityItem, activityContainer.firstChild);
    }
}

// Global functions
function showSection(sectionName) {
    if (window.portal) {
        window.portal.showSection(sectionName);
    }
}

function loginAsDemo() {
    if (window.portal) {
        window.portal.loginAsDemo();
    }
}

function logout() {
    if (window.portal) {
        window.portal.logout();
    }
}

// Initialize portal
let portal;
document.addEventListener('DOMContentLoaded', function() {
    portal = new VillagePortal();
    window.portal = portal;
});
