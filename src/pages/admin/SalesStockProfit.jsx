import React, { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiFilter, FiDownload, FiEdit2, FiCheck, FiX, FiTrendingUp, FiBox, FiDollarSign, FiShoppingBag } from 'react-icons/fi';
import { getAllProducts, updateProduct } from '../../firebase/productService';
import { getAllOrders } from '../../firebase/orderService';

export default function SalesStockProfit() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [editingId, setEditingId] = useState(null);
  const [editCost, setEditCost] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, ordersData] = await Promise.all([
          getAllProducts(),
          getAllOrders()
        ]);
        setProducts(productsData || []);
        setOrders(ordersData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const salesData = useMemo(() => {
    const sales = {};
    orders.forEach(order => {
      if (order.status !== 'cancelled' && order.status !== 'refunded') {
        (order.items || []).forEach(item => {
          if (item.productId && item.size) {
            const key = `${item.productId}_${item.size}`;
            sales[key] = (sales[key] || 0) + (item.quantity || 1);
          }
        });
      }
    });
    return sales;
  }, [orders]);

  const rows = useMemo(() => {
    let result = [];
    products.forEach(product => {
      if (categoryFilter !== 'all' && product.category !== categoryFilter) return;
      if (searchTerm && !product.name?.toLowerCase().includes(searchTerm.toLowerCase())) return;

      const sizes = product.sizes || {};
      const availableSizes = Object.keys(sizes);

      if (availableSizes.length > 0) {
        availableSizes.forEach((size, index) => {
          const remainingStock = sizes[size].stock || 0;
          const sold = salesData[`${product.id}_${size}`] || 0;
          const totalStock = remainingStock + sold;
          const sellingPrice = product.price || 0;
          const costPrice = product.costPrice;

          let stockValue = 0;
          let totalSales = sold * sellingPrice;
          let profit = null;

          if (costPrice !== undefined && costPrice !== null) {
            stockValue = remainingStock * costPrice;
            profit = totalSales - (sold * costPrice);
          }

          result.push({
            productId: product.id,
            productName: product.name,
            thumbnail: product.images?.[0] || '',
            size: size,
            sellingPrice,
            costPrice,
            totalStock,
            sold,
            remainingStock,
            stockValue,
            totalSales,
            profit,
            isFirstOfProduct: index === 0,
            rowSpan: availableSizes.length,
            category: product.category
          });
        });
      }
    });
    return result;
  }, [products, salesData, searchTerm, categoryFilter]);

  const summary = useMemo(() => {
    let totalStockValue = 0;
    let totalSales = 0;
    let totalProfit = 0;
    let uniqueProducts = new Set();

    rows.forEach(row => {
      uniqueProducts.add(row.productId);
      if (row.costPrice !== undefined && row.costPrice !== null) {
        totalStockValue += row.stockValue;
        totalProfit += row.profit;
      }
      totalSales += row.totalSales;
    });

    return {
      totalStockValue,
      totalSales,
      totalProfit,
      productsCount: uniqueProducts.size
    };
  }, [rows]);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const handleEditClick = (productId, currentCost) => {
    setEditingId(productId);
    setEditCost(currentCost !== undefined && currentCost !== null ? currentCost : '');
  };

  const handleSaveCost = async (productId) => {
    try {
      const val = editCost !== '' ? Number(editCost) : null;
      await updateProduct(productId, { costPrice: val });
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, costPrice: val } : p));
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update cost price", error);
    }
  };

  const handleExport = () => {
    const headers = ['Product', 'Size', 'Cost Price', 'Selling Price', 'Total Stock', 'Sold', 'Remaining Stock', 'Stock Value', 'Total Sales', 'Profit'];
    const csvRows = rows.map(r => {
      return [
        `"${(r.productName || '').replace(/"/g, '""')}"`,
        r.size,
        r.costPrice ?? '—',
        r.sellingPrice,
        r.totalStock,
        r.sold,
        r.remainingStock,
        r.costPrice !== undefined && r.costPrice !== null ? r.stockValue : '—',
        r.totalSales,
        r.costPrice !== undefined && r.costPrice !== null ? r.profit : 'Set cost price'
      ].join(',');
    });

    const csvString = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'sales_stock_profit.csv');
    a.click();
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '—';
    return `AED ${val.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#465348]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F5F1] min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-serif text-[#2E2A27] mb-2">Sales, Stock & Profit</h1>
            <p className="text-[#8A8178]">Overview of product performance, inventory value, and margins.</p>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-[#ECE8E3] text-[#2E2A27] rounded-full hover:bg-gray-50 transition-colors font-medium text-sm shadow-sm"
          >
            <FiDownload className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-[#ECE8E3] p-6">
            <div className="flex items-center gap-3 text-[#6F6A65] mb-2">
              <FiShoppingBag className="w-5 h-5" />
              <span className="font-medium">Total Products</span>
            </div>
            <div className="text-3xl font-serif text-[#2E2A27]">{summary.productsCount}</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#ECE8E3] p-6">
            <div className="flex items-center gap-3 text-[#6F6A65] mb-2">
              <FiBox className="w-5 h-5" />
              <span className="font-medium">Stock Value</span>
            </div>
            <div className="text-3xl font-serif text-[#2E2A27]">{formatCurrency(summary.totalStockValue)}</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#ECE8E3] p-6">
            <div className="flex items-center gap-3 text-[#6F6A65] mb-2">
              <FiTrendingUp className="w-5 h-5" />
              <span className="font-medium">Total Sales</span>
            </div>
            <div className="text-3xl font-serif text-[#2E2A27]">{formatCurrency(summary.totalSales)}</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#ECE8E3] p-6">
            <div className="flex items-center gap-3 text-[#6F6A65] mb-2">
              <FiDollarSign className="w-5 h-5" />
              <span className="font-medium">Total Profit</span>
            </div>
            <div className="text-3xl font-serif text-[#2E2A27] text-[#465348]">{formatCurrency(summary.totalProfit)}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8178] w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#ECE8E3] bg-white text-[#2E2A27] focus:outline-none focus:border-[#465348] transition-colors"
            />
          </div>
          <div className="relative w-full sm:w-64">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8178] w-5 h-5" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-3 rounded-2xl border border-[#ECE8E3] bg-white text-[#2E2A27] appearance-none focus:outline-none focus:border-[#465348] transition-colors cursor-pointer capitalize"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#ECE8E3] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F5F1] text-[#6F6A65] text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium border-b border-[#ECE8E3]">Product</th>
                  <th className="px-6 py-4 font-medium border-b border-[#ECE8E3]">Size</th>
                  <th className="px-6 py-4 font-medium border-b border-[#ECE8E3]">Cost Price</th>
                  <th className="px-6 py-4 font-medium border-b border-[#ECE8E3]">Selling Price</th>
                  <th className="px-6 py-4 font-medium border-b border-[#ECE8E3] text-right">Total Stock</th>
                  <th className="px-6 py-4 font-medium border-b border-[#ECE8E3] text-right">Sold</th>
                  <th className="px-6 py-4 font-medium border-b border-[#ECE8E3] text-right">Remaining</th>
                  <th className="px-6 py-4 font-medium border-b border-[#ECE8E3] text-right">Stock Value</th>
                  <th className="px-6 py-4 font-medium border-b border-[#ECE8E3] text-right">Total Sales</th>
                  <th className="px-6 py-4 font-medium border-b border-[#ECE8E3] text-right">Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE8E3]">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-12 text-center text-[#8A8178]">
                      No products found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  rows.map((row, idx) => (
                    <tr key={`${row.productId}_${row.size}`} className="hover:bg-gray-50/50 transition-colors">
                      
                      {row.isFirstOfProduct && (
                        <td rowSpan={row.rowSpan} className="px-6 py-4 align-top border-r border-[#ECE8E3] bg-white">
                          <div className="flex items-center gap-4">
                            {row.thumbnail ? (
                              <img src={row.thumbnail} alt={row.productName} className="w-12 h-16 object-cover rounded-md border border-[#ECE8E3]" />
                            ) : (
                              <div className="w-12 h-16 bg-[#F8F5F1] rounded-md border border-[#ECE8E3] flex items-center justify-center">
                                <span className="text-[#8A8178] text-xs">No img</span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-[#2E2A27]">{row.productName}</p>
                              <p className="text-xs text-[#8A8178] capitalize mt-1">{row.category}</p>
                            </div>
                          </div>
                        </td>
                      )}
                      
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F8F5F1] text-xs font-semibold text-[#2E2A27]">
                          {row.size}
                        </span>
                      </td>

                      {row.isFirstOfProduct ? (
                        <td rowSpan={row.rowSpan} className="px-6 py-4 align-top border-r border-[#ECE8E3] bg-white group">
                          {editingId === row.productId ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-[#6F6A65]">AED</span>
                              <input 
                                type="number" 
                                value={editCost}
                                onChange={(e) => setEditCost(e.target.value)}
                                className="w-20 px-2 py-1 text-sm border border-[#ECE8E3] rounded focus:outline-none focus:border-[#465348]"
                                autoFocus
                              />
                              <button onClick={() => handleSaveCost(row.productId)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                                <FiCheck />
                              </button>
                              <button onClick={() => setEditingId(null)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                <FiX />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-[#2E2A27]">{formatCurrency(row.costPrice)}</span>
                              <button 
                                onClick={() => handleEditClick(row.productId, row.costPrice)}
                                className="p-1.5 text-[#8A8178] hover:text-[#465348] hover:bg-[#F8F5F1] rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                title="Edit cost price"
                              >
                                <FiEdit2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      ) : null}

                      {row.isFirstOfProduct ? (
                        <td rowSpan={row.rowSpan} className="px-6 py-4 align-top border-r border-[#ECE8E3] bg-white">
                          {formatCurrency(row.sellingPrice)}
                        </td>
                      ) : null}

                      <td className="px-6 py-4 text-right text-[#6F6A65]">{row.totalStock}</td>
                      <td className="px-6 py-4 text-right font-medium text-[#2E2A27]">{row.sold}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${row.remainingStock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {row.remainingStock}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right text-[#6F6A65]">
                        {row.costPrice !== undefined && row.costPrice !== null ? formatCurrency(row.stockValue) : '—'}
                      </td>
                      
                      <td className="px-6 py-4 text-right font-medium text-[#2E2A27]">
                        {formatCurrency(row.totalSales)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {row.profit !== null ? (
                          <span className={`font-medium ${row.profit > 0 ? 'text-green-600' : row.profit < 0 ? 'text-red-500' : 'text-[#6F6A65]'}`}>
                            {row.profit > 0 ? '+' : ''}{formatCurrency(row.profit)}
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleEditClick(row.productId, row.costPrice)}
                            className="text-xs text-amber-600 hover:text-amber-700 underline decoration-amber-300 underline-offset-2"
                          >
                            Set cost price
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
