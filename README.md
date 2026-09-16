# 🥤 JK's Fruit Soda - Daily Business Tracker

A comprehensive daily tracking dashboard for recording cup sales, managing revenue/profit, and tracking inventory for your JK's Fruit Soda business.

## Features

### 📊 **Sell Cup Tab**
- **Record individual cup sales** with flavor, size, and add-ons
- **Automatic price calculation** based on selections:
  - Medium (12 oz): ₱29.00
  - Large (16 oz): ₱39.00
  - Add Nata de Coco: +₱5.00
- **Cost tracking** - Enter the cost to make each cup
- **Real-time profit calculation** per cup
- **Today's totals:**
  - Total cups sold
  - Total revenue
  - Total cost of goods
  - Total profit
  - Profit margin percentage
  - Average profit per cup

### 📦 **Inventory Tab**
- **Track stock levels** for all 4 flavors:
  - 🟢 Green Apple
  - 🔵 Blueberry
  - 🔴 Strawberry
  - 🩷 Lychee
- **Track Nata de Coco** pieces separately
- **Add stock** for any flavor
- **Visual low stock warnings** (red highlight when stock ≤ 5 cups for flavors, ≤ 10 for Nata)
- **Automatic inventory deduction** when you sell a cup

### 📈 **Summary Tab**
- **Daily sales summary table** with:
  - Sale number
  - Flavor & size sold
  - Price, cost, and profit per cup
  - Timestamp of each sale
  - Delete option for mistakes
- **Performance metrics:**
  - Best seller (most cups sold)
  - Most profitable flavor
  - Total cups sold
  - Total daily profit
- **Low stock alerts** - Know what needs restocking

## How to Use

### Recording a Cup Sale

1. Go to the **📊 Sell Cup** tab
2. Select the **Flavor** (Green Apple, Blueberry, Strawberry, or Lychee)
3. Select the **Cup Size** (Medium 12oz or Large 16oz)
4. Choose if adding **Nata de Coco** (yes/no)
5. The price will auto-calculate
6. Enter the **Cost to Make This Cup** (e.g., ₱12.50)
7. Click **✅ Record Cup Sale**
8. The sale is instantly logged and inventory is updated

### Managing Inventory

1. Go to the **📦 Inventory** tab
2. To add stock:
   - Select the flavor
   - Enter cups to add
   - Click **➕ Add Stock**
3. To update Nata de Coco:
   - Enter current stock + pieces to add
   - Click **🧃 Update Nata Stock**

### Viewing Summary

1. Go to the **📈 Summary** tab
2. See the complete sales table for the day
3. View performance metrics
4. Check low stock alerts
5. Delete any incorrectly recorded sales if needed

## Data Storage

- **All data is saved locally** in your browser using localStorage
- Data persists across browser sessions
- **To reset everything:** Clear your browser's local storage and refresh the page
- Data is **NOT** automatically synced to the cloud

## Pricing Reference

| Item | Price |
|------|-------|
| Medium (12 oz) | ₱29.00 |
| Large (16 oz) | ₱39.00 |
| Nata de Coco Add-on | ₱5.00 |

### Example Calculations

**Scenario 1: Medium Green Apple, No Nata**
- Selling Price: ₱29.00
- Cost to Make: ₱12.00
- **Profit: ₱17.00**

**Scenario 2: Large Blueberry with Nata**
- Selling Price: ₱39.00 + ₱5.00 = ₱44.00
- Cost to Make: ₱15.00
- **Profit: ₱29.00**

## Tips for Maximum Accuracy

1. **Record sales immediately** - Don't wait until end of day
2. **Keep accurate cost tracking** - Include ingredients + cup + packaging
3. **Monitor inventory** - Restock when approaching low stock alerts
4. **Review daily** - Check the summary before closing to catch any errors
5. **Delete & re-record** - If you make a mistake, delete the sale and record it again

## Features

✅ Real-time profit tracking  
✅ Automatic inventory management  
✅ Low stock alerts  
✅ Sales history log  
✅ Flavor-based analytics  
✅ Local data storage (no internet needed after loading)  
✅ Mobile-friendly design  
✅ Easy data correction  

## Browser Compatibility

Works on any modern browser:
- Chrome
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Support

For issues or feature requests, contact your developer or check the repository.

---

**JK's Fruit Soda Business Tracker** - Track your daily success! 🥤💰
