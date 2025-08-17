import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../lib/api';
import { 
  BookOpenIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  AcademicCapIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline/index.js';

const LearningRoadmap = ({ selectedRole, skillGapAnalysis }) => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preferences, setPreferences] = useState({
    learningStyle: 'visual',
    timeCommitment: 'medium',
    focusAreas: []
  });
  const { token } = useAuth();

  const generateRoadmap = async () => {
    if (!selectedRole || !skillGapAnalysis) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(
        '/ai/roadmap',
        { 
          role: selectedRole.role,
          preferences
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setRoadmap(response.data.roadmap);
    } catch (err) {
      console.error('Error generating roadmap:', err);
      setError('Failed to generate learning roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? checked
          ? [...prev.focusAreas, value]
          : prev.focusAreas.filter(item => item !== value)
        : value
    }));
  };

  // Extract unique categories from missing skills for focus areas
  const focusAreaOptions = [
    ...new Set(
      (skillGapAnalysis?.missingSkills || [])
        .map(skill => skill.requiredSkill.category)
        .filter(Boolean)
    )
  ];

  if (!selectedRole) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg">
        Please select a target role to generate a learning roadmap.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse p-6 rounded-lg bg-white shadow">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="h-5 bg-gray-200 rounded w-2/3 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 text-red-700">
        <p>{error}</p>
        <button
          onClick={generateRoadmap}
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Generate Your Learning Roadmap
        </h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Learning Style
            </label>
            <select
              name="learningStyle"
              value={preferences.learningStyle}
              onChange={handlePreferenceChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="visual">Visual (Videos, Diagrams)</option>
              <option value="hands-on">Hands-on (Projects, Coding)</option>
              <option value="theoretical">Theoretical (Reading, Documentation)</option>
              <option value="mixed">Mixed Approach</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weekly Time Commitment
            </label>
            <select
              name="timeCommitment"
              value={preferences.timeCommitment}
              onChange={handlePreferenceChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="low">Low (1-4 hours/week)</option>
              <option value="medium">Medium (5-10 hours/week)</option>
              <option value="high">High (10+ hours/week)</option>
            </select>
          </div>
          
          {focusAreaOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Focus Areas (Optional)
              </label>
              <div className="space-y-2">
                {focusAreaOptions.map(area => (
                  <label key={area} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="focusAreas"
                      value={area}
                      checked={preferences.focusAreas.includes(area)}
                      onChange={handlePreferenceChange}
                      className="rounded text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{area}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          <button
            onClick={generateRoadmap}
            disabled={loading}
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                <span>Generating Roadmap...</span>
              </>
            ) : (
              <>
                <AcademicCapIcon className="h-5 w-5" />
                <span>Generate Learning Roadmap</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {roadmap && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Personalized Learning Roadmap
            </h2>
            <button
              onClick={generateRoadmap}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span>Regenerate</span>
            </button>
          </div>
          
          <div className="prose max-w-none">
            {roadmap.split('\n\n').map((section, index) => {
              // Simple parsing for different section types
              if (section.startsWith('## ')) {
                return (
                  <h3 key={index} className="text-lg font-semibold mt-6 mb-3 text-gray-800">
                    {section.replace('## ', '')}
                  </h3>
                );
              } else if (section.startsWith('- ')) {
                return (
                  <ul key={index} className="list-disc pl-5 space-y-1 mb-4">
                    {section.split('\n').map((item, i) => (
                      <li key={i} className="text-gray-700">
                        {item.replace(/^[-*]\s*/, '')}
                      </li>
                    ))}
                  </ul>
                );
              } else if (section.match(/^\d+\.\s/)) {
                return (
                  <ol key={index} className="list-decimal pl-5 space-y-1 mb-4">
                    {section.split('\n').map((item, i) => (
                      <li key={i} className="text-gray-700">
                        {item.replace(/^\d+\.\s*/, '')}
                      </li>
                    ))}
                  </ol>
                );
              } else {
                return (
                  <p key={index} className="text-gray-700 mb-4">
                    {section}
                  </p>
                );
              }
            })}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Save or share your roadmap:
            </h3>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  // Implement download functionality
                  const element = document.createElement('a');
                  const file = new Blob([roadmap], { type: 'text/plain' });
                  element.href = URL.createObjectURL(file);
                  element.download = `learning-roadmap-${selectedRole.role.toLowerCase().replace(/\s+/g, '-')}.txt`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Download as TXT
              </button>
              <button
                onClick={() => {
                  // Implement print functionality
                  window.print();
                }}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Print Roadmap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningRoadmap;
