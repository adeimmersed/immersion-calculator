# Immersion Intensity Calculator - Setup Guide

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in the root directory with your Beehiiv API credentials:

```env
# Beehiiv API Configuration
BEEHIIV_API_KEY=nReJSHcDxStblY74PkPHEskt3aU1txYed3onSWwPK7TYyFC5b00mvWB1ZDeaILk1
BEEHIIV_PUBLICATION_ID=1fa890ac-7e9b-47e9-a06e-3dd9c86e78cb

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your calculator in action!

## 👤 Name Capture Feature

The calculator now captures the user's name:
- ✅ **Hero Section**: Name input appears before starting the assessment
- ✅ **Personalized Results**: Name displayed throughout the results page
- ✅ **Email Personalization**: All emails use the user's name
- ✅ **Data Storage**: Name stored with assessment data
- ✅ **Beehiiv Integration**: Name included in custom fields

## 📱 Mobile Responsiveness Fixed

The results page now:
- ✅ Hides calculator on mobile, shows full-width assessment sheet
- ✅ Responsive typography and spacing
- ✅ Optimized for touch interactions
- ✅ Print-friendly layout

## 🖨️ Print & Save Functionality

Both features are now fully functional:
- **Print**: Opens a new window with formatted, print-ready version
- **Save**: Downloads a JSON file with complete assessment data

## 📧 Beehiiv Integration

Your API is configured to:
- ✅ Capture emails with custom fields
- ✅ Store learner profile data
- ✅ Track intensity levels and time commitments
- ✅ Segment users by language and profile type

### Custom Fields Stored:
- `user_name`: The user's name for personalization
- `learner_profile`: The user's profile type (e.g., "The Immersion Devotee")
- `time_commitment`: Daily time commitment in minutes
- `intensity_level`: Calculated intensity level (1-9)
- `selected_language`: Target language
- `timeline`: Expected timeline
- `motivation`: User's motivation factors
- `capability_level`: Current skill level
- `speaking_priority`: Speaking goals
- `assessment_date`: When they completed the assessment

## 📊 Data Management

### Local Storage
Assessment data is stored in:
- Browser localStorage (for persistence)
- In-memory storage (for admin panel)

### Admin Panel
Visit `/admin` to:
- View all assessment data
- Preview personalized emails
- See user segments
- Export data

## 🎯 Personalized Email System

### Email Templates
Located in `src/utils/emailTemplates.ts`:
- **Initial Email**: Personalized based on assessment results
- **Follow-up Emails**: Day 1, Week 1, Month 1 check-ins

### Email Content Includes:
- Personalized learner profile
- Intensity level visualization
- Custom insights based on responses
- Next steps and recommendations
- Motivation-specific messaging

## 🔧 Customization

### Adding New Questions
1. Update `src/data/questions.ts`
2. Add logic to `src/utils/calculator.ts`
3. Update email templates if needed

### Modifying Email Templates
Edit `src/utils/emailTemplates.ts`:
- `generatePersonalizedEmail()`: Initial assessment email
- `generateFollowUpEmail()`: Follow-up sequences

### Styling Changes
- Main styles: `src/styles/globals.css`
- Component styles: Individual `.tsx` files
- Mobile breakpoints: `@media (max-width: 768px)`

## 📈 Analytics & Tracking

### Beehiiv Segments
Users are automatically segmented by:
- **Profile Type**: Immersion Devotee, Survivalist, etc.
- **Language**: Korean, Japanese, Spanish, etc.
- **Intensity Level**: Low (1-3), Medium (4-6), High (7-9)
- **Time Commitment**: Minimal (<60min), Moderate (60-120min), High (>120min)

### Data Export
Assessment data can be exported as JSON for:
- Further analysis
- Import into other systems
- Backup purposes

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
1. Build the project: `npm run build`
2. Start production server: `npm start`
3. Set environment variables on your platform

## 🔒 Security Notes

- API keys are server-side only
- User data is stored locally (consider database for production)
- No sensitive data in client-side code
- HTTPS recommended for production

## 📞 Support

If you need help with:
- Beehiiv API integration
- Email template customization
- Mobile responsiveness issues
- Data management

Check the code comments or reach out for assistance!

## 🎉 What's Working Now

✅ **Mobile Responsive Results Page**
✅ **Working Print Functionality** 
✅ **Working Save Functionality**
✅ **Beehiiv API Integration**
✅ **Email Capture with Custom Fields**
✅ **Data Storage & Management**
✅ **Personalized Email Templates**
✅ **Admin Panel for Data Viewing**
✅ **User Segmentation System**

Your MVP is now fully functional! 🚀
