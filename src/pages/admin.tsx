import React, { useState, useEffect } from 'react';
import { getAllAssessments, AssessmentRecord } from '../utils/database';
import { generatePersonalizedEmail } from '../utils/emailTemplates';
import { PersonalizedEmailData } from '../utils/dataStorage';

const AdminPage: React.FC = () => {
  const [assessmentData, setAssessmentData] = useState<AssessmentRecord[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentRecord | null>(null);
  const [emailPreview, setEmailPreview] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllAssessments();
        setAssessmentData(data);
      } catch (error) {
        console.error('Error loading assessment data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const generateEmailPreview = (assessment: AssessmentRecord) => {
    const emailData: PersonalizedEmailData = {
      email: assessment.email,
      userName: assessment.user_name || 'there',
      learnerProfile: assessment.results?.learnerProfile?.title || 'Unknown',
      intensityLevel: assessment.results?.intensityLevel || 0,
      timeCommitment: assessment.results?.timeAllocation?.totalTime || 0,
      selectedLanguage: assessment.selected_language || 'your target language',
      motivation: Array.isArray(assessment.responses?.motivation) 
        ? assessment.responses.motivation 
        : [],
      personalizedInsights: assessment.results?.personalizedInsights || [],
      nextSteps: assessment.results?.nextSteps || [],
      recommendations: assessment.results?.recommendations || []
    };

    const template = generatePersonalizedEmail(emailData);
    setEmailPreview(template.html);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Assessment Data Admin</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Assessments</h3>
            <p className="text-3xl font-bold text-blue-600">{assessmentData.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Unique Emails</h3>
            <p className="text-3xl font-bold text-green-600">
              {new Set(assessmentData.map(a => a.email)).size}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Unique Languages</h3>
            <p className="text-3xl font-bold text-purple-600">
              {new Set(assessmentData.map(a => a.selected_language).filter(Boolean)).size}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Last Updated</h3>
            <p className="text-sm text-gray-500">
              {assessmentData.length > 0 
                ? new Date(assessmentData[0].created_at || assessmentData[0].assessment_date || '').toLocaleString()
                : 'No data'
              }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assessment List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Recent Assessments</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {assessmentData.map((assessment) => (
                <div
                  key={assessment.id}
                  className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedAssessment(assessment);
                    generateEmailPreview(assessment);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{assessment.user_name || 'Anonymous'} ({assessment.email})</p>
                      <p className="text-sm text-gray-600">
                        {assessment.selected_language || 'Unknown'} • 
                        {assessment.learner_profile || 'Unknown Profile'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(assessment.created_at || assessment.assessment_date || '').toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        Level {assessment.intensity_level || 0}/9
                      </p>
                      <p className="text-xs text-gray-500">
                        {assessment.time_commitment || '0 min/day'}
                      </p>
                      {assessment.completion_time && (
                        <p className="text-xs text-green-600">
                          {assessment.completion_time}m
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email Preview */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Email Preview</h2>
            </div>
            <div className="p-6">
              {selectedAssessment ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Selected Assessment:</h3>
                    <p className="text-sm text-gray-600">{selectedAssessment.email}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ __html: emailPreview }} />
                  </div>
                  <button
                    onClick={() => {
                      const emailData: PersonalizedEmailData = {
                        email: selectedAssessment.email,
                        userName: selectedAssessment.user_name || 'Unknown',
                        learnerProfile: selectedAssessment.results?.learnerProfile?.title || 'Unknown',
                        intensityLevel: selectedAssessment.results?.intensityLevel || 0,
                        timeCommitment: selectedAssessment.results?.timeAllocation?.totalTime || 0,
                        selectedLanguage: selectedAssessment.responses?.['language-selection']?.language || 'unknown',
                        motivation: Array.isArray(selectedAssessment.responses?.motivation) 
                          ? selectedAssessment.responses.motivation 
                          : [],
                        personalizedInsights: selectedAssessment.results?.personalizedInsights || [],
                        nextSteps: selectedAssessment.results?.nextSteps || [],
                        recommendations: selectedAssessment.results?.recommendations || []
                      };
                      const template = generatePersonalizedEmail(emailData);
                      console.log('Email template:', template);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Generate Email Template
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">Select an assessment to preview the email</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPage;
