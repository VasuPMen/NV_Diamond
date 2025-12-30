import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { packetAPI, masterAPI, assignAPI } from '../../services/api';

const ProcessPage = () => {
    const { user } = useAuth();
    const [packetNo, setPacketNo] = useState('');
    const [packet, setPacket] = useState(null);
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [assignLoading, setAssignLoading] = useState(false);

    // Assignment State
    const [processes, setProcesses] = useState([]);
    const [managers, setManagers] = useState([]);
    const [employees, setEmployees] = useState([]); // For manager view

    // Form Data
    const [selectedProcess, setSelectedProcess] = useState('');
    const [selectedAssignee, setSelectedAssignee] = useState(''); // Manager or Employee ID

    useEffect(() => {
        fetchMasters();
    }, []);

    const fetchMasters = async () => {
        try {
            const procRes = await masterAPI.process.getAll();
            setProcesses(procRes.data || []);

            if (user?.role === 'admin') {
                const manRes = await masterAPI.manager.getAll(1, 100);
                setManagers(Array.isArray(manRes.data) ? manRes.data : []);
            } else if (user?.role === 'manager') {
                const empRes = await masterAPI.employee.getAll(1, 100);
                const allEmps = Array.isArray(empRes.data) ? empRes.data : [];
                // Filter employees assigned to this manager
                // Check both populated object (_id) and direct ID string
                const myEmps = allEmps.filter(e => {
                    const managerId = e.manager?._id || e.manager;
                    return managerId === user._id; // Assuming user._id matches the manager's ID
                });
                setEmployees(myEmps);
            }
        } catch (err) {
            console.error("Error fetching masters:", err);
            setProcesses([]);
            setManagers([]);
            setEmployees([]);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!packetNo) return;
        setLoading(true);
        setError('');
        setPacket(null);
        setHistory(null);

        try {
            // Fetch Packet
            const packetRes = await packetAPI.getByNo(packetNo);
            setPacket(packetRes.data);

            // Fetch History (Assign Routes)
            try {
                const historyRes = await assignAPI.getHistory(packetNo);
                setHistory(historyRes.data);
            } catch (histErr) {
                // It's okay if no history yet
                console.log("No history found or error:", histErr);
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Packet not found or error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async () => {
        // Validation:
        // Admin: Needs Assignee (Manager)
        // Manager: Needs Assignee (Employee) AND Process
        if (
            (user.role === 'admin' && !selectedAssignee) ||
            (user.role === 'manager' && (!selectedAssignee || !selectedProcess))
        ) {
            alert("Please select required fields");
            return;
        }

        setAssignLoading(true);
        try {
            const payload = {
                TransactionNo: `TRX-${Date.now()}`,
                PacketNo: packet.packetNo,
                Process: user.role === 'manager' ? selectedProcess : undefined, // Only send process if manager
                to: selectedAssignee,
                from: user._id,
            };

            await assignAPI.assignPacket(payload);

            alert('Packet assigned successfully!');
            handleSearch({ preventDefault: () => { } });
            setSelectedProcess('');
            setSelectedAssignee('');

        } catch (err) {
            console.error("Assignment Error:", err);
            alert("Failed to assign packet: " + (err.response?.data?.message || err.message));
        } finally {
            setAssignLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Process Assignment</h1>

            {/* Search Section */}
            <form onSubmit={handleSearch} className="mb-8 flex gap-4">
                <input
                    type="text"
                    placeholder="Enter Packet Number"
                    value={packetNo}
                    onChange={(e) => setPacketNo(e.target.value)}
                    className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    autoFocus
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
                    {error}
                </div>
            )}

            {packet && (
                <div className="space-y-8 animate-fadeIn">
                    {/* Packet Details Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-700">Packet Details</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Packet No</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Weight</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Polish Weight</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shape</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purity</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cut</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Polish</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symmetry</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fluorescence</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{packet.packetNo}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{packet.stockWeight}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{packet.polishWeight}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{packet.shape?.name || '-'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{packet.color?.name || '-'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{packet.purity?.name || '-'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{packet.cut?.name || '-'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{packet.polish?.name || '-'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{packet.symmetry?.name || '-'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{packet.fluorescence?.name || '-'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{packet.table?.name || '-'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{packet.rate}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Assign Action Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Assign Packet</h3>
                        <div className="flex flex-wrap gap-4 items-end">
                            {/* Role Based Assignee Selection */}
                            {(user?.role === 'admin' || user?.role === 'manager') && (
                                <div className="w-64">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Assign To ({user.role === 'admin' ? 'Manager' : 'Employee'})
                                    </label>
                                    <select
                                        value={selectedAssignee}
                                        onChange={(e) => setSelectedAssignee(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Select...</option>
                                        {user.role === 'admin' && managers.map(m => (
                                            <option key={m._id} value={m.userId}>{m.firstName} {m.lastName}</option>
                                        ))}
                                        {user.role === 'manager' && employees.map(e => (
                                            <option key={e._id} value={e.userId}>{e.firstName} {e.lastName}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Process Selection - Only for Managers */}
                            {user?.role === 'manager' && (
                                <div className="w-64">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Process</label>
                                    <select
                                        value={selectedProcess}
                                        onChange={(e) => setSelectedProcess(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Select Process...</option>
                                        {processes.map(p => (
                                            <option key={p._id} value={p._id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <button
                                onClick={handleAssign}
                                disabled={assignLoading}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 h-[42px]"
                            >
                                {assignLoading ? 'Assigning...' : 'Assign'}
                            </button>
                        </div>
                    </div>

                    {/* Transaction History Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-700">Process History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Process</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {history?.Transitions?.length > 0 ? (
                                        history.Transitions.map((trx, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trx.TransactionNo}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{typeof trx.Process === 'object' ? trx.Process?.name : trx.Process}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {typeof trx.from === 'object' ? (
                                                        trx.from?.username ||
                                                        trx.from?.name ||
                                                        (trx.from?.firstName ? `${trx.from.firstName} ${trx.from.lastName || ''}` : '-')
                                                    ) : trx.from || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {typeof trx.to === 'object' ? (
                                                        trx.to?.username ||
                                                        trx.to?.name ||
                                                        (trx.to?.firstName ? `${trx.to.firstName} ${trx.to.lastName || ''}` : '-')
                                                    ) : trx.to || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date().toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-sm">
                                                No process history found for this packet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProcessPage;
