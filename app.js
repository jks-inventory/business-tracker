// Pricing structure for JK's Fruit Soda
const PRICING = {
    sizes: {
        Medium: 29.00,
        Large: 39.00
    },
    addon: {
        Yes: 5.00,
        No: 0.00
    }
};

// Initialize data from localStorage
let salesData = JSON.parse(localStorage.getItem('jksSalesData')) || [];
let inventoryData = JSON.parse(localStorage.getItem('jksInventoryData')) || {
    'Green Apple': 20,
    'Blueberry': 20,
    'Strawberry': 20,
    'Lychee': 20,
    'Nata': 50
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    renderInventory();
    updateDashboard();
});

// Tab switching
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    updateDashboard();
}

// Update price display based on selections
function updatePrice() {
    const flavor = document.getElementById('flavor').value;
    const size = document.getElementById('size').value;
    const addon = document.getElementById('addon').value;
    
    if (!flavor || !size) {
        document.getElementById('priceDisplay').textContent = 'Price: Select all options';
        return;
    }
    
    const basePrice = PRICING.sizes[size] || 0;
    const addonPrice = PRICING.addon[addon] || 0;
    const totalPrice = basePrice + addonPrice;
    
    document.getElementById('priceDisplay').textContent = `Price per Cup: ₱${totalPrice.toFixed(2)}`;
}

// Record a single cup sale
function recordCupSale() {
    const flavor = document.getElementById('flavor').value;
    const size = document.getElementById('size').value;
    const addon = document.getElementById('addon').value;
    const cupCost = parseFloat(document.getElementById('cupCost').value);
    
    // Validation
    if (!flavor || !size) {
        alert('Please select flavor and size');
        return;
    }
    
    if (isNaN(cupCost) || cupCost < 0) {
        alert('Please enter a valid cost');
        return;
    }
    
    // Check inventory
    if (inventoryData[flavor] <= 0) {
        alert(`Out of ${flavor}! Please restock.`);
        return;
    }
    
    if (addon === 'Yes' && inventoryData['Nata'] <= 0) {
        alert('Out of Nata de Coco! Please restock.');
        return;
    }
    
    // Calculate price
    const basePrice = PRICING.sizes[size];
    const addonPrice = PRICING.addon[addon];
    const totalPrice = basePrice + addonPrice;
    const profit = totalPrice - cupCost;
    
    // Create sale record
    const sale = {
        id: Date.now(),
        flavor: flavor,
        size: size,
        addon: addon,
        price: totalPrice,
        cost: cupCost,
        profit: profit,
        timestamp: new Date().toLocaleTimeString()
    };
    
    // Add to sales data
    salesData.push(sale);
    
    // Deduct inventory
    inventoryData[flavor]--;
    if (addon === 'Yes') {
        inventoryData['Nata']--;
    }
    
    // Save to localStorage
    saveData();
    
    // Clear form
    document.getElementById('flavor').value = '';
    document.getElementById('size').value = '';
    document.getElementById('addon').value = 'No';
    document.getElementById('cupCost').value = '';
    document.getElementById('priceDisplay').textContent = 'Price: ₱0.00';
    
    // Show success message
    const successMsg = document.getElementById('saleSuccess');
    successMsg.classList.add('show');
    setTimeout(() => successMsg.classList.remove('show'), 3000);
    
    // Update displays
    updateDashboard();
    renderInventory();
}

// Add inventory
function addInventory() {
    const flavor = document.getElementById('invFlavor').value;
    const quantity = parseInt(document.getElementById('addStock').value);
    
    if (!flavor || isNaN(quantity) || quantity <= 0) {
        alert('Please select flavor and enter valid quantity');
        return;
    }
    
    inventoryData[flavor] = (inventoryData[flavor] || 0) + quantity;
    
    document.getElementById('invFlavor').value = '';
    document.getElementById('addStock').value = '10';
    
    const successMsg = document.getElementById('invSuccess');
    successMsg.classList.add('show');
    setTimeout(() => successMsg.classList.remove('show'), 3000);
    
    saveData();
    renderInventory();
    updateDashboard();
}

// Update Nata stock
function updateNata() {
    const current = parseInt(document.getElementById('nataPCS').value);
    const add = parseInt(document.getElementById('addNata').value);
    
    if (isNaN(current) || isNaN(add) || add <= 0 || current < 0) {
        alert('Please enter valid numbers');
        return;
    }
    
    inventoryData['Nata'] = current + add;
    document.getElementById('addNata').value = '10';
    document.getElementById('nataPCS').value = inventoryData['Nata'];
    
    const successMsg = document.getElementById('invSuccess');
    successMsg.classList.add('show');
    setTimeout(() => successMsg.classList.remove('show'), 3000);
    
    saveData();
    renderInventory();
    updateDashboard();
}

// Render inventory display
function renderInventory() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    const flavors = ['Green Apple', 'Blueberry', 'Strawberry', 'Lychee'];
    const emojis = {
        'Green Apple': '🟢',
        'Blueberry': '🔵',
        'Strawberry': '🔴',
        'Lychee': '🩷'
    };
    
    let html = '';
    flavors.forEach(flavor => {
        const stock = inventoryData[flavor] || 0;
        const isLow = stock <= 5;
        html += `
            <div class="inventory-item ${isLow ? 'low' : ''}">
                <h3>${emojis[flavor]} ${flavor}</h3>
                <div class="count">${stock}</div>
                <small>${isLow ? '⚠️ Low Stock!' : 'cups available'}</small>
            </div>
        `;
    });
    
    // Add Nata
    const nataStock = inventoryData['Nata'] || 0;
    const nataLow = nataStock <= 10;
    html += `
        <div class="inventory-item ${nataLow ? 'low' : ''}">
            <h3>🧃 Nata de Coco</h3>
            <div class="count">${nataStock}</div>
            <small>${nataLow ? '⚠️ Low Stock!' : 'pieces available'}</small>
        </div>
    `;
    
    inventoryGrid.innerHTML = html;
    
    // Update Nata display in inventory tab
    document.getElementById('nataPCS').value = nataStock;
}

// Update main dashboard
function updateDashboard() {
    if (salesData.length === 0) {
        document.getElementById('cupsSold').textContent = '0';
        document.getElementById('totalRevenue').textContent = '₱0.00';
        document.getElementById('totalCost').textContent = '₱0.00';
        document.getElementById('totalProfit').textContent = '₱0.00';
        document.getElementById('profitMargin').textContent = '0%';
        document.getElementById('avgProfit').textContent = '₱0.00';
        document.getElementById('totalDailyProfit').textContent = '₱0.00';
        document.getElementById('flavorStats').innerHTML = '<p style="color: #999;">No sales yet</p>';
        document.getElementById('dailyLog').innerHTML = '<p style="text-align: center; color: #999;">No sales recorded yet...</p>';
        document.getElementById('summaryTable').innerHTML = '';
        document.getElementById('dailySummary').innerHTML = '<p>No sales recorded yet. Start selling cups to see the summary.</p>';
        document.getElementById('bestSeller').textContent = '-';
        document.getElementById('mostProfitable').textContent = '-';
        document.getElementById('totalUnits').textContent = '0';
        return;
    }
    
    // Calculate totals
    const totalRevenue = salesData.reduce((sum, sale) => sum + sale.price, 0);
    const totalCost = salesData.reduce((sum, sale) => sum + sale.cost, 0);
    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;
    const avgProfit = salesData.length > 0 ? (totalProfit / salesData.length) : 0;
    
    // Update metrics
    document.getElementById('cupsSold').textContent = salesData.length;
    document.getElementById('totalRevenue').textContent = `₱${totalRevenue.toFixed(2)}`;
    document.getElementById('totalCost').textContent = `₱${totalCost.toFixed(2)}`;
    document.getElementById('totalProfit').textContent = `₱${totalProfit.toFixed(2)}`;
    document.getElementById('profitMargin').textContent = `${profitMargin}%`;
    document.getElementById('avgProfit').textContent = `₱${avgProfit.toFixed(2)}`;
    document.getElementById('totalDailyProfit').textContent = `₱${totalProfit.toFixed(2)}`;
    
    // Flavor statistics
    updateFlavorStats();
    
    // Daily log (most recent first)
    renderDailyLog();
    
    // Summary table
    renderSummaryTable();
    
    // Performance stats
    updatePerformanceStats();
    
    // Low stock alerts
    updateLowStockAlerts();
}

// Update flavor statistics
function updateFlavorStats() {
    const flavorStats = {};
    
    salesData.forEach(sale => {
        if (!flavorStats[sale.flavor]) {
            flavorStats[sale.flavor] = { count: 0, profit: 0 };
        }
        flavorStats[sale.flavor].count++;
        flavorStats[sale.flavor].profit += sale.profit;
    });
    
    let html = '';
    const emojis = {
        'Green Apple': '🟢',
        'Blueberry': '🔵',
        'Strawberry': '🔴',
        'Lychee': '🩷'
    };
    
    Object.keys(flavorStats).sort().forEach(flavor => {
        const stats = flavorStats[flavor];
        html += `
            <div class="metric">
                <span class="metric-label">${emojis[flavor]} ${flavor}</span>
                <span style="color: #666; font-size: 0.95em;">${stats.count} cups | Profit: ₱${stats.profit.toFixed(2)}</span>
            </div>
        `;
    });
    
    document.getElementById('flavorStats').innerHTML = html || '<p style="color: #999;">No sales yet</p>';
}

// Render daily log (most recent first)
function renderDailyLog() {
    const dailyLog = document.getElementById('dailyLog');
    
    if (salesData.length === 0) {
        dailyLog.innerHTML = '<p style="text-align: center; color: #999;">No sales recorded yet...</p>';
        return;
    }
    
    const emojis = {
        'Green Apple': '🟢',
        'Blueberry': '🔵',
        'Strawberry': '🔴',
        'Lychee': '🩷'
    };
    
    let html = '';
    // Reverse to show most recent first
    [...salesData].reverse().forEach(sale => {
        const profitClass = sale.profit >= 0 ? 'log-profit' : 'loss';
        html += `
            <div class="log-entry">
                <div>
                    <span class="log-time">${sale.timestamp}</span> - 
                    ${emojis[sale.flavor]} ${sale.flavor} (${sale.size})
                    ${sale.addon === 'Yes' ? '+ 🧃 Nata' : ''}
                </div>
                <div style="margin-top: 5px; font-size: 0.85em;">
                    💰 ₱${sale.price.toFixed(2)} | Cost: ₱${sale.cost.toFixed(2)} | 
                    <span class="${profitClass}">Profit: ₱${sale.profit.toFixed(2)}</span>
                </div>
            </div>
        `;
    });
    
    dailyLog.innerHTML = html;
}

// Render summary table
function renderSummaryTable() {
    const summaryTable = document.getElementById('summaryTable');
    const emojis = {
        'Green Apple': '🟢',
        'Blueberry': '🔵',
        'Strawberry': '🔴',
        'Lychee': '🩷'
    };
    
    if (salesData.length === 0) {
        summaryTable.innerHTML = '';
        return;
    }
    
    let html = '';
    salesData.forEach((sale, index) => {
        const profitClass = sale.profit >= 0 ? 'style="color: #10b981;"' : 'style="color: #ef4444;"';
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${emojis[sale.flavor]} ${sale.flavor}</td>
                <td>${sale.size}</td>
                <td>${sale.addon}</td>
                <td>₱${sale.price.toFixed(2)}</td>
                <td>₱${sale.cost.toFixed(2)}</td>
                <td ${profitClass}>₱${sale.profit.toFixed(2)}</td>
                <td>${sale.timestamp}</td>
                <td><button class="delete-btn btn-small" onclick="deleteSale(${sale.id})">🗑️</button></td>
            </tr>
        `;
    });
    
    summaryTable.innerHTML = html;
}

// Delete a sale
function deleteSale(saleId) {
    if (!confirm('Delete this cup sale?')) return;
    
    const saleIndex = salesData.findIndex(s => s.id === saleId);
    if (saleIndex === -1) return;
    
    const sale = salesData[saleIndex];
    
    // Restore inventory
    inventoryData[sale.flavor]++;
    if (sale.addon === 'Yes') {
        inventoryData['Nata']++;
    }
    
    // Remove from sales
    salesData.splice(saleIndex, 1);
    
    saveData();
    updateDashboard();
    renderInventory();
}

// Update performance stats
function updatePerformanceStats() {
    if (salesData.length === 0) {
        document.getElementById('bestSeller').textContent = '-';
        document.getElementById('mostProfitable').textContent = '-';
        document.getElementById('totalUnits').textContent = '0';
        return;
    }
    
    const flavorStats = {};
    const emojis = {
        'Green Apple': '🟢',
        'Blueberry': '🔵',
        'Strawberry': '🔴',
        'Lychee': '🩷'
    };
    
    salesData.forEach(sale => {
        if (!flavorStats[sale.flavor]) {
            flavorStats[sale.flavor] = { count: 0, totalProfit: 0 };
        }
        flavorStats[sale.flavor].count++;
        flavorStats[sale.flavor].totalProfit += sale.profit;
    });
    
    // Best seller (most cups sold)
    let bestSeller = Object.keys(flavorStats)[0];
    let maxCount = 0;
    Object.keys(flavorStats).forEach(flavor => {
        if (flavorStats[flavor].count > maxCount) {
            maxCount = flavorStats[flavor].count;
            bestSeller = flavor;
        }
    });
    
    // Most profitable
    let mostProfitable = Object.keys(flavorStats)[0];
    let maxProfit = 0;
    Object.keys(flavorStats).forEach(flavor => {
        if (flavorStats[flavor].totalProfit > maxProfit) {
            maxProfit = flavorStats[flavor].totalProfit;
            mostProfitable = flavor;
        }
    });
    
    document.getElementById('bestSeller').textContent = `${emojis[bestSeller]} ${bestSeller} (${maxCount} cups)`;
    document.getElementById('mostProfitable').textContent = `${emojis[mostProfitable]} ${mostProfitable} (₱${maxProfit.toFixed(2)})`;
    document.getElementById('totalUnits').textContent = salesData.length;
}

// Update low stock alerts
function updateLowStockAlerts() {
    const lowStockAlert = document.getElementById('lowStockAlert');
    let alerts = [];
    const emojis = {
        'Green Apple': '🟢',
        'Blueberry': '🔵',
        'Strawberry': '🔴',
        'Lychee': '🩷'
    };
    
    const flavors = ['Green Apple', 'Blueberry', 'Strawberry', 'Lychee'];
    flavors.forEach(flavor => {
        if (inventoryData[flavor] <= 5) {
            alerts.push(`${emojis[flavor]} ${flavor}: Only ${inventoryData[flavor]} cups left`);
        }
    });
    
    if (inventoryData['Nata'] <= 10) {
        alerts.push(`🧃 Nata de Coco: Only ${inventoryData['Nata']} pieces left`);
    }
    
    if (alerts.length === 0) {
        lowStockAlert.innerHTML = '<p style="color: #10b981;">✓ All stocks are good!</p>';
    } else {
        lowStockAlert.innerHTML = alerts.map(alert => `<p style="color: #ef4444; margin: 8px 0;">⚠️ ${alert}</p>`).join('');
    }
}

// Clear daily log
function clearDailyLog() {
    if (!confirm('Delete ALL cup sales for today? This cannot be undone!')) return;
    
    // Restore all inventory
    salesData.forEach(sale => {
        inventoryData[sale.flavor]++;
        if (sale.addon === 'Yes') {
            inventoryData['Nata']++;
        }
    });
    
    salesData = [];
    saveData();
    updateDashboard();
    renderInventory();
}

// Save to localStorage
function saveData() {
    localStorage.setItem('jksSalesData', JSON.stringify(salesData));
    localStorage.setItem('jksInventoryData', JSON.stringify(inventoryData));
}
