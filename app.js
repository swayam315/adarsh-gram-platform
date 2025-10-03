// Main Application Controller
class AdarshGramPlatform {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'dashboard';
        this.villages = JSON.parse(localStorage.getItem('villages')) || [];
        this.households = JSON.parse(localStorage.getItem('households')) || [];
        this.projects = JSON.parse(localStorage.getItem('projects')) || [];
        this.monitoringData = JSON.parse(localStorage.getItem('monitoringData')) || [];
        this.init();
    }

    init() {
        this.loadDashboard();
        this.setupEventListeners();
        this.setupServiceWorker();
        this.loadSampleData();
        
        console.log('🚀 PM-AJAY Adarsh Gram Platform Initialized');
    }

    setupEventListeners() {
        // Admin login form
        const loginForm = document.getElementById('admin-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAdminLogin();
            });
        }

        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link') || e.target.closest('.nav-link')) {
                e.preventDefault();
                const link = e.target.matches('.nav-link') ? e.target : e.target.closest('.nav-link');
                const section = link.getAttribute('onclick')?.match(/showSection\('([^']+)'\)/)?.[1];
                if (section) {
                    this.showSection(section);
                }
            }
        });
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
            this.currentSection = sectionName;

            // Add active class to corresponding nav link
            const correspondingLink = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }

            // Load section-specific content
            this.loadSectionContent(sectionName);
        }
    }

    loadSectionContent(sectionName) {
        switch(sectionName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'village-profile':
                this.loadVillageProfileForm();
                break;
            case 'infrastructure-assessment':
                this.loadInfrastructureAssessment();
                break;
            case 'household-survey':
                this.loadHouseholdSurvey();
                break;
            case 'vdp':
                this.loadVDPForm();
                break;
            case 'monitoring':
                this.loadMonitoringDashboard();
                break;
        }
    }

    loadDashboard() {
        this.updateDashboardStats();
        this.loadRecentActivity();
        this.initializeProgressMap();
    }

    updateDashboardStats() {
        const totalVillages = this.villages.length;
        const adarshGrams = this.villages.filter(v => v.status === 'adarsh-gram').length;
        const ongoingProjects = this.projects.filter(p => p.status === 'in-progress').length;
        const totalBeneficiaries = this.households.reduce((sum, h) => sum + (h.familyMembers || 0), 0);

        document.getElementById('total-villages').textContent = totalVillages;
        document.getElementById('adarsh-grams').textContent = adarshGrams;
        document.getElementById('ongoing-projects').textContent = ongoingProjects;
        document.getElementById('beneficiaries').textContent = totalBeneficiaries.toLocaleString();
    }

    loadRecentActivity() {
        const activityContainer = document.getElementById('recent-activity');
        if (!activityContainer) return;

        const activities = [
            {
                title: 'New Village Registered',
                description: 'Gram Panchayat A has been registered in the system',
                time: '2 hours ago',
                type: 'village'
            },
            {
                title: 'Infrastructure Assessment Completed',
                description: 'Format-2 submitted for Gram Panchayat B',
                time: '1 day ago',
                type: 'assessment'
            },
            {
                title: 'Household Survey Started',
                description: 'Format-3A initiated for 50 households',
                time: '2 days ago',
                type: 'survey'
            },
            {
                title: 'VDP Approved',
                description: 'Village Development Plan approved by DLCC',
                time: '3 days ago',
                type: 'vdp'
            }
        ];

        activityContainer.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-desc">${activity.description}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');
    }

    initializeProgressMap() {
        const mapContainer = document.getElementById('progress-map');
        if (!mapContainer) return;

        // Initialize Leaflet map
        const map = L.map('progress-map').setView([28.6139, 77.2090], 5);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add village markers
        this.villages.forEach(village => {
            if (village.location) {
                const statusColor = this.getVillageStatusColor(village.status);
                const marker = L.circleMarker([village.location.lat, village.location.lng], {
                    color: statusColor,
                    fillColor: statusColor,
                    fillOpacity: 0.7,
                    radius: 8
                }).addTo(map);

                marker.bindPopup(`
                    <div class="village-popup">
                        <h4>${village.name}</h4>
                        <p><strong>Status:</strong> ${this.getStatusText(village.status)}</p>
                        <p><strong>SC Population:</strong> ${village.scPopulation}%</p>
                        <p><strong>Total Population:</strong> ${village.totalPopulation}</p>
                    </div>
                `);
            }
        });
    }

    getVillageStatusColor(status) {
        const colors = {
            'registered': '#FF9800',
            'assessment': '#2196F3',
            'vdp-approved': '#4CAF50',
            'implementation': '#9C27B0',
            'adarsh-gram': '#2E7D32'
        };
        return colors[status] || '#666';
    }

    getStatusText(status) {
        const statusMap = {
            'registered': 'Registered',
            'assessment': 'Under Assessment',
            'vdp-approved': 'VDP Approved',
            'implementation': 'Implementation',
            'adarsh-gram': 'Adarsh Gram'
        };
        return statusMap[status] || status;
    }

    // Village Profile Form (Format-1)
    loadVillageProfileForm() {
        const container = document.getElementById('village-profile');
        if (!container) return;

        container.innerHTML += `
            <div class="form-container">
                <div class="form-steps">
                    <div class="step active">
                        <div class="step-number">1</div>
                        <div class="step-label">Village Details</div>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-label">Convergence Committee</div>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-label">Review & Submit</div>
                    </div>
                </div>

                <form id="village-profile-form">
                    <div class="form-section">
                        <div class="form-section-header">
                            <h3><i class="fas fa-info-circle"></i> Basic Village Information</h3>
                            <p>As per latest Census data and official records</p>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="village-name">Village Name *</label>
                                <input type="text" id="village-name" required>
                            </div>
                            <div class="form-group">
                                <label for="gram-panchayat">Gram Panchayat *</label>
                                <input type="text" id="gram-panchayat" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="district">District *</label>
                                <input type="text" id="district" required>
                            </div>
                            <div class="form-group">
                                <label for="state">State *</label>
                                <input type="text" id="state" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="total-population">Total Population *</label>
                                <input type="number" id="total-population" required>
                            </div>
                            <div class="form-group">
                                <label for="sc-population">SC Population *</label>
                                <input type="number" id="sc-population" required>
                            </div>
                            <div class="form-group">
                                <label for="sc-percentage">SC Percentage *</label>
                                <input type="number" id="sc-percentage" step="0.1" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="census-code">Census Code *</label>
                                <input type="text" id="census-code" required>
                            </div>
                            <div class="form-group">
                                <label for="village-type">Village Type</label>
                                <select id="village-type">
                                    <option value="rural">Rural</option>
                                    <option value="tribal">Tribal</option>
                                    <option value="remote">Remote/Hilly</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <div class="form-section-header">
                            <h3><i class="fas fa-users"></i> Convergence Committee Details</h3>
                            <p>Committee members responsible for scheme implementation</p>
                        </div>
                        
                        <div id="committee-members">
                            <div class="committee-member">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Name *</label>
                                        <input type="text" name="member-name" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Designation *</label>
                                        <input type="text" name="member-designation" required>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Contact Number</label>
                                        <input type="tel" name="member-phone">
                                    </div>
                                    <div class="form-group">
                                        <label>Email</label>
                                        <input type="email" name="member-email">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="button" class="btn btn-secondary" onclick="app.addCommitteeMember()">
                            <i class="fas fa-plus"></i> Add Committee Member
                        </button>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary">Save Draft</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i> Submit Format-1
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Add form submission handler
        const form = document.getElementById('village-profile-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitVillageProfile();
            });
        }
    }

    addCommitteeMember() {
        const container = document.getElementById('committee-members');
        const newMember = document.createElement('div');
        newMember.className = 'committee-member';
        newMember.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Name *</label>
                    <input type="text" name="member-name" required>
                </div>
                <div class="form-group">
                    <label>Designation *</label>
                    <input type="text" name="member-designation" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Contact Number</label>
                    <input type="tel" name="member-phone">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="member-email">
                </div>
            </div>
            <button type="button" class="btn btn-secondary" onclick="this.parentElement.remove()">
                <i class="fas fa-trash"></i> Remove
            </button>
        `;
        container.appendChild(newMember);
    }

    submitVillageProfile() {
        const formData = new FormData(document.getElementById('village-profile-form'));
        
        const villageData = {
            id: Date.now(),
            name: document.getElementById('village-name').value,
            gramPanchayat: document.getElementById('gram-panchayat').value,
            district: document.getElementById('district').value,
            state: document.getElementById('state').value,
            totalPopulation: parseInt(document.getElementById('total-population').value),
            scPopulation: parseInt(document.getElementById('sc-population').value),
            scPercentage: parseFloat(document.getElementById('sc-percentage').value),
            censusCode: document.getElementById('census-code').value,
            villageType: document.getElementById('village-type').value,
            status: 'registered',
            registrationDate: new Date().toISOString(),
            location: this.generateVillageLocation()
        };

        this.villages.push(villageData);
        this.saveToStorage();
        
        alert('Village profile submitted successfully!');
        this.showSection('dashboard');
        this.loadDashboard();
    }

    generateVillageLocation() {
        // Generate random location in India for demo
        const indiaBounds = {
            lat: [8.0, 37.0],
            lng: [68.0, 97.0]
        };
        
        return {
            lat: indiaBounds.lat[0] + Math.random() * (indiaBounds.lat[1] - indiaBounds.lat[0]),
            lng: indiaBounds.lng[0] + Math.random() * (indiaBounds.lng[1] - indiaBounds.lng[0])
        };
    }

    // Infrastructure Assessment (Format-2 & Format-4)
    loadInfrastructureAssessment() {
        const container = document.getElementById('infrastructure-assessment');
        // Implementation for Format-2 and Format-4 forms
        container.innerHTML = `
            <div class="form-container">
                <h3>Infrastructure Gap Assessment & Action Plan</h3>
                <p>Format-2: Infrastructure Requirements | Format-4: Estimated Action Plan</p>
                <!-- Form implementation here -->
            </div>
        `;
    }

    // Household Survey (Format-3A & Format-3B)
    loadHouseholdSurvey() {
        const container = document.getElementById('household-survey');
        // Implementation for Format-3A and Format-3B forms
        container.innerHTML = `
            <div class="form-container">
                <h3>Household Survey & Beneficiary Mapping</h3>
                <p>Format-3A: Individual Needs Assessment | Format-3B: Scheme Mapping</p>
                <!-- Form implementation here -->
            </div>
        `;
    }

    // VDP Form
    loadVDPForm() {
        const container = document.getElementById('vdp');
        // Implementation for VDP creation
        container.innerHTML = `
            <div class="form-container">
                <h3>Village Development Plan (VDP)</h3>
                <p>Comprehensive development plan formulation</p>
                <!-- VDP form implementation here -->
            </div>
        `;
    }

    // Monitoring Dashboard
    loadMonitoringDashboard() {
        const container = document.getElementById('monitoring');
        // Implementation for 50 monitorable indicators
        container.innerHTML = `
            <div class="form-container">
                <h3>50 Monitorable Indicators Tracking</h3>
                <p>Real-time monitoring of Adarsh Gram parameters</p>
                <!-- Monitoring dashboard implementation here -->
            </div>
        `;
    }

    // Admin Login
    handleAdminLogin() {
        const officialId = document.getElementById('official-id').value;
        const password = document.getElementById('password').value;
        const department = document.getElementById('department').value;

        // Simple authentication for demo
        if (officialId && password && department) {
            this.currentUser = {
                officialId: officialId,
                department: department,
                loginTime: new Date().toISOString()
            };
            
            alert('Login successful! Welcome to PM-AJAY Admin Dashboard.');
            this.showSection('dashboard');
        } else {
            alert('Please fill all required fields.');
        }
    }

    // Data Management
    saveToStorage() {
        localStorage.setItem('villages', JSON.stringify(this.villages));
        localStorage.setItem('households', JSON.stringify(this.households));
        localStorage.setItem('projects', JSON.stringify(this.projects));
        localStorage.setItem('monitoringData', JSON.stringify(this.monitoringData));
    }

    loadSampleData() {
        if (this.villages.length === 0) {
            this.villages = [
                {
                    id: 1,
                    name: 'Gram Panchayat A',
                    gramPanchayat: 'GP A',
                    district: 'Sample District',
                    state: 'Sample State',
                    totalPopulation: 1200,
                    scPopulation: 650,
                    scPercentage: 54.2,
                    censusCode: 'SMP001',
                    villageType: 'rural',
                    status: 'registered',
                    registrationDate: new Date().toISOString(),
                    location: { lat: 28.6139, lng: 77.2090 }
                }
            ];
            this.saveToStorage();
        }
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully');
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }
}

// Global functions
function showSection(sectionName) {
    if (window.app) {
        window.app.showSection(sectionName);
    }
}

// Initialize application
let app;
document.addEventListener('DOMContentLoaded', function() {
    app = new AdarshGramPlatform();
    window.app = app; // Make it globally available
});
