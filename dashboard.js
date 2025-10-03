// Dashboard Specific Functionality
// Dashboard specific functionality can be added here if needed
console.log('Dashboard module loaded');
class DashboardManager {
    constructor(app) {
        this.app = app;
        this.charts = {};
    }

    initializeDashboard() {
        this.updateRealTimeStats();
        this.loadVillageProgress();
        this.setupCharts();
        this.loadQuickActions();
    }

    updateRealTimeStats() {
        // Update stats with animation
        const stats = {
            'total-villages': this.app.villages.length,
            'adarsh-grams': this.app.villages.filter(v => v.status === 'adarsh-gram').length,
            'ongoing-projects': this.app.projects.filter(p => p.status === 'in-progress').length,
            'beneficiaries': this.app.households.reduce((sum, h) => sum + (h.familyMembers || 0), 0)
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
                element.textContent = targetValue.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, step);
    }

    loadVillageProgress() {
        const villages = this.app.villages;
        
        // Update progress cards if they exist
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

    setupCharts() {
        // Initialize chart placeholders
        this.setupVillageStatusChart();
        this.setupProgressChart();
        this.setupRegionalDistributionChart();
    }

    setupVillageStatusChart() {
        const statusChart = document.getElementById('village-status-chart');
        if (!statusChart) return;

        const statusCounts = {};
        this.app.villages.forEach(village => {
            statusCounts[village.status] = (statusCounts[village.status] || 0) + 1;
        });

        // This would be replaced with actual chart library in production
        statusChart.innerHTML = this.createChartHTML('Village Status Distribution', statusCounts);
    }

    setupProgressChart() {
        const progressChart = document.getElementById('progress-chart');
        if (!progressChart) return;

        const progressData = {
            'Infrastructure': 65,
            'Household Survey': 80,
            'VDP Preparation': 45,
            'Scheme Convergence': 70
        };

        progressChart.innerHTML = this.createProgressHTML('Implementation Progress', progressData);
    }

    setupRegionalDistributionChart() {
        const regionalChart = document.getElementById('regional-chart');
        if (!regionalChart) return;

        const stateDistribution = {};
        this.app.villages.forEach(village => {
            stateDistribution[village.state] = (stateDistribution[village.state] || 0) + 1;
        });

        regionalChart.innerHTML = this.createChartHTML('State-wise Distribution', stateDistribution);
    }

    createChartHTML(title, data) {
        return `
            <div class="chart-header">
                <h4>${title}</h4>
            </div>
            <div class="chart-data">
                ${Object.entries(data).map(([key, value]) => `
                    <div class="chart-item">
                        <span class="chart-label">${key}</span>
                        <span class="chart-value">${value}</span>
                        <div class="chart-bar">
                            <div class="chart-fill" style="width: ${(value / Math.max(...Object.values(data))) * 100}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    createProgressHTML(title, data) {
        return `
            <div class="chart-header">
                <h4>${title}</h4>
            </div>
            <div class="progress-data">
                ${Object.entries(data).map(([key, value]) => `
                    <div class="progress-item">
                        <span class="progress-label">${key}</span>
                        <span class="progress-value">${value}%</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${value}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    loadQuickActions() {
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

    refreshDashboard() {
        this.updateRealTimeStats();
        this.loadVillageProgress();
        this.setupCharts();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.app) {
        window.dashboardManager = new DashboardManager(window.app);
    }
});
