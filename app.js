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
let expensesData = JSON.parse(localStorage.getItem('jksExpensesData')) || [];
let inventoryData = JSON.parse(localStorage.getItem('jksInventoryData')) || {
    'Medium': 50,
    'Large': 50,
    'Nata': 50
};

let editingSaleId = null;

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
    const size = document.getElementById('size').value;
    const addon = document.getElementById('addon').value;
    
    if (!size) {
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
    const size = document.getElementById('size').value;
    const addon = document.getElementById('addon').value;
    const cupCost = parseFloat(document.getElementById('cupCost').value);
    
    // Validation
    if (!size) {
        alert('Please select cup size');
        return;
    }
    
    if (isNaN(cupCost) || cupCost < 0) {
        alert('Please enter a valid cost');
        return;
    }
    
    if (editingSaleId) {
        // Update existing sale
        const saleIndex = salesData.findIndex(s => s.id === editingSaleId);
        if (saleIndex === -1) return;
        
        const oldSale = salesData[saleIndex];
        
        // Restore old inventory
        inventoryData[oldSale.size]++;
        if (oldSale.addon === 'Yes') {
            inventoryData['Nata']++;
        }
        
        // Check new inventory
        if (inventoryData[size] <= 0) {
            alert(`Out of ${size} cups! Please restock.`);
            // Restore back
            inventoryData[oldSale.size]--;
            if (oldSale.addon === 'Yes') {
                inventoryData['Nata']--;
            }
            return;
        }
        
        if (addon === 'Yes' && inventoryData['Nata'] <= 0) {
            alert('Out of Nata de Coco! Please restock.');
            // Restore back
            inventoryData[oldSale.size]--;
            if (oldSale.addon === 'Yes') {
                inventoryData['Nata']--;
            }
            return;
        }
        
        // Calculate new price
        const basePrice = PRICING.sizes[size];
        const addonPrice = PRICING.addon[addon];
        const totalPrice = basePrice + addonPrice;
        const profit = totalPrice - cupCost;
        
        // Update sale
        salesData[saleIndex] = {
            ...oldSale,
            size: size,
            addon: addon,
            price: totalPrice,
            cost: cupCost,
            profit: profit
        };
        
        // Deduct new inventory
        inventoryData[size]--;
        if (addon === 'Yes') {
            inventoryData['Nata']--;
        }
        
        editingSaleId = null;
        document.querySelector('button[onclick="recordCupSale()"]').textContent = '✅ Record Cup Sale';
        
        const successMsg = document.getElementById('saleSuccess');
        successMsg.textContent = '✓ Cup sale updated successfully!';
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 3000);
    } else {
        // Check inventory
        if (inventoryData[size] <= 0) {
            alert(`Out of ${size} cups! Please restock.`);
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
        inventoryData[size]--;
        if (addon === 'Yes') {
            inventoryData['Nata']--;
        }
        
        const successMsg = document.getElementById('saleSuccess');
        successMsg.textContent = '✓ Cup sale recorded successfully!';
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 3000);
    }
    
    // Save to localStorage
    saveData();
    
    // Clear form
    document.getElementById('size').value = '';
    document.getElementById('addon').value = 'No';
    document.getElementById('cupCost').value = '';
    document.getElementById('priceDisplay').textContent = 'Price: ₱0.00';
    
    // Update displays
    updateDashboard();
    renderInventory();
}

// Edit a sale
function editSale(saleId) {
    const sale = salesData.find(s => s.id === saleId);
    if (!sale) return;
    
    editingSaleId = saleId;
    document.getElementById('size').value = sale.size;
    document.getElementById('addon').value = sale.addon;
    document.getElementById('cupCost').value = sale.cost;
    updatePrice();
    
    // Change button text
    document.querySelector('button[onclick="recordCupSale()"]').textContent = '✏️ Update Cup Sale';
    
    // Scroll to form
    document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
}

// Cancel edit
function cancelEdit() {
    editingSaleId = null;
    document.getElementById('size').value = '';
    document.getElementById('addon').value = 'No';
    document.getElementById('cupCost').value = '';
    document.getElementById('priceDisplay').textContent = 'Price: ₱0.00';
    document.querySelector('button[onclick="recordCupSale()"]').textContent = '✅ Record Cup Sale';
}

// Add expense
function addExpense() {
    const desc = document.getElementById('expenseDesc').value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    
    if (!desc) {
        alert('Please enter expense description');
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    const expense = {
        id: Date.now(),
        description: desc,
        amount: amount,
        timestamp: new Date().toLocaleTimeString()
    };
    
    expensesData.push(expense);
    
    // Clear form
    document.getElementById('expenseDesc').value = '';
    document.getElementById('expenseAmount').value = '';
    
    // Show success message
    const successMsg = document.getElementById('expenseSuccess');
    successMsg.classList.add('show');
    setTimeout(() => successMsg.classList.remove('show'), 3000);
    
    saveData();
    updateDashboard();
}

// Delete expense
function deleteExpense(expenseId) {
    if (!confirm('Delete this expense?')) return;
    
    expensesData = expensesData.filter(e => e.id !== expenseId);
    
    saveData();
    updateDashboard();
}

// Edit expense
function editExpense(expenseId) {
    const expense = expensesData.find(e => e.id === expenseId);
    if (!expense) return;
    
    document.getElementById('expenseDesc').value = expense.description;
    document.getElementById('expenseAmount').value = expense.amount;
    
    deleteExpense(expenseId);
}

// Render expense log
function renderExpenseLog() {
    const expenseLog = document.getElementById('expenseLog');
    
    if (expensesData.length === 0) {
        expenseLog.innerHTML = '<p style="text-align: center; color: #999;">No expenses recorded yet...</p>';
        return;
    }
    
    let html = '';
    [...expensesData].reverse().forEach(expense => {
        html += `
            <div class="log-entry">
                <div>
                    <span class="log-time">${expense.timestamp}</span> - 
                    ${expense.description}
                </div>
                <div style="margin-top: 5px; font-size: 0.85em;">
                    💸 ₱${expense.amount.toFixed(2)}
                    <button class="delete-btn btn-small" onclick="editExpense(${expense.id})" style="margin-top: 0; background: #667eea;">✏️</button>
                    <button class="delete-btn btn-small" onclick="deleteExpense(${expense.id})" style="margin-top: 0;">🗑️</button>
                </div>
            </div>
        `;
    });
    
    expenseLog.innerHTML = html;
}

// Add inventory
function addInventory(size) {
    const inputId = size === 'Medium' ? 'addStock12' : 'addStock16';
    const successId = size === 'Medium' ? 'invSuccess12' : 'invSuccess16';
    const quantity = parseInt(document.getElementById(inputId).value);
    
    if (isNaN(quantity) || quantity <= 0) {
        alert('Please enter valid quantity');
        return;
    }
    
    inventoryData[size] = (inventoryData[size] || 0) + quantity;
    
    document.getElementById(inputId).value = '10';
    
    const successMsg = document.getElementById(successId);
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
    
    const successMsg = document.getElementById('invSuccess16');
    successMsg.textContent = '✓ Nata stock updated!';
    successMsg.classList.add('show');
    setTimeout(() => successMsg.classList.remove('show'), 3000);
    
    saveData();
    renderInventory();
    updateDashboard();
}

// Render inventory display
function renderInventory() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    
    let html = '';
    
    // 12oz (Medium)
    const mediumStock = inventoryData['Medium'] || 0;
    const mediumLow = mediumStock <= 10;
    html += `
        <div class="inventory-item ${mediumLow ? 'low' : ''}">
            <h3>📏 12oz (Medium)</h3>
            <div class="count">${mediumStock}</div>
            <small>${mediumLow ? '⚠️ Low Stock!' : 'cups available'}</small>
        </div>
    `;
    
    // 16oz (Large)
    const largeStock = inventoryData['Large'] || 0;
    const largeLow = largeStock <= 10;
    html += `
        <div class="inventory-item ${largeLow ? 'low' : ''}">
            <h3>📏 16oz (Large)</h3>
            <div class="count">${largeStock}</div>
            <small>${largeLow ? '⚠️ Low Stock!' : 'cups available'}</small>
        </div>
    `;
    
    // Nata
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
        document.getElementById('totalExpenses').textContent = '₱0.00';
        document.getElementById('totalProfit').textContent = '₱0.00';
        document.getElementById('profitMargin').textContent = '0%';
        document.getElementById('mediumSold').textContent = '0';
        document.getElementById('largeSold').textContent = '0';
        document.getElementById('perfMedium').textContent = '0';
        document.getElementById('perfLarge').textContent = '0';
        document.getElementById('summaryRevenue').textContent = '₱0.00';
        document.getElementById('summaryCost').textContent = '₱0.00';
        document.getElementById('summaryProfit').textContent = '₱0.00';
        document.getElementById('dailyLog').innerHTML = '<p style="text-align: center; color: #999;">No sales recorded yet...</p>';
        document.getElementById('summaryTable').innerHTML = '';
        document.getElementById('dailySummary').innerHTML = '<p>No sales recorded yet. Start selling cups to see the summary.</p>';
    } else {
        // Calculate totals
        const totalRevenue = salesData.reduce((sum, sale) => sum + sale.price, 0);
        const totalCost = salesData.reduce((sum, sale) => sum + sale.cost, 0);
        
        // Count by size
        const mediumCount = salesData.filter(s => s.size === 'Medium').length;
        const largeCount = salesData.filter(s => s.size === 'Large').length;
        
        const totalProfit = totalRevenue - totalCost;
        const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;
        
        // Update metrics
        document.getElementById('cupsSold').textContent = salesData.length;
        document.getElementById('totalRevenue').textContent = `₱${totalRevenue.toFixed(2)}`;
        document.getElementById('totalCost').textContent = `₱${totalCost.toFixed(2)}`;
        document.getElementById('totalProfit').textContent = `₱${totalProfit.toFixed(2)}`;
        document.getElementById('profitMargin').textContent = `${profitMargin}%`;
        document.getElementById('mediumSold').textContent = mediumCount;
        document.getElementById('largeSold').textContent = largeCount;
        document.getElementById('perfMedium').textContent = mediumCount;
        document.getElementById('perfLarge').textContent = largeCount;
        document.getElementById('summaryRevenue').textContent = `₱${totalRevenue.toFixed(2)}`;
        document.getElementById('summaryCost').textContent = `₱${totalCost.toFixed(2)}`;
        
        // Daily log (most recent first)
        renderDailyLog();
        
        // Summary table
        renderSummaryTable();
        
        // Daily summary text
        document.getElementById('dailySummary').innerHTML = `
            <p><strong>Today's Performance:</strong></p>
            <p>✅ Total Cups Sold: ${salesData.length} (${mediumCount}x 12oz, ${largeCount}x 16oz)</p>
            <p>💰 Revenue: ₱${totalRevenue.toFixed(2)} | Cost: ₱${totalCost.toFixed(2)} | Profit: ���${totalProfit.toFixed(2)}</p>
            <p>📊 Profit Margin: ${profitMargin}%</p>
        `;
    }
    
    // Update expenses
    updateExpenses();
    
    // Low stock alerts
    updateLowStockAlerts();
}

// Update expenses display
function updateExpenses() {
    const totalExpenses = expensesData.reduce((sum, e) => sum + e.amount, 0);
    document.getElementById('totalExpenses').textContent = `₱${totalExpenses.toFixed(2)}`;
    document.getElementById('expenseSummaryTotal').textContent = `₱${totalExpenses.toFixed(2)}`;
    document.getElementById('expenseCount').textContent = expensesData.length;
    document.getElementById('summaryExpenses').textContent = `₱${totalExpenses.toFixed(2)}`;
    
    // Update net profit
    const totalRevenue = salesData.reduce((sum, sale) => sum + sale.price, 0);
    const totalCost = salesData.reduce((sum, sale) => sum + sale.cost, 0);
    const netProfit = totalRevenue - totalCost - totalExpenses;
    
    document.getElementById('summaryProfit').textContent = `₱${netProfit.toFixed(2)}`;
    
    renderExpenseLog();
}

// Render daily log (most recent first)
function renderDailyLog() {
    const dailyLog = document.getElementById('dailyLog');
    
    if (salesData.length === 0) {
        dailyLog.innerHTML = '<p style="text-align: center; color: #999;">No sales recorded yet...</p>';
        return;
    }
    
    let html = '';
    // Reverse to show most recent first
    [...salesData].reverse().forEach(sale => {
        const profitClass = sale.profit >= 0 ? 'log-profit' : 'loss';
        html += `
            <div class="log-entry">
                <div>
                    <span class="log-time">${sale.timestamp}</span> - 
                    ${sale.size === 'Medium' ? '📏 12oz' : '📏 16oz'}
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
    
    if (salesData.length === 0) {
        summaryTable.innerHTML = '';
        return;
    }
    
    let html = '';
    salesData.forEach((sale, index) => {
        const profitClass = sale.profit >= 0 ? 'style="color: #10b981;"' : 'style="color: #ef4444;"';
        const sizeDisplay = sale.size === 'Medium' ? '12oz' : '16oz';
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${sizeDisplay}</td>
                <td>${sale.addon}</td>
                <td>₱${sale.price.toFixed(2)}</td>
                <td>₱${sale.cost.toFixed(2)}</td>
                <td ${profitClass}>₱${sale.profit.toFixed(2)}</td>
                <td>${sale.timestamp}</td>
                <td>
                    <button class="delete-btn btn-small" onclick="editSale(${sale.id})" style="background: #667eea;">✏️ Edit</button>
                    <button class="delete-btn btn-small" onclick="deleteSale(${sale.id})">🗑️ Delete</button>
                </td>
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
    inventoryData[sale.size]++;
    if (sale.addon === 'Yes') {
        inventoryData['Nata']++;
    }
    
    // Remove from sales
    salesData.splice(saleIndex, 1);
    
    saveData();
    updateDashboard();
    renderInventory();
}

// Update low stock alerts
function updateLowStockAlerts() {
    const lowStockAlert = document.getElementById('lowStockAlert');
    let alerts = [];
    
    if ((inventoryData['Medium'] || 0) <= 10) {
        alerts.push(`📏 12oz (Medium): Only ${inventoryData['Medium']} cups left`);
    }
    
    if ((inventoryData['Large'] || 0) <= 10) {
        alerts.push(`📏 16oz (Large): Only ${inventoryData['Large']} cups left`);
    }
    
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
        inventoryData[sale.size]++;
        if (sale.addon === 'Yes') {
            inventoryData['Nata']++;
        }
    });
    
    salesData = [];
    saveData();
    updateDashboard();
    renderInventory();
}

// Clear expenses
function clearExpenses() {
    if (!confirm('Delete ALL expenses for today? This cannot be undone!')) return;
    
    expensesData = [];
    saveData();
    updateDashboard();
}

// Save to localStorage
function saveData() {
    localStorage.setItem('jksSalesData', JSON.stringify(salesData));
    localStorage.setItem('jksExpensesData', JSON.stringify(expensesData));
    localStorage.setItem('jksInventoryData', JSON.stringify(inventoryData));
}
