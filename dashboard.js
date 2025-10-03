// Dashboard Manager - Advanced Dashboard Functionality
class DashboardManager {
    constructor(app) {
        this.app = app;
        this.charts = {};
    }

    initializeDashboard() {
        this.updateRealTimeStats();
        this.loadVillageProgress();
        this.setupQuickActions();
        this.initializeCharts();
    }

    updateRealTimeStats() {
        const stats = {
            'total-requirements': this.app.requirements.length,
            'approved-requirements': this.app.requirements.filter(r => r.status === 'approved').length,
            'ongoing-projects': this.app.requirements.filter(r => r.status === 'implementation').length,
            'household-surveys': this.app.surveys.length
        };

        Object.keys(stats).forEach(statId => {
            this.animateCounter(statId, stats[statId]);
        });
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const duration = 1000;
        const step = 20;
        const increment = targetValue / (duration / step);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
                element.textContent = targetValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, step);
    }

    loadVillageProgress() {
        const villages = this.app.villages;
        
        const progressContainer = document.getElementById('village-progress-cards');
        if (progressContainer) {
            progressContainer.innerHTML = villages.map(village => `
                <div class="village-card">
                    <h4>${village.name}</h4>
                    <div class="village-meta">
                        <span>${village.district}, ${village.state}</span>
                        <span>${village.scPercentage}% SC</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${this.getProgressPercentage(village.status)}%"></div>
                    </div>
                    <div class="village-status">
                        <span class="status-badge ${village.status}">${this.getStatusText(village.status)}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    getProgressPercentage(status) {
        const progressMap = {
            'registered': 25,
            'assessment': 50,
            'vdp-approved': 75,
            'implementation': 90,
            'adarsh-gram': 100
        };
        return progressMap[status] || 0;
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

    setupQuickActions() {
        const actionsContainer = document.getElementById('quick-actions-container');
        if (!actionsContainer) return;

        const actions = [
            {
                icon: 'fas fa-plus',
                title: 'Register New Village',
                description: 'Start new village registration process',
                action: () => this.app.showSection('village-profile'),
                color: 'primary'
            },
            {
                icon: 'fas fa-clipboard-check',
                title: 'Infrastructure Assessment',
                description: 'Conduct infrastructure gap analysis',
                action: () => this.app.showSection('infrastructure-assessment'),
                color: 'success'
            },
            {
                icon: 'fas fa-house-user',
                title: 'Household Survey',
                description: 'Start beneficiary household survey',
                action: () => this.app.showSection('household-survey'),
                color: 'warning'
            },
            {
                icon: 'fas fa-file-contract',
                title: 'Create VDP',
                description: 'Develop Village Development Plan',
                action: () => this.app.showSection('vdp'),
                color: 'info'
            }
        ];

        actionsContainer.innerHTML = actions.map(action => `
            <div class="action-card" onclick="${action.action}">
                <div class="action-icon ${action.color}">
                    <i class="${action.icon}"></i>
                </div>
                <div class="action-content">
                    <h4>${action.title}</h4>
                    <p>${action.description}</p>
                </div>
                <div class="action-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        `).join('');
    }

    initializeCharts() {
        this.createProgressChart();
        this.createGrowthChart();
    }

    createProgressChart() {
        const ctx = document.getElementById('village-progress-chart');
        if (!ctx) return;

        // For now, we'll use a placeholder
        // In production, this would use Chart.js or similar
        console.log('Progress chart would be initialized here with Chart.js');
    }

    createGrowthChart() {
        const ctx = document.getElementById('village-growth-chart');
        if (!ctx) return;

        // For now, we'll use a placeholder
        // In production, this would use Chart.js or similar
        console.log('Growth chart would be initialized here with Chart.js');
    }

    refreshDashboard() {
        this.updateRealTimeStats();
        this.loadVillageProgress();
        this.initializeCharts();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.app) {
        window.dashboardManager = new DashboardManager(window.app);
    }
});

console.log('🚀 Dashboard Manager Loaded');
