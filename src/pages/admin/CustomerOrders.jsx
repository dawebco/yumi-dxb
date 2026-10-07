import React, { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiDownload } from 'react-icons/fi';
import { getAllOrders } from '../../firebase/orderService';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const fetchedOrders = await getAllOrders();
      setOrders(fetchedOrders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Flatten orders so that each item gets its own row
  const flattenedOrders = useMemo(() => {
    const flattened = [];
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          flattened.push({
            ...order,
            item: item
          });
        });
      } else {
        // Fallback if no items but still an order
        flattened.push({ ...order });
      }
    });
    return flattened;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return flattenedOrders.filter(row => {
      // Status Filter
      if (statusFilter !== 'All' && row.status !== statusFilter) return false;
      
      // Payment Filter
      if (paymentFilter !== 'All' && String(row.paymentStatus || '').toLowerCase() !== paymentFilter.toLowerCase()) return false;

      // Search
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const customerName = (row.shippingAddress?.fullName || '').toLowerCase();
        const phone = (row.shippingAddress?.phone || '').toLowerCase();
        const orderId = (row.id || '').toLowerCase();
        
        if (!customerName.includes(term) && !phone.includes(term) && !orderId.includes(term)) {
          return false;
        }
      }

      return true;
    });
  }, [flattenedOrders, statusFilter, paymentFilter, searchTerm]);

  // Calculations for summary
  const totalAmount = useMemo(() => {
    const uniqueOrders = new Map();
    filteredOrders.forEach(row => {
      uniqueOrders.set(row.id, Number(row.total || 0));
    });
    let total = 0;
    uniqueOrders.forEach(amount => {
      total += amount;
    });
    return total;
  }, [filteredOrders]);

  const totalUniqueOrders = useMemo(() => {
    const uniqueOrders = new Set();
    filteredOrders.forEach(row => {
      uniqueOrders.add(row.id);
    });
    return uniqueOrders.size;
  }, [filteredOrders]);

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) return;
    
    const headers = [
      'Customer Name', 'Phone', 'Order ID', 'Product', 'Size', 'Colour', 'Quantity', 'Order Amount', 'Payment Status', 'Order Status'
    ];
    
    const csvRows = [headers.join(',')];
    
    filteredOrders.forEach(row => {
      const customerName = `"${(row.shippingAddress?.fullName || '').replace(/"/g, '""')}"`;
      const phone = `"${row.shippingAddress?.phone || ''}"`;
      const orderId = row.id;
      const product = `"${(row.item?.name || '').replace(/"/g, '""')}"`;
      const size = `"${row.item?.size || ''}"`;
      const colour = `"${row.item?.colour || row.item?.color || ''}"`;
      const quantity = row.item?.quantity || 0;
      const amount = row.total || 0;
      const paymentStatus = row.paymentStatus || 'pending';
      const orderStatus = row.status || 'Processing';
      
      csvRows.push([customerName, phone, orderId, product, size, colour, quantity, amount, paymentStatus, orderStatus].join(','));
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `customer_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Packed': return 'bg-purple-100 text-purple-800';
      case 'Confirmed': return 'bg-indigo-100 text-indigo-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'paid') return 'bg-green-100 text-green-800';
    if (s === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (s === 'cod') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const statusTabs = ['All', 'Processing', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
  const paymentTabs = ['All', 'paid', 'pending', 'cod'];

  if (loading) {
    return (
      <div className="p-8 min-h-screen bg-[#F8F5F1] flex items-center justify-center">
        <div className="text-xl text-[#8A8178]">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-[#F8F5F1] flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-[#F8F5F1] font-sans">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif text-[#2E2A27] mb-2">Customer &amp; Orders</h1>
            <p className="text-[#8A8178]">Comprehensive view of all customer orders</p>
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-[#465348] text-white px-6 py-2.5 rounded-full hover:bg-opacity-90 transition-all text-sm font-medium"
          >
            <FiDownload /> Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-[#ECE8E3] p-6 flex flex-col justify-center">
            <span className="text-[#8A8178] text-sm uppercase tracking-wider mb-1">Total Orders</span>
            <span className="text-3xl font-serif text-[#2E2A27]">{totalUniqueOrders}</span>
          </div>
          <div className="bg-white rounded-2xl border border-[#ECE8E3] p-6 flex flex-col justify-center">
            <span className="text-[#8A8178] text-sm uppercase tracking-wider mb-1">Total Amount</span>
            <span className="text-3xl font-serif text-[#2E2A27]">₹{Number(totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#ECE8E3] overflow-hidden">
          <div className="p-6 border-b border-[#ECE8E3]">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              
              {/* Search */}
              <div className="relative w-full lg:w-96">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8178]" />
                <input 
                  type="text" 
                  placeholder="Search by name, phone or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F8F5F1] border border-[#ECE8E3] rounded-full focus:outline-none focus:border-[#465348] text-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#F8F5F1] border border-[#ECE8E3] text-[#2E2A27] text-sm rounded-full focus:outline-none focus:border-[#465348] px-4 py-2"
                >
                  <option value="All">All Order Statuses</option>
                  {statusTabs.filter(t => t !== 'All').map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>

                <select 
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="bg-[#F8F5F1] border border-[#ECE8E3] text-[#2E2A27] text-sm rounded-full focus:outline-none focus:border-[#465348] px-4 py-2"
                >
                  <option value="All">All Payment Statuses</option>
                  {paymentTabs.filter(t => t !== 'All').map(status => (
                    <option key={status} value={status}>{status.toUpperCase()}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8F5F1] text-[#8A8178] uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Customer Name</th>
                  <th className="px-6 py-4 font-medium">Phone</th>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Size / Colour</th>
                  <th className="px-6 py-4 font-medium">Qty</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Payment</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y border-t border-[#ECE8E3] divide-[#ECE8E3]">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((row, idx) => (
                    <tr key={`${row.id}-${idx}`} className="hover:bg-[#F8F5F1]/50 transition-colors">
                      <td className="px-6 py-4 text-[#2E2A27]">
                        {row.shippingAddress?.fullName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-[#6F6A65]">
                        {row.shippingAddress?.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-[#6F6A65]" title={row.id}>
                        {row.id ? `${row.id.substring(0, 8)}...` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-[#2E2A27]">
                        <div className="flex items-center gap-3">
                          {row.item?.image && (
                            <img src={row.item.image} alt={row.item?.name} className="w-8 h-8 rounded-md object-cover border border-[#ECE8E3]" />
                          )}
                          <span className="line-clamp-2 max-w-[200px]">{row.item?.name || 'Unknown Item'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#6F6A65]">
                        <div className="flex flex-col">
                          <span>{row.item?.size ? `Size: ${row.item.size}` : '-'}</span>
                          <span>{row.item?.colour || row.item?.color ? `Color: ${row.item.colour || row.item.color}` : '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#6F6A65]">
                        {row.item?.quantity || 0}
                      </td>
                      <td className="px-6 py-4 font-medium text-[#2E2A27]">
                        ₹{Number(row.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(row.paymentStatus)}`}>
                          {(row.paymentStatus || 'pending').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                          {row.status || 'Processing'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center text-[#8A8178]">
                      No orders found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrders;
