import type { NextApiRequest, NextApiResponse } from 'next';

interface EmailCaptureRequest {
  email: string;
  responses?: any;
  results?: any;
}

interface EmailCaptureResponse {
  success: boolean;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmailCaptureResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, responses, results }: EmailCaptureRequest = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email is required' });
  }

  try {
    // TODO: Integrate with your email service provider
    // Example integrations:
    
    // ConvertKit Integration:
    // const convertKitResponse = await fetch(`https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     api_key: process.env.CONVERTKIT_API_KEY,
    //     email: email,
    //     tags: ['immersion-calculator'],
    //     fields: {
    //       learner_profile: results?.learnerProfile?.id,
    //       time_commitment: results?.timeAllocation?.totalTime,
    //     }
    //   })
    // });

    // Mailchimp Integration:
    // const mailchimpResponse = await fetch(`https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.MAILCHIMP_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email_address: email,
    //     status: 'subscribed',
    //     tags: ['immersion-calculator'],
    //     merge_fields: {
    //       PROFILE: results?.learnerProfile?.id,
    //       TIMECOMMIT: results?.timeAllocation?.totalTime,
    //     }
    //   })
    // });

    // For now, we'll just log the data
    console.log('Email captured:', {
      email,
      timestamp: new Date().toISOString(),
      learnerProfile: results?.learnerProfile?.id,
      timeCommitment: results?.timeAllocation?.totalTime,
    });

    // Store in database (example)
    // await db.emailCaptures.create({
    //   email,
    //   responses,
    //   results,
    //   capturedAt: new Date(),
    // });

    return res.status(200).json({ 
      success: true, 
      message: 'Email captured successfully' 
    });

  } catch (error) {
    console.error('Email capture error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to capture email' 
    });
  }
}
