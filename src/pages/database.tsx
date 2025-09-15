import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Database, Users, Mail, Globe, Clock } from 'lucide-react';
import { getAllAssessments, exportCurrentData, importData, AssessmentRecord } from '../utils/database';

export default function DatabasePage() {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentRecord | null>(null);
  const [exportData, setExportData] = useState('');

  useEffect(() => {
    loadAssessments();
  }, []);

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

  const handleExport = () => {
    const data = exportCurrentData();
    setExportData(data);
    
    // Download as JSON file
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessments_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          importData(data);
          loadAssessments();
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data: ' + error);
        }
      };
      reader.readAsText(file);
    }
  };

  const getLanguageDisplay = (assessment: AssessmentRecord) => {
    if (assessment.custom_language) {
      return assessment.custom_language;
    }
    return assessment.selected_language || 'Unknown';
  };

  const getIntensityColor = (level?: number) => {
    if (!level) return 'bg-gray-200';
    if (level <= 3) return 'bg-green-200 text-green-800';
    if (level <= 6) return 'bg-yellow-200 text-yellow-800';
    return 'bg-red-200 text-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Database className="w-8 h-8 mr-3 text-blue-600" />
                Assessment Database
              </h1>
              <p className="mt-2 text-gray-600">
                View and manage all assessment responses and user data
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleExport}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
              <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Import Data
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">{assessments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Unique Emails</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(assessments.map(a => a.email)).size}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Globe className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Languages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(assessments.map(a => getLanguageDisplay(a))).size}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Intensity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.length > 0 
                    ? (assessments.reduce((sum, a) => sum + (a.intensity_level || 0), 0) / assessments.length).toFixed(1)
                    : '0'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assessments List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Assessments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Intensity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assessments.map((assessment) => (
                  <motion.tr
                    key={assessment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {assessment.user_name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-gray-500">{assessment.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getLanguageDisplay(assessment)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getIntensityColor(assessment.intensity_level)}`}>
                        {assessment.intensity_level || 'N/A'}/9
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assessment.learner_profile || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assessment.created_at 
                        ? new Date(assessment.created_at).toLocaleDateString()
                        : 'N/A'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedAssessment(assessment)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assessment Details Modal */}
        {selectedAssessment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Assessment Details
                  </h3>
                  <button
                    onClick={() => setSelectedAssessment(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">User Information</h4>
                    <p><strong>Name:</strong> {selectedAssessment.user_name || 'Anonymous'}</p>
                    <p><strong>Email:</strong> {selectedAssessment.email}</p>
                    <p><strong>Language:</strong> {getLanguageDisplay(selectedAssessment)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Assessment Results</h4>
                    <p><strong>Intensity Level:</strong> {selectedAssessment.intensity_level || 'N/A'}/9</p>
                    <p><strong>Learner Profile:</strong> {selectedAssessment.learner_profile || 'N/A'}</p>
                    <p><strong>Time Commitment:</strong> {selectedAssessment.time_commitment || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">All Responses</h4>
                    <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-64">
                      {JSON.stringify(selectedAssessment.responses, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
