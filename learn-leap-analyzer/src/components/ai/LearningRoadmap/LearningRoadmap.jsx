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
      const missing = skillGapAnalysis.missingSkills?.map(s => s.name) || [];
      const partial = skillGapAnalysis.partialSkills?.map(s => s.name) || [];
      const skillGaps = [...new Set([...missing, ...partial])];

      if (skillGaps.length === 0) {
        setRoadmap([]); // No gaps, no roadmap needed
        return;
      }

      const response = await api.post('/learning-paths/generate-ai', 
        { 
          targetRole: selectedRole.role, 
          skillGaps 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setRoadmap(response.data.roadmap);
    } catch (err) {
      console.error('Error generating roadmap:', err);
      setError(err.response?.data?.message || 'Failed to generate learning roadmap. Please try again.');
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



  const formatRoadmapForTxt = (roadmapData, roleName) => {
    if (!roadmapData || roadmapData.length === 0) return "No roadmap generated.";

    let content = `Learning Roadmap for: ${roleName}\n\n`;
    content += "========================================\n\n";

    roadmapData.forEach(step => {
      content += `Step ${step.step}: ${step.title}\n\n`;
      
      content += "Topics to Cover:\n";
      step.topics.forEach(topic => {
        content += `- ${topic}\n`;
      });
      content += "\n";

      content += "Suggested Resources:\n";
      step.resources.forEach(resource => {
        content += `- ${resource}\n`;
      });
      content += "\n========================================\n\n";
    });

    return content;
  };

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
          
          <div className="space-y-8">
            {roadmap.map((step) => (
              <div key={step.step} className="p-6 border border-gray-200 rounded-xl bg-gray-50/50">
                <h3 className="font-bold text-lg text-blue-700 mb-4">
                  Step {step.step}: {step.title}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-md text-gray-800 mb-2">Topics to Cover:</h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {step.topics.map((topic, i) => <li key={i}>{topic}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-md text-gray-800 mb-2">Suggested Resources:</h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {step.resources.map((resource, i) => <li key={i}>{resource}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Save or share your roadmap:
            </h3>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  const textContent = formatRoadmapForTxt(roadmap, selectedRole.role);
                  const element = document.createElement('a');
                  const file = new Blob([textContent], { type: 'text/plain' });
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
