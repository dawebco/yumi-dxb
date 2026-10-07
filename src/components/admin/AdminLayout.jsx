import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import {
  FiGrid,
  FiBox,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiStar,
  FiTag,
  FiMail,
  FiBarChart2,
  FiLogOut,
  FiMessageSquare,
  FiRotateCcw,
  FiXCircle,
  FiClipboard,
  FiTrendingUp,
} from "react-icons/fi";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/admin/products", label: "Products", icon: FiBox },
  { to: "/admin/inventory", label: "Inventory", icon: FiPackage },
  { to: "/admin/orders", label: "Orders", icon: FiShoppingBag },
  { to: "/admin/customer-orders", label: "Customer & Orders", icon: FiClipboard },
  { to: "/admin/cancelled-orders", label: "Cancelled Orders", icon: FiXCircle },
  { to: "/admin/returns", label: "Returns", icon: FiRotateCcw },
  { to: "/admin/customers", label: "Customers", icon: FiUsers },
  { to: "/admin/sales-profit", label: "Sales & Profit", icon: FiTrendingUp },
  { to: "/admin/messages", label: "Messages", icon: FiMessageSquare },
  { to: "/admin/reviews", label: "Reviews", icon: FiStar },
  { to: "/admin/coupons", label: "Coupons", icon: FiTag },
  { to: "/admin/newsletter", label: "Newsletter", icon: FiMail },
  { to: "/admin/reports", label: "Reports", icon: FiBarChart2 },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#F8F5F1]">
      <aside className="w-64 bg-white border-r border-[#ECE8E3] flex flex-col">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-serif text-[#2E2A27] tracking-wide">YUMI</h1>
          <p className="text-xs text-[#8A8178] uppercase tracking-[3px]">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-[#465348] text-white"
                    : "text-[#2E2A27] hover:bg-[#F4F0EB]"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-4 text-sm text-[#8A8178] hover:text-red-600 border-t border-[#ECE8E3]"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}