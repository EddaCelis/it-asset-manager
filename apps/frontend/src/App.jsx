import React, { useState, useEffect } from 'react';

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // API Endpoint Target (Pointing to your FastAPI port on AWS)
  const API_URL = 'http://52.74.115.60:8001/employees';

  // 1. Fetch current live assets from backend on load
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data: ", err);
        setLoading(false);
      });
  }, []);

  // 2. Handle Action Click for the Offboard Button
  const handleOffboard = async (id) => {
    if (window.confirm(`Are you sure you want to offboard employee #${id}?`)) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        
        if (response.ok) {
          setMessage(result.message);
          // Instantly filter out the deleted record from UI view state
          setEmployees(employees.filter(emp => emp.id !== id));
        } else {
          setMessage("Failed to process offboarding transaction.");
        }
      } catch (error) {
        setMessage("Network connection error encountered.");
      }
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', color: '#1a1a1a' }}>
      <header style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '10px', marginBottom: '30px' }}>
        <h1 style={{ color: '#1a1a1a', margin: 0 }}>📊 IT Asset Manager Portal (React)</h1>
        <p style={{ color: '#666', marginTop: '5px' }}>Production Cloud Status: Connected via Docker Compose</p>
      </header>

      {message && (
        <div style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '15px', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold' }}>
          ℹ️ {message}
        </div>
      )}

      {loading ? (
        <h3>Loading production systems matrix...</h3>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Employee Name</th>
              <th style={{ padding: '12px' }}>Assigned Asset</th>
              <th style={{ padding: '12px' }}>Department</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Management Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No active asset records logged in database registry.</td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>#{emp.id}</td>
                  <td style={{ padding: '12px' }}>{emp.name}</td>
                  <td style={{ padding: '12px' }}><code style={{ background: '#f1f1f1', padding: '4px 8px', borderRadius: '4px', color: '#333' }}>{emp.asset}</code></td>
                  <td style={{ padding: '12px' }}>{emp.department}</td>
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