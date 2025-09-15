import type { NextApiRequest, NextApiResponse } from 'next';

interface BeehiivSubscribeRequest {
  email: string;
  responses: any;
  results: any;
}

interface BeehiivSubscribeResponse {
  success: boolean;
  message: string;
  subscriberId?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BeehiivSubscribeResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, responses, results }: BeehiivSubscribeRequest = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email is required' });
  }

  try {
    const beehiivApiKey = process.env.BEEHIIV_API_KEY;
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

    if (!beehiivApiKey || !publicationId) {
      throw new Error('Beehiiv API credentials not configured');
    }

    // Calculate intensity level for custom fields
    const timeCommitment = results?.timeAllocation?.totalTime || 0;
    const capabilityLevel = responses?.['capability-level'] || 'unknown';
    const speakingPriority = responses?.['speaking-priority'] || 'unknown';
    
    let intensityLevel = 1;
    if (timeCommitment >= 240) intensityLevel = 8;
    else if (timeCommitment >= 180) intensityLevel = 7;
    else if (timeCommitment >= 120) intensityLevel = 6;
    else if (timeCommitment >= 90) intensityLevel = 5;
    else if (timeCommitment >= 60) intensityLevel = 4;
    else if (timeCommitment >= 45) intensityLevel = 3;
    else if (timeCommitment >= 30) intensityLevel = 2;

    // Create subscriber with custom fields
    const subscriberData = {
      email,
      reactivate_existing: false,
      send_welcome_email: true,
      custom_fields: {
        user_name: responses?.userName || 'Anonymous',
        learner_profile: results?.learnerProfile?.id || 'unknown',
        learner_profile_title: results?.learnerProfile?.title || 'Unknown',
        time_commitment: timeCommitment,
        intensity_level: intensityLevel,
        selected_language: responses?.['language-selection']?.language || 'unknown',
        timeline: responses?.['language-selection']?.timeline || 'unknown',
        motivation: Array.isArray(responses?.motivation) ? responses.motivation.join(', ') : (responses?.motivation || 'unknown'),
        capability_level: capabilityLevel,
        speaking_priority: speakingPriority,
        current_method: responses?.['current-method'] || 'unknown',
        accent_priority: responses?.['accent-priority'] || 'unknown',
        content_consumption: responses?.['content-consumption'] || 'unknown',
        vocabulary_system: responses?.['vocabulary-system'] || 'unknown',
        learning_obstacles: responses?.['learning-obstacles'] || 'unknown',
        lifestyle: responses?.lifestyle || 'unknown',
        assessment_date: new Date().toISOString(),
        total_questions: 14,
        completion_time: new Date().toISOString()
      }
    };

    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${beehiivApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscriberData)
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        return res.status(200).json({
          success: true,
          message: 'Email already subscribed - updated with new assessment data'
        });
      }
      throw new Error(`Beehiiv API error: ${responseData.message || 'Unknown error'}`);
    }

    // Store detailed results in your database (optional)
    // await storeAssessmentResults(email, responses, results);

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      subscriberId: responseData.id
    });

  } catch (error: any) {
    console.error('Beehiiv subscription error:', error);
    
    return res.status(500).json({
      success: false,
      message: `Failed to subscribe to newsletter: ${error.message}`
    });
  }
}
