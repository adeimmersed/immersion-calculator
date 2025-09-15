import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, TrendingUp, Filter, Download, Clock } from 'lucide-react';
import { getAllAssessments, AssessmentRecord } from '../utils/database';

export default function AnalysisPage() {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<string>('q2_language_selection');
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const questionLabels = {
    q1_name: 'Name',
    q2_language_selection: 'Language Selection',
    q3_motivation: 'Motivation',
    q4_speaking_priority: 'Speaking Priority',
    q5_capability_level: 'Capability Level',
    q6_time_commitment: 'Time Commitment',
    q7_lifestyle: 'Lifestyle',
    q8_learning_style: 'Content Consumption',
    q9_current_method: 'Current Method',
    q10_immersion_experience: 'Vocabulary System',
    q11_accent_priority: 'Accent Priority',
    q12_goals: 'Timeline Expectations',
    q13_challenges: 'Learning Obstacles',
    q14_preferences: 'Communication Preference'
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  useEffect(() => {
    if (assessments.length > 0) {
      analyzeQuestion(selectedQuestion);
    }
  }, [selectedQuestion, assessments]);

  const loadAssessments = async () => {
    try {
      const data = await getAllAssessments();
      setAssessments(data);
    } catch (error) {
      console.error('Error loading assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeQuestion = (questionId: string) => {
    const responses = assessments.map(assessment => ({
      id: assessment.id,
      email: assessment.email,
      user_name: assessment.user_name,
      response: assessment[questionId as keyof AssessmentRecord],
      created_at: assessment.created_at
    })).filter(item => item.response !== undefined && item.response !== null);

    setFilteredData(responses);
  };

  const getResponseCounts = () => {
    const counts: { [key: string]: number } = {};
    
    filteredData.forEach(item => {
      let key = '';
      if (Array.isArray(item.response)) {
        key = item.response.join(', ');
      } else if (typeof item.response === 'object' && item.response !== null) {
        key = JSON.stringify(item.response);
      } else {
        key = String(item.response);
      }
      
      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([response, count]) => ({ response, count }))
      .sort((a, b) => b.count - a.count);
  };

  const exportData = () => {
    const csvData = assessments.map(assessment => ({
      'Email': assessment.email,
      'Name': assessment.user_name,
      'Language': assessment.selected_language,
      'Custom Language': assessment.custom_language,
      'Time Commitment': assessment.q6_time_commitment,
      'Speaking Priority': assessment.q4_speaking_priority,
      'Capability Level': assessment.q5_capability_level,
      'Motivation': Array.isArray(assessment.q3_motivation) ? assessment.q3_motivation.join(', ') : assessment.q3_motivation,
      'Lifestyle': assessment.q7_lifestyle,
      'Content Consumption': assessment.q8_learning_style,
      'Current Method': assessment.q9_current_method,
      'Vocabulary System': assessment.q10_immersion_experience,
      'Accent Priority': assessment.q11_accent_priority,
      'Timeline Expectations': Array.isArray(assessment.q12_goals) ? assessment.q12_goals.join(', ') : assessment.q12_goals,
      'Learning Obstacles': Array.isArray(assessment.q13_challenges) ? assessment.q13_challenges.join(', ') : assessment.q13_challenges,
      'Communication Preference': Array.isArray(assessment.q14_preferences) ? assessment.q14_preferences.join(', ') : assessment.q14_preferences,
      'Assessment Date': assessment.created_at
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment data...</p>
        </div>
      </div>
    );
  }

  const responseCounts = getResponseCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Assessment Analysis Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Deep dive into individual question responses
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">{assessments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unique Languages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(assessments.map(a => a.selected_language).filter(Boolean)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Daily Study Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(assessments.reduce((sum, a) => sum + (a.q6_time_commitment || 0), 0) / assessments.length / 60 * 10) / 10}h
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Time to Complete</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.filter(a => a.completion_time && a.completion_time > 0).length > 0 
                    ? `${Math.round(assessments.filter(a => a.completion_time && a.completion_time > 0).reduce((sum, a) => sum + (a.completion_time || 0), 0) / assessments.filter(a => a.completion_time && a.completion_time > 0).length)}m`
                    : 'N/A'
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {assessments.filter(a => a.completion_time && a.completion_time > 0).length} of {assessments.length} completed with timing
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <Filter className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Question Responses</p>
                <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Question Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Question to Analyze</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(questionLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedQuestion(key)}
                className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                  selectedQuestion === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Analysis Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Response Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {questionLabels[selectedQuestion as keyof typeof questionLabels]} Distribution
            </h3>
            <div className="space-y-3">
              {responseCounts.map(({ response, count }, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                        {response}
                      </span>
                      <span className="text-sm text-gray-500">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(count / filteredData.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Responses */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Individual Responses
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredData.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {item.user_name || 'Anonymous'}
                    </span>
                    <div className="flex items-center space-x-2">
                      {item.completion_time && item.completion_time > 0 && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {item.completion_time}m
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {Array.isArray(item.response) 
                      ? item.response.join(', ')
                      : typeof item.response === 'object' 
                        ? JSON.stringify(item.response)
                        : String(item.response)
                    }
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Export Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <button
            onClick={exportData}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Export All Data to CSV
          </button>
        </motion.div>
      </div>
    </div>
  );
}
