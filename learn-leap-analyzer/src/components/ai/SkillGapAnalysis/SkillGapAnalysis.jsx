import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../lib/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SkillGapAnalysis = ({ selectedRole, onAnalysisComplete }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (selectedRole) {
      analyzeSkills();
    }
  }, [selectedRole]);

  const analyzeSkills = async () => {
    if (!selectedRole) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(
        '/ai/analyze',
        { role: selectedRole.role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setAnalysis(response.data.analysis);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(response.data.analysis);
      }
    } catch (err) {
      console.error('Error analyzing skills:', err);
      setError('Failed to analyze skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg">
        Please select a target role to analyze your skill gap.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse p-4 rounded-lg bg-white shadow">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-5/6"></div>
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
          onClick={analyzeSkills}
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-4 bg-blue-50 text-blue-800 rounded-lg">
        Click "Analyze Skills" to see your skill gap analysis.
      </div>
    );
  }

  // Prepare data for the chart
  const chartData = {
    labels: ['Matched Skills', 'Partial Matches', 'Missing Skills'],
    datasets: [
      {
        label: 'Skill Categories',
        data: [
          analysis.matchedCount,
          analysis.partialMatchCount,
          analysis.missingCount,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)', // green
          'rgba(251, 191, 36, 0.7)', // yellow
          'rgba(239, 68, 68, 0.7)', // red
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Skill Gap Analysis',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Skill Gap Analysis: {selectedRole.role}
        </h2>
        
        <div className="mb-6">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${analysis.matchPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>0%</span>
            <span className="font-medium">
              {analysis.matchPercentage}% Match
            </span>
            <span>100%</span>
          </div>
        </div>

        <div className="h-64 mb-6">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-800">Matched Skills</h3>
            <p className="text-2xl font-bold text-green-700">
              {analysis.matchedCount}
            </p>
            <p className="text-sm text-green-600 mt-1">
              You have these skills at the required level
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium text-yellow-800">Partial Matches</h3>
            <p className="text-2xl font-bold text-yellow-700">
              {analysis.partialMatchCount}
            </p>
            <p className="text-sm text-yellow-600 mt-1">
              You have some experience with these skills
            </p>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg">
            <h3 className="font-medium text-red-800">Missing Skills</h3>
            <p className="text-2xl font-bold text-red-700">
              {analysis.missingCount}
            </p>
            <p className="text-sm text-red-600 mt-1">
              You need to develop these skills
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Detailed Skill Breakdown
        </h3>
        
        <div className="space-y-6">
          {analysis.matchedSkills.length > 0 && (
            <div>
              <h4 className="font-medium text-green-700 mb-2">
                ✓ Matched Skills ({analysis.matchedSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.matchedSkills.map((skill, index) => (
                  <span
                    key={`matched-${index}`}
                    className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                  >
                    {skill.requiredSkill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.partialMatches.length > 0 && (
            <div>
              <h4 className="font-medium text-yellow-700 mb-2">
                ⚠️ Partial Matches ({analysis.partialMatches.length})
              </h4>
              <div className="space-y-2">
                {analysis.partialMatches.map((skill, index) => (
                  <div
                    key={`partial-${index}`}
                    className="bg-yellow-50 p-3 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {skill.requiredSkill.name}
                      </span>
                      <span className="text-sm text-yellow-700">
                        {(skill.matchScore * 100).toFixed(0)}% match
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Your skill: {skill.userSkill.name} (
                      {['Beginner', 'Intermediate', 'Advanced'][skill.userSkill.proficiency - 1] || 'Novice'})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.missingSkills.length > 0 && (
            <div>
              <h4 className="font-medium text-red-700 mb-2">
                ✗ Missing Skills ({analysis.missingSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.map((skill, index) => (
                  <span
                    key={`missing-${index}`}
                    className="inline-block bg-red-100 text-red-800 text-sm px-3 py-1 rounded-lg border border-red-200"
                  >
                    {skill.requiredSkill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillGapAnalysis;
