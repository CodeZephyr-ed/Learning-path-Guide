import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../lib/api';

const RoleSelector = ({ onRoleSelect, selectedRole }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get('/ai/roles', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRoles(response.data);
      } catch (err) {
        console.error('Error fetching roles:', err);
        setError('Failed to load roles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [token]);

  const handleRoleSelect = (e) => {
    const role = roles.find(r => r.role === e.target.value);
    onRoleSelect(role);
  };

  if (loading) {
    return (
      <div className="animate-pulse p-4 rounded-lg bg-white shadow">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 text-red-700">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Select Your Target Role
      </h2>
      <div className="space-y-4">
        <select
          value={selectedRole?.role || ''}
          onChange={handleRoleSelect}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">-- Select a role --</option>
          {roles.map((role) => (
            <option key={role._id} value={role.role}>
              {role.role}
            </option>
          ))}
        </select>
        
        {selectedRole && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800">{selectedRole.role}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {selectedRole.description}
            </p>
            {selectedRole.experienceLevel && (
              <div className="mt-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {selectedRole.experienceLevel} level
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelector;
