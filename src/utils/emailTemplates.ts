import { PersonalizedEmailData } from './dataStorage';
import { capitalizeLanguage } from './languageUtils';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export const generatePersonalizedEmail = (data: PersonalizedEmailData): EmailTemplate => {
  const { 
    userName,
    learnerProfile, 
    intensityLevel, 
    timeCommitment, 
    selectedLanguage, 
    motivation, 
    personalizedInsights, 
    nextSteps, 
    recommendations 
  } = data;


  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h ${remainingMinutes}m`;
      }
    }
  };

  const getIntensityDescription = (level: number): string => {
    if (level >= 7) return "High Intensity";
    if (level >= 4) return "Moderate Intensity";
    return "Foundation Level";
  };

  const getMotivationText = (motivation: string[]): string => {
    if (motivation.includes('enjoyment')) return "your love for the culture and media";
    if (motivation.includes('career')) return "your professional goals";
    if (motivation.includes('travel')) return "your travel aspirations";
    if (motivation.includes('heritage')) return "your family connection";
    if (motivation.includes('education')) return "your academic pursuits";
    if (motivation.includes('challenge')) return "your personal growth journey";
    return "your language learning goals";
  };

  const subject = `${userName ? `Hey ${userName},` : 'Hey there,'} your ${capitalizeLanguage(selectedLanguage)} Immersion Roadmap is Ready! 🚀`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Personalized Language Learning Plan</title>
      <style>
        body {
          font-family: 'Poppins', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #ff6b9d;
        }
        .profile-badge {
          background: linear-gradient(135deg, #ff6b9d, #ff8fab);
          color: white;
          padding: 15px 25px;
          border-radius: 25px;
          display: inline-block;
          font-weight: bold;
          font-size: 18px;
          margin: 15px 0;
        }
        .intensity-meter {
          background: #f0f0f0;
          border-radius: 10px;
          height: 20px;
          margin: 10px 0;
          overflow: hidden;
        }
        .intensity-fill {
          background: linear-gradient(90deg, #4ecdc4, #44a08d);
          height: 100%;
          width: ${(intensityLevel / 9) * 100}%;
          border-radius: 10px;
          transition: width 0.3s ease;
        }
        .insight-box {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 15px 0;
          border-radius: 0 8px 8px 0;
        }
        .step-box {
          background: #d1ecf1;
          border-left: 4px solid #17a2b8;
          padding: 15px;
          margin: 15px 0;
          border-radius: 0 8px 8px 0;
        }
        .recommendation-box {
          background: #d4edda;
          border-left: 4px solid #28a745;
          padding: 15px;
          margin: 15px 0;
          border-radius: 0 8px 8px 0;
        }
        .cta-button {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 25px;
          display: inline-block;
          font-weight: bold;
          margin: 20px 0;
          text-align: center;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #666;
          font-size: 14px;
        }
        .highlight {
          color: #ff6b9d;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 ${userName ? `${userName}'s` : 'Your'} ${capitalizeLanguage(selectedLanguage)} Immersion Plan</h1>
          <div class="profile-badge">${learnerProfile}</div>
          <p>Intensity Level: <span class="highlight">${intensityLevel}/9</span> - ${getIntensityDescription(intensityLevel)}</p>
          <div class="intensity-meter">
            <div class="intensity-fill"></div>
          </div>
        </div>

        <h2>📊 ${userName ? `${userName}'s` : 'Your'} Assessment Results</h2>
        <p>${userName ? `${userName}, based on your responses,` : 'Based on your responses,'} you're ready to commit <span class="highlight">${formatTime(timeCommitment)} daily</span> to ${capitalizeLanguage(selectedLanguage)} learning, driven by ${getMotivationText(motivation)}.</p>

        ${personalizedInsights.length > 0 ? `
        <div class="insight-box">
          <h3>💡 Personalized Insights</h3>
          <ul>
            ${personalizedInsights.map(insight => `<li>${insight}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <h2>🎯 Your Next Steps</h2>
        <div class="step-box">
          <ol>
            ${nextSteps.map(step => `<li>${step}</li>`).join('')}
          </ol>
        </div>

        <h2>💡 Personalized Recommendations</h2>
        <div class="recommendation-box">
          <ul>
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>

        <div style="text-align: center;">
          <a href="#" class="cta-button">Start Your Immersion Journey</a>
        </div>

        <div class="footer">
          <p>This assessment was generated specifically for your learning profile. Keep this email as a reference for your language learning journey!</p>
          <p>Questions? Reply to this email - I personally read every response.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
${userName ? `Hey ${userName},` : 'Hey there,'} your ${capitalizeLanguage(selectedLanguage)} Immersion Roadmap is Ready! 🚀

PROFILE: ${learnerProfile}
INTENSITY LEVEL: ${intensityLevel}/9 - ${getIntensityDescription(intensityLevel)}
DAILY COMMITMENT: ${formatTime(timeCommitment)}

${userName ? `${userName.toUpperCase()}'S` : 'YOUR'} ASSESSMENT RESULTS:
${userName ? `${userName}, based on your responses,` : 'Based on your responses,'} you're ready to commit ${formatTime(timeCommitment)} daily to ${capitalizeLanguage(selectedLanguage)} learning, driven by ${getMotivationText(motivation)}.

${personalizedInsights.length > 0 ? `
PERSONALIZED INSIGHTS:
${personalizedInsights.map(insight => `• ${insight}`).join('\n')}
` : ''}

YOUR NEXT STEPS:
${nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

PERSONALIZED RECOMMENDATIONS:
${recommendations.map(rec => `• ${rec}`).join('\n')}

This assessment was generated specifically for your learning profile. Keep this email as a reference for your language learning journey!

Questions? Reply to this email - I personally read every response.
  `;

  return { subject, html, text };
};

export const generateFollowUpEmail = (data: PersonalizedEmailData, daysSinceAssessment: number): EmailTemplate => {
  const { learnerProfile, selectedLanguage, intensityLevel } = data;
  

  let subject = '';
  let content = '';

  if (daysSinceAssessment === 1) {
    subject = `Day 1: How's your ${capitalizeLanguage(selectedLanguage)} journey going? 🌟`;
    content = `
      <h2>Day 1 Check-in</h2>
      <p>How did your first day with your personalized ${capitalizeLanguage(selectedLanguage)} plan go?</p>
      <p>Remember, consistency beats perfection. Even if you only managed 10 minutes today, that's 10 minutes more than yesterday!</p>
    `;
  } else if (daysSinceAssessment === 7) {
    subject = `Week 1: Your ${capitalizeLanguage(selectedLanguage)} progress update 📈`;
    content = `
      <h2>Week 1 Progress Check</h2>
      <p>Congratulations on completing your first week! How are you feeling about your ${capitalizeLanguage(selectedLanguage)} routine?</p>
      <p>This is where most people either solidify their habit or start to struggle. What's working well for you?</p>
    `;
  } else if (daysSinceAssessment === 30) {
    subject = `Month 1: Time to level up your ${capitalizeLanguage(selectedLanguage)} game! 🚀`;
    content = `
      <h2>Month 1 Milestone</h2>
      <p>Amazing! You've been at this for a month. That's longer than 80% of language learners stick with it.</p>
      <p>Now it's time to assess what's working and what needs adjustment. Ready to take it to the next level?</p>
    `;
  } else {
    subject = `Your ${capitalizeLanguage(selectedLanguage)} journey continues... 💪`;
    content = `
      <h2>Progress Check-in</h2>
      <p>How's your ${capitalizeLanguage(selectedLanguage)} learning going? I'd love to hear about your progress and any challenges you're facing.</p>
    `;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: 'Poppins', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #ff6b9d;
        }
        .cta-button {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 25px;
          display: inline-block;
          font-weight: bold;
          margin: 20px 0;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${subject}</h1>
        </div>
        
        ${content}
        
        <div style="text-align: center;">
          <a href="#" class="cta-button">Share Your Progress</a>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `${subject}\n\n${content.replace(/<[^>]*>/g, '')}`;

  return { subject, html, text };
};
