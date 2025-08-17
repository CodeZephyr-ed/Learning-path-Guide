import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RoleSelector from '../components/ai/RoleSelector/RoleSelector';
import SkillGapAnalysis from '../components/ai/SkillGapAnalysis/SkillGapAnalysis';
import LearningRoadmap from '../components/ai/LearningRoadmap/LearningRoadmap';
import { ArrowLeftIcon, LightBulbIcon } from '@heroicons/react/24/outline/index.js';

const AISkillAnalysis = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [skillGapAnalysis, setSkillGapAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' or 'roadmap'
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setSkillGapAnalysis(null);
    setActiveTab('analysis');
  };

  const handleAnalysisComplete = (analysis) => {
    setSkillGapAnalysis(analysis);
  };

  const handleGenerateRoadmap = () => {
    setActiveTab('roadmap');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Dashboard
          </button>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              AI-Powered Skill Gap Analysis
            </h1>
            <p className="text-gray-600">
              Analyze your current skills against your target role and get a personalized learning path.
            </p>
            
            <div className="mt-6">
              <RoleSelector 
                onRoleSelect={handleRoleSelect} 
                selectedRole={selectedRole} 
              />
            </div>
          </div>
        </div>

        {selectedRole && (
          <div className="space-y-8">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'analysis'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Skill Gap Analysis
                  </button>
                  <button
                    onClick={() => skillGapAnalysis && setActiveTab('roadmap')}
                    disabled={!skillGapAnalysis}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'roadmap'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    Learning Roadmap
                  </button>
                </nav>
              </div>
              
              <div className="p-6">
                {activeTab === 'analysis' ? (
                  <div className="space-y-6">
                    <SkillGapAnalysis 
                      selectedRole={selectedRole} 
                      onAnalysisComplete={handleAnalysisComplete}
                    />
                    
                    {skillGapAnalysis && (
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={handleGenerateRoadmap}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Generate Learning Roadmap
                          <LightBulbIcon className="ml-2 -mr-1 h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <LearningRoadmap 
                    selectedRole={selectedRole}
                    skillGapAnalysis={skillGapAnalysis}
                  />
                )}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tips for Success
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Be honest about your current skill levels for the most accurate analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Focus on one or two skill areas at a time to avoid feeling overwhelmed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Update your skills regularly as you progress in your learning journey</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Set realistic goals based on your available time and learning style</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISkillAnalysis;
