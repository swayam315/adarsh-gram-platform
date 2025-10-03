// Map Management System
class MapManager {
    constructor(app) {
        this.app = app;
        this.map = null;
        this.markers = [];
        this.currentVillageLayer = null;
    }

    initializeProgressMap() {
        const mapContainer = document.getElementById('progress-map');
        if (!mapContainer || this.map) return;

        // Initialize Leaflet map centered on India
        this.map = L.map('progress-map').setView([20.5937, 78.9629], 5);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);

        this.loadVillageMarkers();
        this.setupMapControls();
    }

    loadVillageMarkers() {
        // Clear existing markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        // Add markers for each village
        this.app.villages.forEach(village => {
            if (village.location && village.location.lat && village.location.lng) {
                const marker = this.createVillageMarker(village);
                marker.addTo(this.map);
                this.markers.push(marker);
            }
        });

        // Fit map to show all markers
        if (this.markers.length > 0) {
            const group = new L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    createVillageMarker(village) {
        const statusColor = this.getStatusColor(village.status);
        const statusText = this.getStatusText(village.status);
        
        const marker = L.circleMarker([village.location.lat, village.location.lng], {
            color: statusColor,
            fillColor: statusColor,
            fillOpacity: 0.7,
            radius: this.getMarkerRadius(village),
            weight: 2
        });

        // Create popup content
        const popupContent = `
            <div class="village-popup">
                <h4>${village.name}</h4>
                <div class="popup-details">
                    <p><strong>Gram Panchayat:</strong> ${village.gramPanchayat}</p>
                    <p><strong>District:</strong> ${village.district}, ${village.state}</p>
                    <p><strong>Status:</strong> <span class="status-badge ${village.status}">${statusText}</span></p>
                    <p><strong>SC Population:</strong> ${village.scPopulation} (${village.scPercentage}%)</p>
                    <p><strong>Total Population:</strong> ${village.totalPopulation}</p>
                    <p><strong>Registered:</strong> ${new Date(village.registrationDate).toLocaleDateString()}</p>
                </div>
                <div class="popup-actions">
                    <button onclick="mapManager.viewVillageDetails(${village.id})" class="btn btn-primary btn-sm">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button onclick="mapManager.editVillage(${village.id})" class="btn btn-secondary btn-sm">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent);
        
        // Add hover effects
        marker.on('mouseover', function() {
            this.openPopup();
        });

        return marker;
    }

    getStatusColor(status) {
        const colors = {
            'registered': '#FF9800',      // Orange
            'assessment': '#2196F3',      // Blue
            'vdp-approved': '#4CAF50',    // Green
            'implementation': '#9C27B0',  // Purple
            'adarsh-gram': '#2E7D32'      // Dark Green
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

    getMarkerRadius(village) {
        // Scale marker size based on population
        const baseSize = 8;
        const population = village.totalPopulation || 1000;
        return Math.min(baseSize + (population / 1000), 20);
    }

    setupMapControls() {
        // Add scale control
        L.control.scale({ imperial: false }).addTo(this.map);

        // Add layer control for different views
        const baseLayers = {
            "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
            "Satellite": L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                attribution: '© Google'
            })
        };

        // Add legend
        this.addMapLegend();
    }

    addMapLegend() {
        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'map-legend');
            div.innerHTML = `
                <h4>Village Status</h4>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #FF9800"></span>
                    <span>Registered</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #2196F3"></span>
                    <span>Under Assessment</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #4CAF50"></span>
                    <span>VDP Approved</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #9C27B0"></span>
                    <span>Implementation</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #2E7D32"></span>
                    <span>Adarsh Gram</span>
                </div>
            `;
            return div;
        };

        legend.addTo(this.map);
    }

    viewVillageDetails(villageId) {
        const village = this.app.villages.find(v => v.id === villageId);
        if (village) {
            // Show village details in a modal or navigate to details page
            alert(`Viewing details for: ${village.name}\n\nGram Panchayat: ${village.gramPanchayat}\nDistrict: ${village.district}\nStatus: ${this.getStatusText(village.status)}`);
        }
    }

    editVillage(villageId) {
        const village = this.app.villages.find(v => v.id === villageId);
        if (village) {
            // Navigate to village profile form for editing
            this.app.showSection('village-profile');
            // Here you would populate the form with village data
            console.log('Editing village:', village);
        }
    }

    addNewVillageMarker(lat, lng, villageData) {
        const marker = L.marker([lat, lng]).addTo(this.map);
        
        marker.bindPopup(`
            <div class="village-popup">
                <h4>${villageData.name}</h4>
                <p>New Village - Under Registration</p>
                <button onclick="mapManager.finalizeVillageLocation(${villageData.id})" class="btn btn-primary">
                    Finalize Location
                </button>
            </div>
        `);

        this.markers.push(marker);
        this.map.setView([lat, lng], 10);
    }

    finalizeVillageLocation(villageId) {
        const village = this.app.villages.find(v => v.id === villageId);
        if (village) {
            // Update village location in data
            village.locationFinalized = true;
            this.app.saveToStorage();
            this.loadVillageMarkers(); // Refresh markers
        }
    }

    showVillageCluster(region) {
        // Filter and show villages by region
        const regionalVillages = this.app.villages.filter(v => 
            v.state.toLowerCase().includes(region.toLowerCase()) || 
            v.district.toLowerCase().includes(region.toLowerCase())
        );

        // Clear current markers and show only regional ones
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        regionalVillages.forEach(village => {
            if (village.location) {
                const marker = this.createVillageMarker(village);
                marker.addTo(this.map);
                this.markers.push(marker);
            }
        });

        if (this.markers.length > 0) {
            const group = new L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    exportMapData() {
        const mapData = {
            villages: this.app.villages.map(v => ({
                name: v.name,
                location: v.location,
                status: v.status,
                population: v.totalPopulation
            })),
            timestamp: new Date().toISOString()
        };

        const dataStr = JSON.stringify(mapData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `pm-ajay-map-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Heat map functionality for population density
    showPopulationHeatmap() {
        // This would require additional heatmap library in production
        console.log('Population heatmap feature would be implemented here');
    }

    // Measure distance tool
    enableMeasurementTool() {
        // Implementation for distance measurement between villages
        console.log('Measurement tool would be implemented here');
    }
}

// CSS for map controls
const mapStyles = `
    .map-legend {
        background: white;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    
    .map-legend h4 {
        margin: 0 0 10px 0;
        font-size: 14px;
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
    }
    
    .legend-color {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 8px;
        display: inline-block;
    }
    
    .village-popup {
        min-width: 250px;
    }
    
    .popup-details {
        margin: 10px 0;
    }
    
    .popup-details p {
        margin: 5px 0;
        font-size: 12px;
    }
    
    .popup-actions {
        display: flex;
        gap: 5px;
        margin-top: 10px;
    }
    
    .btn-sm {
        padding: 5px 10px;
        font-size: 12px;
    }
    
    .status-badge {
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: bold;
        color: white;
    }
    
    .status-badge.registered { background: #FF9800; }
    .status-badge.assessment { background: #2196F3; }
    .status-badge.vdp-approved { background: #4CAF50; }
    .status-badge.implementation { background: #9C27B0; }
    .status-badge.adarsh-gram { background: #2E7D32; }
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
