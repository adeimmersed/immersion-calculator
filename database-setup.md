# Database Setup Guide

## Option 1: Supabase (Recommended - Free & Easy)

### 1. Create Supabase Account
- Go to https://supabase.com
- Sign up for free account
- Create a new project

### 2. Get Your Credentials
- Go to Settings → API
- Copy your:
  - Project URL
  - Anon Key
  - Service Role Key

### 3. Create Database Table
Run this SQL in Supabase SQL Editor:

```sql
-- Create assessments table
CREATE TABLE assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255),
  selected_language VARCHAR(100),
  custom_language VARCHAR(100),
  intensity_level INTEGER,
  learner_profile VARCHAR(100),
  time_commitment VARCHAR(100),
  assessment_date TIMESTAMP DEFAULT NOW(),
  completion_time INTEGER, -- in minutes
  responses JSONB NOT NULL, -- All question responses
  results JSONB NOT NULL, -- Calculated results
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_assessments_email ON assessments(email);
CREATE INDEX idx_assessments_language ON assessments(selected_language);
CREATE INDEX idx_assessments_date ON assessments(created_at);
```

### 4. Update Environment Variables
Add to your `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Option 2: Firebase Firestore

### 1. Create Firebase Project
- Go to https://console.firebase.google.com
- Create new project
- Enable Firestore Database

### 2. Get Credentials
- Go to Project Settings → General
- Add web app
- Copy config

### 3. Update Environment Variables
Add to your `.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Option 3: MongoDB Atlas

### 1. Create MongoDB Account
- Go to https://www.mongodb.com/atlas
- Create free cluster

### 2. Get Connection String
- Go to Database → Connect
- Copy connection string

### 3. Update Environment Variables
Add to your `.env.local`:

```env
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string
```

## Current Data Export

To export your current localStorage data:

```javascript
// Run in browser console
const data = {};
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key.startsWith('assessment_')) {
    data[key] = JSON.parse(localStorage.getItem(key));
  }
}
console.log(JSON.stringify(data, null, 2));
```
