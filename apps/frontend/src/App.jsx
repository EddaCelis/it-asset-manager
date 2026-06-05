import React, { useState, useEffect } from 'react';

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // Search state query variable
  const [searchQuery, setSearchQuery] = useState('');

  // Form input state variables
  const [formData, setFormData] = useState({
    employee_name: '',
    assigned_laptop: '',
    department: ''
  });

  // 🎯 Production cloud API gateway mapping port channel
  const API_URL = 'http://52.74.115.60:8085/employees';

  // 1. READ/GET: Fetch all live asset entries from backend database
  const fetchAssets = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching database array: ", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // 2. CREATE/POST: Handle interactive form submission natively
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employee_name || !formData.assigned_laptop || !formData.department) {
      alert("Please fill out all operational input fields before registering.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          is_onboarding_complete: true // Forces required Pydantic validation match
        })
      });

      if (response.ok) {
        setMessage(`Successfully registered asset infrastructure metrics for ${formData.employee_name}!`);
        setFormData({ employee_name: '', assigned_laptop: '', department: '' }); // Reset text fields
        fetchAssets(); // Refresh grid layout from database natively
      } else {
        setMessage("System payload validation conflict encountered via API.");
      }
    } catch (error) {
      setMessage("Failed to transmit asset data packet to production endpoint.");
    }
  };

  // 3. DELETE: Process offboarding sequence
  const handleOffboard = async (id) => {
    if (window.confirm(`Are you sure you want to offboard employee record #${id}?`)) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        
        if (response.ok) {
          setMessage(result.message || `Record #${id} successfully dropped from production grid.`);
          setEmployees(employees.filter(emp => emp.id !== id));
        } else {
          setMessage("Failed to process transaction on cloud host module.");
        }
      } catch (error) {
        setMessage("Network connection timeout encountered.");
      }
    }
  };

  // 4. SEARCH/GET FILTER: Real-time calculation filtering through the dataset matrix
  const filteredEmployees = employees.filter((emp) => {
    const query = searchQuery.toLowerCase();
    return (
      emp.id.toString().includes(query) ||
      (emp.employee_name && emp.employee_name.toLowerCase().includes(query)) ||
      (emp.assigned_laptop && emp.assigned_laptop.toLowerCase().includes(query)) ||
      (emp.department && emp.department.toLowerCase().includes(query))
    );
  });

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', color: '#ffffff' }}>
      <header style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '10px', marginBottom: '30px' }}>
        <h1 style={{ color: '#ffffff', margin: 0 }}>📊 IT Asset Manager Portal (React)</h1>
        <p style={{ color: '#aaa', marginTop: '5px' }}>Production Cloud Status: Operations Pipeline Active</p>
      </header>

      {message && (
        <div style={{ backgroundColor: '#1e3a8a', color: '#60a5fa', padding: '15px', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold', border: '1px solid #2563eb' }}>
          ℹ️ {message}
        </div>
      )}

      {/* SECTION A: CREATE FORM COMPONENT */}
      <section style={{ background: '#1e1e1e', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #333' }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#60a5fa' }}>➕ Register New Corporate Hardware Infrastructure</h3>
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#aaa', fontWeight: 'bold' }}>EMPLOYEE FULL NAME</label>
            <input type="text" name="employee_name" value={formData.employee_name} onChange={handleInputChange} placeholder="e.g. Santos" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: '#fff' }} />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#aaa', fontWeight: 'bold' }}>ASSIGNED LAPTOP ASSET</label>
            <input type="text" name="assigned_laptop" value={formData.assigned_laptop} onChange={handleInputChange} placeholder="e.g. ThinkPad T14" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: '#fff' }} />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#aaa', fontWeight: 'bold' }}>DEPARTMENT MATRIX</label>
            <input type="text" name="department" value={formData.department} onChange={handleInputChange} placeholder="e.g. Data Science" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: '#fff' }} />
          </div>
          <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '11px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}>
            Save Infrastructure
          </button>
        </form>
      </section>

      {/* SECTION B: LIVE SEARCH FILTERS */}
      <section style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="🔍 Real-time search by ID, Name, Asset, or Department..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          style={{ width: '100%', padding: '12px 15px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff', fontSize: '14px' }}
        />
      </section>

      {/* SECTION C: READ GRID ENGINE */}
      {loading ? (
        <h3 style={{ color: '#ffffff' }}>Querying structural core matrix elements...</h3>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
          <thead>
            <tr style={{ backgroundColor: '#2d2d2d', borderBottom: '2px solid #444', textAlign: 'left' }}>
              <th style={{ padding: '12px', color: '#60a5fa' }}>ID</th>
              <th style={{ padding: '12px', color: '#60a5fa' }}>Employee Name</th>
              <th style={{ padding: '12px', color: '#60a5fa' }}>Assigned Asset</th>
              <th style={{ padding: '12px', color: '#60a5fa' }}>Department</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#60a5fa' }}>Management Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#bbb' }}>No records match the current database query criteria.</td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid #333', backgroundColor: '#1a1a1a' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#ffffff' }}>#{emp.id}</td>
                  <td style={{ padding: '12px', color: '#ffffff' }}>{emp.employee_name}</td>
                  <td style={{ padding: '12px' }}>
                    <code style={{ background: '#333', padding: '4px 8px', borderRadius: '4px', color: '#60a5fa', fontWeight: 'bold', border: '1px solid #444' }}>
                      {emp.assigned_laptop}
                    </code>
                  </td>
                  <td style={{ padding: '12px', color: '#ffffff' }}>{emp.department}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleOffboard(emp.id)}
                      style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}
                    >
                      🛑 Offboard Employee
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;