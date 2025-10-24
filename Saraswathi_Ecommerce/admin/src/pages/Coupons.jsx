import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const emptyForm = {
    code: "",
    discount: "",
    expiry: "",
    active: true,
    appliesTo: "cart",
};

const Coupons = ({ token }) => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewCoupon, setPreviewCoupon] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [form, setForm] = useState(emptyForm);

    const [simCouponCode, setSimCouponCode] = useState("");
    const [simAmount, setSimAmount] = useState("");
    const [simQuantity, setSimQuantity] = useState(1);
    const [simApplyToProduct, setSimApplyToProduct] = useState(false);
    const [simProductCost, setSimProductCost] = useState("");
    const [simResult, setSimResult] = useState(null);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${backendUrl}/api/coupons`, {
                headers: { token },
            });

            let couponsData = [];
            if (Array.isArray(res.data)) {
                couponsData = res.data;
            } else if (res.data?.coupons && Array.isArray(res.data.coupons)) {
                couponsData = res.data.coupons;
            } else if (res.data?.data && Array.isArray(res.data.data)) {
                couponsData = res.data.data;
            }
            setCoupons(couponsData);
        } catch (err) {
            console.error("Fetch coupons error:", err.response?.data || err.message);
            toast.error("Failed to fetch coupons");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCoupons();
        }
    }, [token]);

    const isExpired = (expiry) => {
        if (!expiry) return false;
        const d = new Date(expiry);
        return d.getTime() < new Date().getTime();
    };

    const resetForm = () => setForm(emptyForm);

    // ✅ FIXED: Use /api/coupons (not /add)
    const handleCreate = async (e) => {
        e?.preventDefault?.();
        if (!form.code.trim()) return toast.warning("Code is required");
        if (!form.discount || Number(form.discount) <= 0) return toast.warning("Discount must be > 0");
        if (!form.expiry) return toast.warning("Expiry date is required");

        const payload = {
            code: form.code.trim(),
            discount: Number(form.discount),
            expiry: form.expiry,
            active: !!form.active,
            appliesTo: form.appliesTo || "cart",
        };

        try {
            // ✅ CORRECT ENDPOINT: POST /api/coupons
            await axios.post(`${backendUrl}/api/coupons`, payload, { headers: { token } });
            toast.success("Coupon created successfully!");
            setShowAddModal(false);
            resetForm();
            fetchCoupons();
        } catch (err) {
            console.error("Create coupon error:", err.response?.data || err.message);
            toast.error(err?.response?.data?.message || "Failed to create coupon");
        }
    };

    const openEdit = (c) => {
        if (!c._id) {
            toast.error("Invalid coupon: missing ID");
            return;
        }
        setEditingCoupon(c);
        setForm({
            code: c.code || "",
            discount: c.discount || "",
            expiry: c.expiry ? new Date(c.expiry).toISOString().slice(0, 10) : "",
            active: !!c.active,
            appliesTo: c.appliesTo || "cart",
        });
        setShowEditModal(true);
    };

    const handleUpdate = async (e) => {
        e?.preventDefault?.();
        if (!editingCoupon?._id) return toast.error("Invalid coupon");

        const payload = {
            code: form.code.trim(),
            discount: Number(form.discount),
            expiry: form.expiry,
            active: !!form.active,
            appliesTo: form.appliesTo || "cart",
        };

        try {
            await axios.put(`${backendUrl}/api/coupons/${editingCoupon._id}`, payload, { headers: { token } });
            toast.success("Coupon updated!");
            setShowEditModal(false);
            setEditingCoupon(null);
            resetForm();
            fetchCoupons();
        } catch (err) {
            console.error("Update coupon error:", err.response?.data || err.message);
            toast.error(err?.response?.data?.message || "Failed to update coupon");
        }
    };

    const confirmDelete = (c) => {
        if (!c._id) {
            toast.error("Cannot delete: coupon has no ID");
            return;
        }
        setDeleteTarget(c);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        if (!deleteTarget?._id) return;
        
        try {
            await axios.delete(`${backendUrl}/api/coupons/${deleteTarget._id}`, { headers: { token } });
            toast.success("Coupon deleted!");
            setShowDeleteConfirm(false);
            setDeleteTarget(null);
            fetchCoupons();
        } catch (err) {
            console.error("Delete coupon error:", err.response?.data || err.message);
            toast.error("Failed to delete coupon");
        }
    };

    const openPreview = (c) => {
        setPreviewCoupon(c);
        setShowPreviewModal(true);
    };

    const handleSimulate = (e) => {
        e?.preventDefault?.();
        const code = simCouponCode.trim();
        if (!code) return toast.warning("Enter coupon code or pick from list");

        const coupon = coupons.find((co) => co.code.toLowerCase() === code.toLowerCase());
        if (!coupon) return toast.error("Coupon not found");

        if (!coupon.active || isExpired(coupon.expiry)) return toast.error("Coupon is expired or inactive");
        if (!simAmount || Number(simAmount) <= 0) return toast.warning("Enter a valid amount");

        const amount = Number(simAmount);
        const qty = Math.max(1, Number(simQuantity) || 1);
        const discountPercent = Number(coupon.discount) || 0;
        const discountValueSingle = (amount * discountPercent) / 100;
        const finalSingle = amount - discountValueSingle;

        let totalBefore = amount * qty;
        let totalDiscount = 0;
        let totalAfter = 0;

        if ((coupon.appliesTo || "cart") === "product" || simApplyToProduct) {
            totalDiscount = discountValueSingle * qty;
            totalAfter = finalSingle * qty;
        } else {
            totalDiscount = (totalBefore * discountPercent) / 100;
            totalAfter = totalBefore - totalDiscount;
        }

        let profitPerUnit = null, totalProfitBefore = null, totalProfitAfter = null, marginPercentBefore = null, marginPercentAfter = null;

        if (simProductCost && !isNaN(Number(simProductCost)) && Number(simProductCost) >= 0) {
            const cost = Number(simProductCost);
            profitPerUnit = amount - cost;
            totalProfitBefore = (amount - cost) * qty;

            let afterUnitPrice = ((coupon.appliesTo || "cart") === "product" || simApplyToProduct)
                ? finalSingle
                : amount - (totalDiscount / qty);

            totalProfitAfter = (afterUnitPrice - cost) * qty;
            marginPercentBefore = amount === 0 ? 0 : ((amount - cost) / amount) * 100;
            marginPercentAfter = afterUnitPrice === 0 ? 0 : ((afterUnitPrice - cost) / afterUnitPrice) * 100;
        }

        setSimResult({
            coupon,
            amount,
            qty,
            totalBefore,
            totalDiscount,
            totalAfter,
            discountPercent,
            discountValueSingle,
            finalSingle,
            profitPerUnit,
            totalProfitBefore,
            totalProfitAfter,
            marginPercentBefore,
            marginPercentAfter,
        });
    };

    const formatDate = (d) => {
        if (!d) return "—";
        const dd = new Date(d);
        if (isNaN(dd.getTime())) return d;
        return dd.toLocaleDateString();
    };

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3 md:gap-0">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-700">Coupons Manager</h1>
                <div className="flex gap-3">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        onClick={() => { setShowAddModal(true); resetForm(); }}
                    >
                        + Create Coupon
                    </button>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        onClick={fetchCoupons}
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Top Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Calculator */}
                <div className="bg-white/90 rounded-xl shadow p-5">
                    <h2 className="text-lg font-semibold text-blue-700 mb-3">Coupon Calculator & Preview</h2>

                    <form onSubmit={handleSimulate} className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            <input
                                list="coupons-list"
                                placeholder="Coupon code"
                                value={simCouponCode}
                                onChange={(e) => setSimCouponCode(e.target.value)}
                                className="flex-1 border rounded p-2 min-w-[150px]"
                            />
                            <datalist id="coupons-list">
                                {coupons.map((c) => <option value={c.code} key={c._id || c.code} />)}
                            </datalist>

                            <input
                                type="number"
                                placeholder="Amount (₹)"
                                value={simAmount}
                                onChange={(e) => setSimAmount(e.target.value)}
                                className="w-36 border rounded p-2"
                                min="0"
                            />
                            <input
                                type="number"
                                placeholder="Qty"
                                value={simQuantity}
                                onChange={(e) => setSimQuantity(e.target.value)}
                                className="w-20 border rounded p-2"
                                min="1"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 items-center">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={simApplyToProduct}
                                    onChange={(e) => setSimApplyToProduct(e.target.checked)}
                                />
                                Apply as product-level
                            </label>

                            <input
                                type="number"
                                placeholder="Product cost"
                                value={simProductCost}
                                onChange={(e) => setSimProductCost(e.target.value)}
                                className="w-40 border rounded p-2"
                                min="0"
                            />

                            <button className="px-4 py-2 bg-green-600 text-white rounded" type="submit">
                                Apply / Calculate
                            </button>
                        </div>
                    </form>

                    {simResult && (
                        <div className="mt-4 p-3 bg-blue-50 rounded">
                            <p><strong>Coupon:</strong> {simResult.coupon.code} ({simResult.discountPercent}%)</p>
                            <p><strong>Total before:</strong> {currency}{simResult.totalBefore.toFixed(2)}</p>
                            <p><strong>Total discount:</strong> {currency}{simResult.totalDiscount.toFixed(2)}</p>
                            <p><strong>Total after:</strong> {currency}{simResult.totalAfter.toFixed(2)}</p>
                            {simResult.profitPerUnit !== null && (
                                <>
                                    <hr className="my-2" />
                                    <p><strong>Profit/unit before:</strong> {currency}{simResult.profitPerUnit.toFixed(2)}</p>
                                    <p><strong>Total profit before:</strong> {currency}{simResult.totalProfitBefore.toFixed(2)}</p>
                                    <p><strong>Total profit after:</strong> {currency}{simResult.totalProfitAfter.toFixed(2)}</p>
                                    <p><strong>Margin before:</strong> {simResult.marginPercentBefore.toFixed(2)}%</p>
                                    <p><strong>Margin after:</strong> {simResult.marginPercentAfter.toFixed(2)}%</p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="bg-white/90 rounded-xl shadow p-5">
                    <h2 className="text-lg font-semibold text-blue-700 mb-3">Coupons Quick View</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-50 rounded">
                            <p className="text-sm text-gray-600">Total Coupons</p>
                            <p className="text-2xl font-bold">{coupons.length}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded">
                            <p className="text-sm text-gray-600">Active</p>
                            <p className="text-2xl font-bold">{coupons.filter(c => c.active && !isExpired(c.expiry)).length}</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded">
                            <p className="text-sm text-gray-600">Expired</p>
                            <p className="text-2xl font-bold">{coupons.filter(c => isExpired(c.expiry)).length}</p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded">
                            <p className="text-sm text-gray-600">Product-level</p>
                            <p className="text-2xl font-bold">{coupons.filter(c => (c.appliesTo || "cart") === "product").length}</p>
                        </div>
                    </div>
                    <hr className="my-4" />
                    <p className="text-sm text-gray-600">Tip: Use product-level coupons for product-specific deals.</p>
                </div>
            </div>

            {/* Coupons Table */}
            <div className="bg-white/90 rounded-xl shadow p-5 overflow-x-auto">
                <h2 className="text-lg font-semibold text-blue-700 mb-3">All Coupons</h2>
                {loading ? (
                    <p className="text-center py-4">Loading coupons...</p>
                ) : coupons.length === 0 ? (
                    <p className="text-center py-4">No coupons found. Create your first coupon!</p>
                ) : (
                    <table className="min-w-full text-left border-collapse">
                        <thead className="bg-gradient-to-r from-blue-500 to-green-400 text-white sticky top-0">
                            <tr>
                                <th className="py-2 px-3">Code</th>
                                <th className="py-2 px-3">Discount</th>
                                <th className="py-2 px-3">Applies To</th>
                                <th className="py-2 px-3">Expiry</th>
                                <th className="py-2 px-3">Status</th>
                                <th className="py-2 px-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((c, idx) => (
                                <tr key={c._id || `coupon-${idx}`} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}>
                                    <td className="p-3 font-mono font-semibold">{c.code}</td>
                                    <td className="p-3">{c.discount}%</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            (c.appliesTo || "cart") === "product" 
                                                ? "bg-purple-100 text-purple-800" 
                                                : "bg-blue-100 text-blue-800"
                                        }`}>
                                            {(c.appliesTo || "cart").toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-3">{formatDate(c.expiry)}</td>
                                    <td className="p-3">
                                        {c.active && !isExpired(c.expiry) ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">Active</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">Inactive</span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-2 flex-wrap">
                                            <button 
                                                onClick={() => openPreview(c)} 
                                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition"
                                            >
                                                Preview
                                            </button>
                                            <button 
                                                onClick={() => openEdit(c)} 
                                                className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200 transition"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => confirmDelete(c)} 
                                                className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition"
                                            >
                                                Delete
                                            </button>
                                            <button 
                                                onClick={() => { 
                                                    setSimCouponCode(c.code); 
                                                    toast.info(`"${c.code}" loaded in calculator`);
                                                }} 
                                                className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition"
                                            >
                                                Use
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
                    <div className="relative bg-white rounded-2xl p-6 w-[95%] max-w-md shadow-xl">
                        <h3 className="text-lg font-semibold mb-4">Create New Coupon</h3>
                        <form onSubmit={handleCreate} className="grid grid-cols-1 gap-3">
                            <input
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                placeholder="Coupon Code (e.g., SAVE10)"
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value })}
                                required
                            />
                            <input
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                type="number"
                                placeholder="Discount Percentage (e.g., 10 for 10%)"
                                value={form.discount}
                                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                                min="0"
                                max="100"
                                required
                            />
                            <input
                                type="date"
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                value={form.expiry}
                                onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                                required
                            />
                            <select
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                value={form.appliesTo}
                                onChange={(e) => setForm({ ...form, appliesTo: e.target.value })}
                            >
                                <option value="cart">Cart-level Discount</option>
                                <option value="product">Product-level Discount</option>
                            </select>
                            <div className="flex items-center gap-2">
                                <input
                                    id="active-create"
                                    type="checkbox"
                                    checked={!!form.active}
                                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                                />
                                <label htmlFor="active-create" className="text-gray-700">Active</label>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                                    onClick={() => { setShowAddModal(false); resetForm(); }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                                    Create Coupon
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingCoupon && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowEditModal(false)} />
                    <div className="relative bg-white rounded-2xl p-6 w-[95%] max-w-md shadow-xl">
                        <h3 className="text-lg font-semibold mb-4">Edit Coupon: {editingCoupon.code}</h3>
                        <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-3">
                            <input
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                placeholder="Coupon Code"
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value })}
                                required
                            />
                            <input
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                type="number"
                                placeholder="Discount Percentage"
                                value={form.discount}
                                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                                min="0"
                                max="100"
                                required
                            />
                            <input
                                type="date"
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                value={form.expiry}
                                onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                                required
                            />
                            <select
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                value={form.appliesTo}
                                onChange={(e) => setForm({ ...form, appliesTo: e.target.value })}
                            >
                                <option value="cart">Cart-level Discount</option>
                                <option value="product">Product-level Discount</option>
                            </select>
                            <div className="flex items-center gap-2">
                                <input
                                    id="active-edit"
                                    type="checkbox"
                                    checked={!!form.active}
                                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                                />
                                <label htmlFor="active-edit" className="text-gray-700">Active</label>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                                    onClick={() => { setShowEditModal(false); setEditingCoupon(null); resetForm(); }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {showPreviewModal && previewCoupon && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowPreviewModal(false)} />
                    <div className="relative bg-white rounded-2xl p-6 w-[95%] max-w-sm shadow-xl">
                        <h3 className="text-lg font-semibold mb-3">Coupon Details</h3>
                        <div className="space-y-2 text-left">
                            <p><span className="font-medium">Code:</span> {previewCoupon.code}</p>
                            <p><span className="font-medium">Discount:</span> {previewCoupon.discount}%</p>
                            <p><span className="font-medium">Applies To:</span> {(previewCoupon.appliesTo || "cart").toUpperCase()}</p>
                            <p><span className="font-medium">Expiry:</span> {formatDate(previewCoupon.expiry)}</p>
                            <p><span className="font-medium">Status:</span> {previewCoupon.active && !isExpired(previewCoupon.expiry) ? "Active" : "Inactive"}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                            <button 
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                                onClick={() => setShowPreviewModal(false)}
                            >
                                Close
                            </button>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                onClick={() => { 
                                    setShowPreviewModal(false); 
                                    setSimCouponCode(previewCoupon.code); 
                                    toast.info(`"${previewCoupon.code}" loaded in calculator`);
                                }}
                            >
                                Use in Calculator
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {showDeleteConfirm && deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(false)} />
                    <div className="relative bg-white rounded-2xl p-6 w-[95%] max-w-sm shadow-xl text-center">
                        <h3 className="text-lg font-semibold mb-2 text-red-600">Confirm Deletion</h3>
                        <p className="mb-4">Are you sure you want to delete the coupon <strong>"{deleteTarget.code}"</strong>? This action cannot be undone.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button 
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                onClick={handleDelete}
                            >
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coupons;