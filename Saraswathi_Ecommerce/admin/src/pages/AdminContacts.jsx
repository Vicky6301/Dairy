import { useEffect, useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null); // store ID for popup confirmation
  const [showConfirm, setShowConfirm] = useState(false); // control popup

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/contact`);
      const data = await res.json();
      setContacts(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load messages");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Delete contact (after confirmation)
  const deleteContact = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/contact/${selectedId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setContacts((prev) => prev.filter((c) => c._id !== selectedId));
        toast.success("Message deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete message");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete message");
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
        Contact Messages
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading messages...</p>
      ) : contacts.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No messages found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block w-full">
            <table className="min-w-full bg-white shadow rounded-xl overflow-hidden border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Name</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Email</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Phone</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Company</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Message</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Date</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c, idx) => (
                  <tr key={c._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3">{c.name}</td>
                    <td className="p-3">{c.email}</td>
                    <td className="p-3">{c.phone}</td>
                    <td className="p-3">{c.company || "-"}</td>
                    <td className="p-3 max-w-xs break-words">{c.message}</td>
                    <td className="p-3">{new Date(c.date).toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDeleteClick(c._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {contacts.map((c) => (
              <div
                key={c._id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow flex flex-col gap-2 break-words"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-gray-800">{c.name}</p>
                    <p className="text-gray-600 text-sm">{c.email}</p>
                    <p className="text-gray-700 text-sm">Phone: {c.phone}</p>
                    {c.company && <p className="text-gray-700 text-sm">Company: {c.company}</p>}
                    <p className="text-gray-700 text-sm">{c.message}</p>
                    <p className="text-gray-500 text-xs text-right">
                      {new Date(c.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteClick(c._id)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this message?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  deleteContact();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
