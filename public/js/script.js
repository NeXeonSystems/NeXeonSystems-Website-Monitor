class NeXeonStatusChecker {
    constructor() {
        this.socket = io();
        this.container = document.getElementById('status-container');
        this.lastUpdate = document.getElementById('last-update');
        this.initializeSocket();
        this.initializeTimeago();
        this.chart = null;
    }

    initializeSocket() {
        this.socket.on('connect', () => this.handleConnect());
        this.socket.on('disconnect', () => this.handleDisconnect());
        this.socket.on('statusUpdate', (statuses) => this.updateNodes(statuses));
    }

    initializeTimeago() {
        this.updateTimestamp();
        setInterval(() => this.updateTimestamp(), 60000);
    }

    handleConnect() {
        this.updateConnectionStatus(true);
        this.addSystemStatus('System connection established');
    }

    handleDisconnect() {
        this.updateConnectionStatus(false);
        this.addSystemStatus('Connection lost - attempting to reconnect...');
    }

    updateConnectionStatus(isConnected) {
        const subtitle = document.querySelector('.subtitle');
        if (subtitle) {
            subtitle.textContent = isConnected ? 'Real-Time Status Checker' : 'RECONNECTING...';
            subtitle.style.color = isConnected ? '#64748b' : '#ff0033';
        }
    }

    createNodeElement(node) {
        return `
            <div class="node ${node.status}" data-node="${this.escapeHtml(node.name)}" onclick="window.statusChecker.showChart('${node.name}', '${node.status}')">
                <div class="node-header">
                    <span class="status-indicator"></span>
                    <span class="node-name">${this.escapeHtml(node.name)}</span>
                </div>
                <div class="node-details">
                    <div class="detail-label">Status</div>
                    <div class="node-status">${node.status.toUpperCase()}</div>
                </div>
            </div>
        `;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    updateNodes(statuses) {
        if (!Array.isArray(statuses)) {
            console.error('Invalid status update received');
            return;
        }

        const nodesHtml = statuses.map(node => this.createNodeElement(node)).join('');
        this.container.innerHTML = nodesHtml;

        this.updateTimestamp();
        this.addNodeAnimations();
    }

    updateTimestamp() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const dateString = now.toLocaleDateString();
        if (this.lastUpdate) {
            this.lastUpdate.textContent = `Last Updated: ${timeString} - ${dateString}`;
        }
    }

    addNodeAnimations() {
        const nodes = document.querySelectorAll('.node');
        nodes.forEach(node => {
            node.style.opacity = '0';
            node.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
                node.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                node.style.opacity = '1';
                node.style.transform = 'translateY(0)';
            });
        });
    }

    addSystemStatus(message) {
        console.log(`System Status: ${message}`);
    }

    showChart(nodeName, status) {
        const chartContainer = document.createElement('div');
        chartContainer.id = 'chart-container';
        chartContainer.style.position = 'fixed';
        chartContainer.style.top = '50%';
        chartContainer.style.left = '50%';
        chartContainer.style.transform = 'translate(-50%, -50%)';
        chartContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        chartContainer.style.padding = '40px';
        chartContainer.style.borderRadius = '15px';
        chartContainer.style.zIndex = '1000';
        chartContainer.style.maxWidth = '90vw';
        chartContainer.style.maxHeight = '80vh';
        chartContainer.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';

        const closeButton = document.createElement('div');
        closeButton.innerText = 'X';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.fontSize = '20px';
        closeButton.style.color = '#ff0033';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => {
            document.body.removeChild(chartContainer);
            if (this.chart) {
                this.chart.destroy();
            }
        };
        chartContainer.appendChild(closeButton);

        const canvas = document.createElement('canvas');
        chartContainer.appendChild(canvas);
        document.body.appendChild(chartContainer);

        const chartData = {
            labels: [nodeName],
            datasets: [{
                label: 'Status Value',
                data: [status === 'up' ? 100 : 0],
                backgroundColor: status === 'up' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)',
                borderColor: status === 'up' ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)',
                borderWidth: 1,
                hoverBackgroundColor: status === 'up' ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)',
                hoverBorderColor: 'rgba(255, 255, 255, 1)',
            }]
        };

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(canvas, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'easeOutBounce',
                        from: 1,
                        to: 0,
                        loop: true
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { display: false },
                        ticks: {
                            color: '#333',
                            font: { size: 18 }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { display: true, color: '#e0e0e0' },
                        ticks: {
                            color: '#333',
                            font: { size: 18 }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        displayColors: false,
                        callbacks: {
                            label: (context) => `Status: ${context.raw === 100 ? 'Up' : 'Down'}`
                        }
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.statusChecker = new NeXeonStatusChecker();
});
