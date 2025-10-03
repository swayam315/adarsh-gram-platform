// Map Management System
class MapManager {
    constructor(app) {
        this.app = app;
        this.map = null;
        this.markers = [];
        this.currentVillageLayer = null;
    }

    initializeMap() {
        this.setupMapContainer();
        this.loadVillageData();
        this.setupMapControls();
    }

    setupMapContainer() {
        const mapContainer = document.getElementById('progress-map');
        if (!mapContainer) {
            console.log('Map container not found');
            return;
        }

        // Create a simple placeholder for the map
        // In production, this would initialize Leaflet or Google Maps
        mapContainer.innerHTML = `
            <div class="map-placeholder">
                <div class="placeholder-content">
                    <i class="fas fa-map-marked-alt"></i>
                    <h3>Village Progress Map</h3>
                    <p>Interactive map showing village development progress across the region</p>
                    <div class="map-legend">
                        <div class="legend-item">
                            <span class="legend-color" style="background-color: #FF9800"></span>
                            <span>Registered Villages</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-color" style="background-color: #2196F3"></span>
                            <span>Under Assessment</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-color" style="background-color: #4CAF50"></span>
                            <span>Adarsh Grams</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        console.log('Map placeholder initialized');
    }

    loadVillageData() {
        // Simulate loading village data
        const villages = [
            {
                name: 'Demo Village',
                location: { lat: 28.6139, lng: 77.2090 },
                status: 'registered',
                population: 1250,
                progress: 65
            },
            {
                name: 'Sample Gram Panchayat',
                location: { lat: 28.7041, lng: 77.1025 },
                status: 'adarsh-gram',
                population: 800,
                progress: 95
            },
            {
                name: 'Test Village',
                location: { lat: 28.4595, lng: 77.0266 },
                status: 'implementation',
                population: 1500,
                progress: 75
            }
        ];

        this.villages = villages;
        this.plotVillagesOnMap();
    }

    plotVillagesOnMap() {
        // In production, this would add markers to the actual map
        console.log('Plotting villages on map:', this.villages);
        
        // Update map placeholder with village stats
        const placeholder = document.querySelector('.map-placeholder .placeholder-content');
        if (placeholder) {
            const statsHTML = `
                <div class="village-stats">
                    <div class="stat">
                        <strong>${this.villages.length}</strong>
                        <span>Villages Mapped</span>
                    </div>
                    <div class="stat">
                        <strong>${this.villages.filter(v => v.status === 'adarsh-gram').length}</strong>
                        <span>Adarsh Grams</span>
                    </div>
                    <div class="stat">
                        <strong>${this.villages.reduce((sum, v) => sum + v.population, 0).toLocaleString()}</strong>
                        <span>Total Population</span>
                    </div>
                </div>
            `;
            placeholder.innerHTML += statsHTML;
        }
    }

    setupMapControls() {
        // Add map controls functionality
        this.addSearchFunctionality();
        this.addFilterControls();
        this.addExportFunctionality();
    }

    addSearchFunctionality() {
        // Simulate search functionality
        const searchContainer = document.createElement('div');
        searchContainer.className = 'map-search';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" placeholder="Search villages..." id="map-search-input">
                <button onclick="mapManager.searchVillages()">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        `;

        const mapContainer = document.getElementById('progress-map');
        if (mapContainer) {
            mapContainer.appendChild(searchContainer);
        }
    }

    searchVillages() {
        const searchInput = document.getElementById('map-search-input');
        const query = searchInput.value.toLowerCase().trim();
        
        if (!query) {
            alert('Please enter a village name to search');
            return;
        }

        const foundVillages = this.villages.filter(village => 
            village.name.toLowerCase().includes(query)
        );

        if (foundVillages.length > 0) {
            alert(`Found ${foundVillages.length} village(s) matching "${query}"`);
            // In production, this would highlight the villages on the map
        } else {
            alert(`No villages found matching "${query}"`);
        }
    }

    addFilterControls() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'map-filters';
        filterContainer.innerHTML = `
            <div class="filter-group">
                <label>Filter by Status:</label>
                <select id="status-filter" onchange="mapManager.filterByStatus()">
                    <option value="all">All Villages</option>
                    <option value="registered">Registered</option>
                    <option value="assessment">Under Assessment</option>
                    <option value="implementation">Implementation</option>
                    <option value="adarsh-gram">Adarsh Grams</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Filter by Progress:</label>
                <select id="progress-filter" onchange="mapManager.filterByProgress()">
                    <option value="all">All Progress</option>
                    <option value="0-25">0-25%</option>
                    <option value="25-50">25-50%</option>
                    <option value="50-75">50-75%</option>
                    <option value="75-100">75-100%</option>
                </select>
            </div>
        `;

        const mapContainer = document.getElementById('progress-map');
        if (mapContainer) {
            mapContainer.appendChild(filterContainer);
        }
    }

    filterByStatus() {
        const statusFilter = document.getElementById('status-filter');
        const selectedStatus = statusFilter.value;
        
        if (selectedStatus === 'all') {
            console.log('Showing all villages');
        } else {
            console.log(`Filtering villages by status: ${selectedStatus}`);
            const filtered = this.villages.filter(v => v.status === selectedStatus);
            console.log(`Found ${filtered.length} villages`);
        }
    }

    filterByProgress() {
        const progressFilter = document.getElementById('progress-filter');
        const selectedRange = progressFilter.value;
        
        console.log(`Filtering villages by progress range: ${selectedRange}`);
        // Implementation would filter villages based on progress range
    }

    addExportFunctionality() {
        const exportContainer = document.createElement('div');
        exportContainer.className = 'map-export';
        exportContainer.innerHTML = `
            <button class="btn btn-secondary" onclick="mapManager.exportMapData()">
                <i class="fas fa-download"></i> Export Map Data
            </button>
        `;

        const mapContainer = document.getElementById('progress-map');
        if (mapContainer) {
            mapContainer.appendChild(exportContainer);
        }
    }

    exportMapData() {
        const mapData = {
            villages: this.villages,
            exportDate: new Date().toISOString(),
            totalVillages: this.villages.length,
            adarshGrams: this.villages.filter(v => v.status === 'adarsh-gram').length,
            totalPopulation: this.villages.reduce((sum, v) => sum + v.population, 0)
        };

        // Create and download JSON file
        const dataStr = JSON.stringify(mapData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `village-map-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        alert('Map data exported successfully!');
    }

    showVillageDetails(villageId) {
        const village = this.villages.find(v => v.id === villageId);
        if (village) {
            // Show village details in a modal
            this.showVillageModal(village);
        }
    }

    showVillageModal(village) {
        const modalHTML = `
            <div class="modal-overlay" onclick="mapManager.closeModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h3>${village.name}</h3>
                        <button class="close-btn" onclick="mapManager.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="village-info">
                            <div class="info-item">
                                <label>Status:</label>
                                <span class="status-${village.status}">${this.getStatusText(village.status)}</span>
                            </div>
                            <div class="info-item">
                                <label>Population:</label>
                                <span>${village.population}</span>
                            </div>
                            <div class="info-item">
                                <label>Progress:</label>
                                <span>${village.progress}%</span>
                            </div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${village.progress}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal
        this.closeModal();

        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    closeModal() {
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }
    }

    getStatusText(status) {
        const statusMap = {
            'registered': 'Registered',
            'assessment': 'Under Assessment',
            'implementation': 'Implementation',
            'adarsh-gram': 'Adarsh Gram'
        };
        return statusMap[status] || status;
    }

    // Heat map functionality
    showPopulationHeatmap() {
        console.log('Population heatmap would be displayed here');
        // Implementation would show population density heatmap
    }

    // Measure distance tool
    enableMeasurementTool() {
        console.log('Distance measurement tool activated');
        // Implementation would allow measuring distances between villages
    }
}

// CSS for map components
const mapStyles = `
    .map-placeholder {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        border-radius: 12px;
    }

    .placeholder-content {
        text-align: center;
        padding: 40px;
    }

    .placeholder-content i {
        font-size: 4em;
        margin-bottom: 20px;
        opacity: 0.8;
    }

    .placeholder-content h3 {
        font-size: 1.5em;
        margin-bottom: 10px;
    }

    .placeholder-content p {
        opacity: 0.8;
        margin-bottom: 30px;
    }

    .map-legend {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 20px 0;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .legend-color {
        width: 15px;
        height: 15px;
        border-radius: 3px;
        display: inline-block;
    }

    .village-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-top: 30px;
    }

    .stat {
        text-align: center;
        padding: 15px;
        background: rgba(255,255,255,0.1);
        border-radius: 8px;
    }

    .stat strong {
        display: block;
        font-size: 1.5em;
        margin-bottom: 5px;
    }

    .stat span {
        font-size: 0.9em;
        opacity: 0.8;
    }

    .map-search,
    .map-filters,
    .map-export {
        position: absolute;
        z-index: 1000;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        margin: 10px;
    }

    .map-search {
        top: 10px;
        left: 10px;
    }

    .map-filters {
        top: 10px;
        right: 10px;
    }

    .map-export {
        bottom: 10px;
        right: 10px;
    }

    .search-box {
        display: flex;
        gap: 10px;
    }

    .search-box input {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        width: 200px;
    }

    .search-box button {
        padding: 8px 12px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .filter-group {
        margin-bottom: 10px;
    }

    .filter-group:last-child {
        margin-bottom: 0;
    }

    .filter-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
        color: var(--text-dark);
    }

    .filter-group select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    }

    .modal-content {
        background: white;
        border-radius: 12px;
        padding: 0;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }

    .modal-header {
        padding: 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-header h3 {
        margin: 0;
        color: var(--primary-dark);
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 1.2em;
        cursor: pointer;
        color: var(--text-light);
    }

    .modal-body {
        padding: 20px;
    }

    .village-info {
        margin-bottom: 20px;
    }

    .info-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
    }

    .info-item:last-child {
        border-bottom: none;
    }
`;

// Add map styles to document
if (document.head) {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = mapStyles;
    document.head.appendChild(styleSheet);
}

// Initialize map manager
let mapManager;
document.addEventListener('DOMContentLoaded', function() {
    if (window.app) {
        mapManager = new MapManager(window.app);
        window.mapManager = mapManager;
    }
});

console.log('🚀 Map Manager Loaded');
