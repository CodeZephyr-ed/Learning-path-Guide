import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';


const RoleSelector = ({ onRoleSelect, selectedRole }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  // Predefined list of roles since we don't have a dedicated roles endpoint
  const predefinedRoles = [
    {
      role: 'Frontend Developer',
      description: 'Builds user interfaces and client-side functionality',
      experienceLevel: 'Mid-level',
      requiredSkills: [
        { name: 'HTML', category: 'Web Development', level: 'Advanced' },
        { name: 'CSS', category: 'Web Development', level: 'Advanced' },
        { name: 'JavaScript', category: 'Programming', level: 'Advanced' },
        { name: 'React', category: 'Frontend', level: 'Intermediate' },
        { name: 'Responsive Design', category: 'UI/UX', level: 'Intermediate' }
      ]
    },
    {
      role: 'Backend Developer',
      description: 'Develops server-side logic and database interactions',
      experienceLevel: 'Mid-level',
      requiredSkills: [
        { name: 'Node.js', category: 'Backend', level: 'Advanced' },
        { name: 'Express', category: 'Backend', level: 'Intermediate' },
        { name: 'MongoDB', category: 'Database', level: 'Intermediate' },
        { name: 'RESTful APIs', category: 'Backend', level: 'Advanced' },
        { name: 'Authentication', category: 'Security', level: 'Intermediate' }
      ]
    },
    {
      role: 'Full Stack Developer',
      description: 'Handles both frontend and backend development',
      experienceLevel: 'Senior',
      requiredSkills: [
        { name: 'JavaScript', category: 'Programming', level: 'Advanced' },
        { name: 'React', category: 'Frontend', level: 'Advanced' },
        { name: 'Node.js', category: 'Backend', level: 'Advanced' },
        { name: 'Express', category: 'Backend', level: 'Advanced' },
        { name: 'MongoDB', category: 'Database', level: 'Intermediate' },
        { name: 'RESTful APIs', category: 'Backend', level: 'Advanced' }
      ]
    },
    {
      role: 'Data Scientist',
      description: 'Analyzes and interprets complex data',
      experienceLevel: 'Mid-level',
      requiredSkills: [
        { name: 'Python', category: 'Programming', level: 'Advanced' },
        { name: 'Pandas', category: 'Data Analysis', level: 'Intermediate' },
        { name: 'NumPy', category: 'Data Analysis', level: 'Intermediate' },
        { name: 'Machine Learning', category: 'AI/ML', level: 'Intermediate' },
        { name: 'Data Visualization', category: 'Data Analysis', level: 'Intermediate' }
      ]
    }
  ];

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        // Use predefined roles instead of API call
        setRoles(predefinedRoles);
      } catch (err) {
        console.error('Error fetching roles:', err);
        setError('Failed to load roles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

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
            <option key={role.role} value={role.role}>
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
