import React, { useState, useEffect } from 'react';
import { 
  FiDollarSign, FiTrendingUp, FiShoppingBag, 
  FiPackage, FiAlertTriangle, FiAlertCircle 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getAllOrders } from '../../firebase/orderService';
import { LOW_STOCK_THRESHOLD } from '../../firebase/inventoryService';
import { getAllProducts } from '../../firebase/productService';

const STATUS_COLORS = {
  pending: 'bg-blue-100 text-blue-800',
  Processing: 'bg-blue-100 text-blue-800',
  Confirmed: 'bg-purple-100 text-purple-800',
  Packed: 'bg-purple-100 text-purple-800',
  Shipped: 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-gray-100 text-gray-800',
  refunded: 'bg-gray-100 text-gray-800'
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProfit: 0,
    stockValue: 0,
    totalOrders: 0,
    pendingOrders: 0
  });
  const [bestSellers, setBestSellers] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [orders, products] = await Promise.all([
          getAllOrders(),
          getAllProducts(),
        ]);

        // Process Orders
        let totalSales = 0;
        let totalProfit = 0;
        let pendingOrdersCount = 0;
        const productSales = {};

        // Product map for quick lookup
        const productMap = {};
        products.forEach(p => {
          productMap[p.id] = p;
        });

        // Filter and process orders
        orders.forEach(order => {
          const status = order.status || '';
          const isCompleted = status !== 'cancelled' && status !== 'refunded' && status !== 'Cancelled';
          
          if (isCompleted) {
            totalSales += Number(order.total || 0);
            
            // Aggregate best sellers
            if (order.items && Array.isArray(order.items)) {
              order.items.forEach(item => {
                const pid = item.productId;
                if (!productSales[pid]) {
                  productSales[pid] = {
                    productId: pid,
                    name: item.name,
                    image: item.image || (productMap[pid]?.images?.[0]),
                    unitsSold: 0,
                    revenue: 0
                  };
                }
                productSales[pid].unitsSold += item.quantity || 1;
                productSales[pid].revenue += (item.price * (item.quantity || 1));
              });
            }
          }

          if (status === 'Delivered') {
            if (order.items && Array.isArray(order.items)) {
              order.items.forEach(item => {
                const product = productMap[item.productId];
                const costPrice = product?.costPrice || 0;
                const sellingPrice = item.price || 0;
                const qty = item.quantity || 1;
                if (costPrice > 0) {
                  totalProfit += (sellingPrice - costPrice) * qty;
                }
              });
            }
          }

          if (status === 'Processing' || status === 'pending') {
            pendingOrdersCount++;
          }
        });

        // Best Sellers
        const top5Products = Object.values(productSales)
          .sort((a, b) => b.unitsSold - a.unitsSold)
          .slice(0, 5);

        // Process Products for Stock Value and Low Stock
        let totalStockValue = 0;
        const lowStockList = [];
        const threshold = LOW_STOCK_THRESHOLD || 5;

        products.forEach(product => {
          let totalStock = 0;
          if (product.sizes) {
            Object.entries(product.sizes).forEach(([size, sizeData]) => {
              const stock = Number(sizeData.stock || 0);
              totalStock += stock;
              
              if (stock <= threshold) {
                lowStockList.push({
                  productId: product.id,
                  name: product.name,
                  size: size,
                  stock: stock,
                  image: product.images?.[0] || null
                });
              }
            });
          }
          
          const val = Number(product.costPrice || product.price || 0);
          totalStockValue += val * totalStock;
        });

        // Sort low stock by stock ascending
        lowStockList.sort((a, b) => a.stock - b.stock);

        setStats({
          totalSales,
          totalProfit,
          stockValue: totalStockValue,
          totalOrders: orders.length,
          pendingOrders: pendingOrdersCount
        });
        
        setBestSellers(top5Products);
        setLowStockItems(lowStockList);
        
        // Recent orders
        const sortedOrders = [...orders].sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return dateB - dateA;
        });
        
        setRecentOrders(sortedOrders.slice(0, 5));

      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
  };

  const formatDate = (dateObj) => {
    if (!dateObj) return 'N/A';
    const date = dateObj.toDate ? dateObj.toDate() : new Date(dateObj);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-[#8A8178] animate-pulse font-medium">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif text-[#2E2A27]">Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-[#ECE8E3] p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-full text-green-700">
              <FiDollarSign size={20} />
            </div>
            <span className="text-sm text-[#8A8178] font-medium">Total Sales</span>
          </div>
          <div className="text-2xl font-serif text-[#2E2A27]">{formatCurrency(stats.totalSales)}</div>
        </div>
        
        <div className="bg-white rounded-2xl border border-[#ECE8E3] p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 rounded-full text-emerald-700">
              <FiTrendingUp size={20} />
            </div>
            <span className="text-sm text-[#8A8178] font-medium">Total Profit</span>
          </div>
          <div className="text-2xl font-serif text-[#2E2A27]">{formatCurrency(stats.totalProfit)}</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#ECE8E3] p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 rounded-full text-amber-700">
              <FiPackage size={20} />
            </div>
            <span className="text-sm text-[#8A8178] font-medium">Stock Value</span>
          </div>
          <div className="text-2xl font-serif text-[#2E2A27]">{formatCurrency(stats.stockValue)}</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#ECE8E3] p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-full text-blue-700">
              <FiShoppingBag size={20} />
            </div>
            <span className="text-sm text-[#8A8178] font-medium">Total Orders</span>
          </div>
          <div className="text-2xl font-serif text-[#2E2A27]">{stats.totalOrders}</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#ECE8E3] p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 rounded-full text-orange-700">
              <FiAlertCircle size={20} />
            </div>
            <span className="text-sm text-[#8A8178] font-medium">Pending Orders</span>
          </div>
          <div className="text-2xl font-serif text-[#2E2A27]">{stats.pendingOrders}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Selling Products */}
        <div className="bg-white rounded-2xl border border-[#ECE8E3] p-6">
          <h2 className="text-lg font-medium text-[#2E2A27] mb-4">Best-Selling Products</h2>
          {bestSellers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8F5F1] text-xs text-[#8A8178] uppercase tracking-wider">
                    <th className="p-3 rounded-l-lg font-medium">#</th>
                    <th className="p-3 font-medium">Product</th>
                    <th className="p-3 font-medium">Units Sold</th>
                    <th className="p-3 rounded-r-lg font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {bestSellers.map((item, index) => (
                    <tr key={item.productId} className="border-b border-[#ECE8E3] last:border-0 hover:bg-[#F8F5F1]/30">
                      <td className="p-3 text-[#6F6A65]">{index + 1}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover border border-[#ECE8E3]" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-[#F8F5F1] border border-[#ECE8E3]"></div>
                          )}
                          <span className="text-sm font-medium text-[#2E2A27] truncate max-w-[200px]">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-[#6F6A65] font-medium">{item.unitsSold}</td>
                      <td className="p-3 text-[#6F6A65]">{formatCurrency(item.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-[#8A8178] text-sm">No sales data available yet.</div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-[#ECE8E3] p-6">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-medium text-[#2E2A27]">Low Stock Alerts</h2>
            {lowStockItems.length > 0 && (
              <span className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium border border-red-100">
                {lowStockItems.length} {lowStockItems.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          
          {lowStockItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8F5F1] text-xs text-[#8A8178] uppercase tracking-wider">
                    <th className="p-3 rounded-l-lg font-medium">Product</th>
                    <th className="p-3 font-medium">Size</th>
                    <th className="p-3 font-medium">Stock</th>
                    <th className="p-3 rounded-r-lg font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.slice(0, 5).map((item, index) => (
                    <tr key={`${item.productId}-${item.size}-${index}`} className="border-b border-[#ECE8E3] last:border-0 hover:bg-[#F8F5F1]/30">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover border border-[#ECE8E3]" />
                          ) : (
                            <div className="w-8 h-8 rounded bg-[#F8F5F1] border border-[#ECE8E3]"></div>
                          )}
                          <span className="text-sm font-medium text-[#2E2A27] truncate max-w-[150px]">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-[#6F6A65] font-medium">{item.size}</td>
                      <td className="p-3 text-[#6F6A65] font-medium">{item.stock}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                          <FiAlertTriangle size={12} />
                          {item.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-[#8A8178] text-sm">All products are well-stocked.</div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-[#ECE8E3] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-[#2E2A27]">Recent Orders</h2>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F5F1] text-xs text-[#8A8178] uppercase tracking-wider">
                  <th className="p-3 rounded-l-lg font-medium">Order ID</th>
                  <th className="p-3 font-medium">Customer</th>
                  <th className="p-3 font-medium">Date</th>
                  <th className="p-3 font-medium">Amount</th>
                  <th className="p-3 rounded-r-lg font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const statusClass = STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800';
                  return (
                    <tr key={order.id} className="border-b border-[#ECE8E3] last:border-0 hover:bg-[#F8F5F1]/30">
                      <td className="p-3 font-medium text-[#465348]">
                        #{order.id ? order.id.substring(0, 8) : 'N/A'}
                      </td>
                      <td className="p-3 text-[#2E2A27] text-sm">
                        {order.shippingAddress?.fullName || 'Unknown Customer'}
                      </td>
                      <td className="p-3 text-[#6F6A65] text-sm">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="p-3 text-[#2E2A27] font-medium text-sm">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-[#8A8178] text-sm">No recent orders found.</div>
        )}
      </div>
    </div>
  );
}