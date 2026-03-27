#!/usr/bin/env python3
"""
🛠️ Docker Security Scanner
Author: Zeynep Sude (mashcim)
Description: Web-based security scanning tool
"""

from flask import Flask, request, jsonify, render_template_string
import subprocess
import json
import redis
import os
import uuid
from datetime import datetime
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Redis connection
redis_client = redis.Redis(host='redis', port=6379, decode_responses=True)

# HTML Template
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🛠️ Docker Security Scanner</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 10px; margin-bottom: 2rem; }
        .scanner-form { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 2rem; }
        .form-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333; }
        input, select { width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 5px; font-size: 1rem; }
        button { background: #667eea; color: white; padding: 0.75rem 2rem; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; }
        button:hover { background: #5a67d8; }
        .results { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .scan-item { border-left: 4px solid #667eea; padding: 1rem; margin-bottom: 1rem; background: #f8f9fa; }
        .open-port { color: #e53e3e; font-weight: bold; }
        .closed-port { color: #38a169; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
        .stat-number { font-size: 2rem; font-weight: bold; color: #667eea; }
        .loading { text-align: center; padding: 2rem; }
        .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🛠️ Docker Security Scanner</h1>
            <p>Comprehensive security scanning tool by Zeynep Sude (mashcim)</p>
        </header>

        <div class="stats" id="stats">
            <div class="stat-card">
                <div class="stat-number" id="totalScans">0</div>
                <div>Total Scans</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="openPorts">0</div>
                <div>Open Ports Found</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="threats">0</div>
                <div>Threats Detected</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="uptime">0</div>
                <div>Uptime (hours)</div>
            </div>
        </div>

        <div class="scanner-form">
            <h2>Start Security Scan</h2>
            <form id="scanForm">
                <div class="form-group">
                    <label for="target">Target IP or Domain:</label>
                    <input type="text" id="target" name="target" placeholder="example.com or 192.168.1.1" required>
                </div>
                <div class="form-group">
                    <label for="scanType">Scan Type:</label>
                    <select id="scanType" name="scanType">
                        <option value="quick">Quick Scan (Common Ports)</option>
                        <option value="full">Full Scan (All Ports)</option>
                        <option value="vuln">Vulnerability Scan</option>
                        <option value="stealth">Stealth Scan</option>
                    </select>
                </div>
                <button type="submit">Start Scan</button>
            </form>
        </div>

        <div class="results" id="results">
            <h2>Recent Scans</h2>
            <div id="scanList">
                <p>No scans yet. Start your first scan above!</p>
            </div>
        </div>
    </div>

    <script>
        // Load stats and scans on page load
        async function loadData() {
            try {
                const response = await fetch('/api/scans');
                const data = await response.json();
                
                document.getElementById('totalScans').textContent = data.total_scans;
                document.getElementById('openPorts').textContent = data.total_open_ports;
                document.getElementById('threats').textContent = data.threats_detected;
                document.getElementById('uptime').textContent = data.uptime_hours;
                
                displayScans(data.scans);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        }

        function displayScans(scans) {
            const scanList = document.getElementById('scanList');
            
            if (scans.length === 0) {
                scanList.innerHTML = '<p>No scans yet. Start your first scan above!</p>';
                return;
            }
            
            scanList.innerHTML = scans.map(scan => `
                <div class="scan-item">
                    <h3>Scan of ${scan.target}</h3>
                    <p><strong>Type:</strong> ${scan.scan_type}</p>
                    <p><strong>Status:</strong> ${scan.status}</p>
                    <p><strong>Time:</strong> ${new Date(scan.timestamp).toLocaleString()}</p>
                    ${scan.results ? `<p><strong>Open Ports:</strong> <span class="open-port">${scan.results.open_ports.join(', ')}</span></p>` : ''}
                    ${scan.error ? `<p><strong>Error:</strong> ${scan.error}</p>` : ''}
                </div>
            `).join('');
        }

        // Handle form submission
        document.getElementById('scanForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const target = formData.get('target');
            const scanType = formData.get('scanType');
            
            // Show loading
            document.getElementById('scanList').innerHTML = '<div class="loading"><div class="spinner"></div><p>Scanning in progress...</p></div>';
            
            try {
                const response = await fetch('/api/scan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ target, scan_type: scanType })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Reload data after a short delay
                    setTimeout(loadData, 2000);
                } else {
                    document.getElementById('scanList').innerHTML = `<p><strong>Error:</strong> ${result.error}</p>`;
                }
            } catch (error) {
                document.getElementById('scanList').innerHTML = `<p><strong>Error:</strong> ${error.message}</p>`;
            }
        });

        // Load data on page load
        loadData();
        
        // Refresh data every 30 seconds
        setInterval(loadData, 30000);
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    """Main dashboard page"""
    return render_template_string(HTML_TEMPLATE)

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'Docker Security Scanner',
        'version': '1.0.0'
    })

@app.route('/api/scan', methods=['POST'])
def start_scan():
    """Start a security scan"""
    try:
        data = request.get_json()
        target = data.get('target')
        scan_type = data.get('scan_type', 'quick')
        
        if not target:
            return jsonify({'error': 'Target is required'}), 400
        
        # Generate scan ID
        scan_id = str(uuid.uuid4())
        
        # Store scan info in Redis
        scan_info = {
            'id': scan_id,
            'target': target,
            'scan_type': scan_type,
            'status': 'running',
            'timestamp': datetime.now().isoformat(),
            'results': None,
            'error': None
        }
        
        redis_client.set(f"scan:{scan_id}", json.dumps(scan_info))
        
        # Start scan in background
        run_nmap_scan(scan_id, target, scan_type)
        
        return jsonify({
            'message': 'Scan started',
            'scan_id': scan_id
        }), 202
        
    except Exception as e:
        logger.error(f"Scan start error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

def run_nmap_scan(scan_id, target, scan_type):
    """Run nmap scan based on type"""
    try:
        # Build nmap command based on scan type
        if scan_type == 'quick':
            cmd = ['nmap', '-F', target]  # Fast scan
        elif scan_type == 'full':
            cmd = ['nmap', '-p', '1-65535', target]  # All ports
        elif scan_type == 'vuln':
            cmd = ['nmap', '--script', 'vuln', target]  # Vulnerability scan
        elif scan_type == 'stealth':
            cmd = ['nmap', '-sS', '-T2', target]  # Stealth scan
        else:
            cmd = ['nmap', target]
        
        # Run scan
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        
        # Parse results
        open_ports = []
        if result.returncode == 0:
            for line in result.stdout.split('\n'):
                if '/tcp' in line and 'open' in line:
                    port = line.split('/')[0].strip()
                    open_ports.append(port)
        
        # Update scan results
        scan_info = json.loads(redis_client.get(f"scan:{scan_id}"))
        scan_info['status'] = 'completed'
        scan_info['results'] = {
            'open_ports': open_ports,
            'raw_output': result.stdout
        }
        
        redis_client.set(f"scan:{scan_id}", json.dumps(scan_info))
        
        logger.info(f"Scan completed: {scan_id} - {len(open_ports)} open ports")
        
    except subprocess.TimeoutExpired:
        scan_info = json.loads(redis_client.get(f"scan:{scan_id}"))
        scan_info['status'] = 'failed'
        scan_info['error'] = 'Scan timed out'
        redis_client.set(f"scan:{scan_id}", json.dumps(scan_info))
        
    except Exception as e:
        scan_info = json.loads(redis_client.get(f"scan:{scan_id}"))
        scan_info['status'] = 'failed'
        scan_info['error'] = str(e)
        redis_client.set(f"scan:{scan_id}", json.dumps(scan_info))
        logger.error(f"Scan error: {e}")

@app.route('/api/scans', methods=['GET'])
def get_scans():
    """Get all scans and statistics"""
    try:
        # Get all scan keys
        scan_keys = redis_client.keys("scan:*")
        scans = []
        total_open_ports = 0
        threats_detected = 0
        
        for key in scan_keys:
            scan_data = redis_client.get(key)
            if scan_data:
                scan = json.loads(scan_data)
                scans.append(scan)
                
                if scan.get('results') and scan['results'].get('open_ports'):
                    total_open_ports += len(scan['results']['open_ports'])
                    
                # Count as threat if vuln scan found issues
                if scan['scan_type'] == 'vuln' and scan['status'] == 'completed':
                    threats_detected += 1
        
        # Sort by timestamp (newest first)
        scans.sort(key=lambda x: x['timestamp'], reverse=True)
        
        # Calculate uptime (simplified)
        uptime_hours = 24  # This would be calculated from container start time
        
        return jsonify({
            'scans': scans[:20],  # Return last 20 scans
            'total_scans': len(scans),
            'total_open_ports': total_open_ports,
            'threats_detected': threats_detected,
            'uptime_hours': uptime_hours
        })
        
    except Exception as e:
        logger.error(f"Get scans error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=False)
