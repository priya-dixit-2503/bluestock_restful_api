import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Circles } from 'react-loader-spinner';

function SecurePage() {
  const [ipos, setIpos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [newCompany, setNewCompany] = useState({
    company_name: '',
    company_logo: '',
    ipos: [
      {
        price_band: '',
        open_date: '',
        close_date: '',
        issue_size: '',
        issue_type: '',
        listing_date: '',
        status: 'Pending',
        ipo_price: '',
        listing_price: '',
        listing_gain: '',
        current_market_price: '',
        current_return: '',
        documents: [{ rhp_pdf: '', drhp_pdf: '' }]
      }
    ]
  });

  const token = localStorage.getItem('access_token');

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
      setMessageType('');
    }, 4000); // Message auto-dismiss
  };

  const fetchIPOs = useCallback((page = 1) => {
    setLoadingFetch(true);
    axios.get(`http://127.0.0.1:8000/api/ipo/paginated/?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const filtered = res.data.results.filter(item => item.ipos && item.ipos.length > 0);
      setIpos(filtered);
      setCurrentPage(page);
      setTotalPages(Math.ceil(res.data.count / 5)); // adjust if page_size changes
    }).finally(() => setLoadingFetch(false));
  }, [token]);

  useEffect(() => {
    if (token) fetchIPOs(1);
  }, [fetchIPOs]);

  const handleDelete = (id) => {
    setLoadingDeleteId(id);
    axios.delete(`http://127.0.0.1:8000/api/ipo/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      showMessage("IPO deleted successfully!", "success");
      fetchIPOs(currentPage);
    }).catch((err) => {
      console.error("Delete error:", err);
      showMessage("Failed to delete IPO", "error");
    }).finally(() => setLoadingDeleteId(null));
  };

  const handleUpdate = (id) => {
    setLoadingUpdate(true);
    axios.put(`http://127.0.0.1:8000/api/ipo/${id}/`, editData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }).then(() => {
      showMessage("IPO updated successfully!", "success");
      setEditingId(null);
      setEditData(null);
      fetchIPOs(currentPage);
    }).catch((err) => {
      console.error("Update error:", err);
      showMessage("Failed to update IPO", "error");
    }).finally(() => setLoadingUpdate(false));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    setLoadingCreate(true);
    axios.post(`http://127.0.0.1:8000/api/ipo/`, newCompany, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    }).then(() => {
      showMessage("IPO registered successfully!", "success");
      setShowForm(false);
      setNewCompany({
        company_name: '',
        company_logo: '',
        ipos: [
          {
            price_band: '',
            open_date: '',
            close_date: '',
            issue_size: '',
            issue_type: '',
            listing_date: '',
            status: 'Pending',
            ipo_price: '',
            listing_price: '',
            listing_gain: '',
            current_market_price: '',
            current_return: '',
            documents: [{ rhp_pdf: '', drhp_pdf: '' }]
          }
        ]
      });
      fetchIPOs(currentPage);
    }).catch((err) => {
        console.error(err);
        showMessage("Failed to register IPO", "error");
    }).finally(() => setLoadingCreate(false));
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-full overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold mb-4">IPO Dashboard</h2>
        {message && (
          <div 
          className={`mb-4 px-4 py-2 rounded text-white ${
            messageType === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
          >
            {message}
          </div>
        )}
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors text-white px-4 py-2 rounded mb-4 shadow-sm"
        >
          {showForm ? 'Close Form' : 'Register IPO'}
        </button>
      </div>
        {showForm && (
          <form 
          onSubmit={handleCreate} 
          className="border p-4 rounded shadow mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
              type="text"
              placeholder="Company Name"
              className="border p-2 w-full"
              value={newCompany.company_name}
              onChange={e => setNewCompany({ ...newCompany, company_name: e.target.value })}
              required
              />
              <input
                type="url"
                placeholder="Company Logo URL"
                className="border p-2 w-full"
                value={newCompany.company_logo}
                onChange={e => setNewCompany({ ...newCompany, company_logo: e.target.value })}
                required
              />
              {Object.entries(newCompany.ipos[0]).map(([key, value]) => {
                if (key === 'documents') {
                  return (
                    <div key="documents" className="space-y-2">
                      <input
                        type="url"
                        placeholder="RHP PDF"
                        className="border p-2 w-full"
                        value={value[0].rhp_pdf}
                        onChange={e => {
                          const updated = { ...newCompany };
                          updated.ipos[0].documents[0].rhp_pdf = e.target.value;
                          setNewCompany(updated);
                        }}
                        required
                      />
                      <input
                        type="url"
                        placeholder="DRHP PDF"
                        className="border p-2 w-full"
                        value={value[0].drhp_pdf}
                        onChange={e => {
                          const updated = { ...newCompany };
                          updated.ipos[0].documents[0].drhp_pdf = e.target.value;
                          setNewCompany(updated);
                        }}
                        required
                      />
                    </div>
                  );
                }
                return (
                  <input
                    key={key}
                    type={key.includes("date") ? "date" : "text"}
                    placeholder={key.replaceAll('_', ' ')}
                    className="border p-2 w-full"
                    value={value}
                    onChange={e => {
                      const updated = { ...newCompany };
                      updated.ipos[0][key] = e.target.value;
                      setNewCompany(updated);
                    }}
                    required
                  />
                );
              })}
            </div>
            <div className="flex justify-end mt-4">
              <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center w-full sm:w-auto"
              disabled={loadingCreate}
              >
                {loadingCreate ? (
                  <Circles height={20} width={20} color="#fff" />
                ) : (
                  "Submit IPO"
                )}
              </button>
            </div>
          </form>
        )}

        {loadingFetch ? (
          <div className="flex justify-center items-center my-6">
            <Circles height={40} width={40} color="#4fa94d" />
          </div>
        ) : (
          <>
          <div className="overflow-x-auto border rounded-lg shadow-md mt-4">
            <table className="min-w-[900px] table-auto border border-gray-300 rounded">
              <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Company</th>
                  <th className="px-4 py-2">Price Band</th>
                  <th className="px-4 py-2">Open</th>
                  <th className="px-4 py-2">Close</th>
                  <th className="px-4 py-2">Issue Size</th>
                  <th className="px-4 py-2">Issue Type</th>
                  <th className="px-4 py-2">Listing Date</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">IPO Price</th>
                  <th className="px-4 py-2">Listing Price</th>
                  <th className="px-4 py-2">Listing Gain</th>
                  <th className="px-4 py-2">Current Price</th>
                  <th className="px-4 py-2">Current Return</th>
                  <th className="px-4 py-2">RHP</th>
                  <th className="px-4 py-2">DRHP</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {ipos.map(ipo => {
                  const data = ipo.ipos[0]; // shorthand for easier reading
                  return (
                    <tr key={ipo.id}>
                      <td className="px-4 py-2">{ipo.id}</td>
                      <td className="px-4 py-2">{ipo.company_name}</td>
                      <td className="px-4 py-2">{data.price_band}</td>
                      <td className="px-4 py-2">{data.open_date}</td>
                      <td className="px-4 py-2">{data.close_date}</td>
                      <td className="px-4 py-2">{data.issue_size}</td>
                      <td className="px-4 py-2">{data.issue_type}</td>
                      <td className="px-4 py-2">{data.listing_date}</td>
                      <td className="px-4 py-2">{data.status}</td>
                      <td className="px-4 py-2">{data.ipo_price}</td>
                      <td className="px-4 py-2">{data.listing_price}</td>
                      <td className="px-4 py-2">{data.listing_gain}%</td>
                      <td className="px-4 py-2">{data.current_market_price}</td>
                      <td className="px-4 py-2">{data.current_return}%</td>
                      <td className="px-4 py-2">
                        {data.documents?.[0]?.rhp_pdf && (
                          <a href={data.documents[0].rhp_pdf} className="text-blue-500 underline" target="_blank">View</a>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {data.documents?.[0]?.drhp_pdf && (
                          <a href={data.documents[0].drhp_pdf} className="text-blue-500 underline" target="_blank">View</a>
                        )}
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          className="inline-flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                          onClick={() => {
                            setEditData(data);
                            setEditingId(data.id);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                          onClick={() => handleDelete(data.id)}
                          disabled={loadingDeleteId === data.id}
                        >
                          {loadingDeleteId === data.id ? (
                            <Circles height={20} width={20} color="#fff" />
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center mt-6 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => fetchIPOs(i + 1)}
                    className={`px-4 py-2 rounded border shadow ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {editingId && editData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 border p-4 rounded shadow bg-yellow-50">
            <h3 className="text-xl font-semibold mb-2">Edit IPO</h3>
            
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={editData.price_band}
              onChange={e => setEditData({ ...editData, price_band: e.target.value })}
              placeholder="Price Band"
            />
            <input
              type="date"
              className="border p-2 w-full mb-2"
              value={editData.open_date}
              onChange={e => setEditData({ ...editData, open_date: e.target.value })}
              placeholder="Open Date"
            />
            <input
              type="date"
              className="border p-2 w-full mb-2"
              value={editData.close_date}
              onChange={e => setEditData({ ...editData, close_date: e.target.value })}
              placeholder="Close Date"
            />
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={editData.issue_size}
              onChange={e => setEditData({ ...editData, issue_size: e.target.value })}
              placeholder="Issue Size"
            />
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={editData.issue_type}
              onChange={e => setEditData({ ...editData, issue_type: e.target.value })}
              placeholder="Issue Type"
            />
            <input
              type="date"
              className="border p-2 w-full mb-2"
              value={editData.listing_date}
              onChange={e => setEditData({ ...editData, listing_date: e.target.value })}
              placeholder="Listing Date"
            />
            <select
              className="border p-2 w-full mb-2"
              value={editData.status}
              onChange={e => setEditData({ ...editData, status: e.target.value })}
            >
              <option value="">Select Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="listed">Listed</option>
            </select>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={editData.ipo_price}
              onChange={e => setEditData({ ...editData, ipo_price: e.target.value })}
              placeholder="IPO Price"
            />
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={editData.listing_price}
              onChange={e => setEditData({ ...editData, listing_price: e.target.value })}
              placeholder="Listing Price"
            />
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={editData.current_market_price}
              onChange={e => setEditData({ ...editData, current_market_price: e.target.value })}
              placeholder="Current Market Price"
            />

            {/* RHP & DRHP PDF URLs (if documents exist) */}
            <input
              type="url"
              className="border p-2 w-full mb-2"
              value={editData.documents?.[0]?.rhp_pdf || ''}
              onChange={e => {
                const updated = { ...editData };
                if (!updated.documents) updated.documents = [{}];
                if (!updated.documents[0]) updated.documents[0] = {};
                updated.documents[0].rhp_pdf = e.target.value;
                setEditData(updated);
              }}
              placeholder="RHP PDF URL"
            />
            <input
              type="url"
              className="border p-2 w-full mb-2"
              value={editData.documents?.[0]?.drhp_pdf || ''}
              onChange={e => {
                const updated = { ...editData };
                if (!updated.documents) updated.documents = [{}];
                if (!updated.documents[0]) updated.documents[0] = {};
                updated.documents[0].drhp_pdf = e.target.value;
                setEditData(updated);
              }}
              placeholder="DRHP PDF URL"
            />

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleUpdate(editingId)}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center w-full sm:w-auto"
                disabled={loadingUpdate}
              >
                {loadingUpdate ? (
                  <Circles height={20} width={20} color="#fff" />
                ) : (
                  "Save"
                )}
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setEditData(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
    </div>
  );
}

export default SecurePage;
