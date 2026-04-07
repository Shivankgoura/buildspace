-- BuildSpace Demo Seed Data
-- Run this in the Supabase SQL Editor after creating a few test users via the app

-- Note: You need to first sign up a few users through the app UI,
-- then you can run this script to populate demo data.
-- Replace the UUIDs below with actual user IDs from your auth.users table.

-- Alternatively, use this script as a template after signing up users.

-- Example: After signing up users, get their IDs from the profiles table:
-- SELECT user_id, full_name, username FROM profiles;

-- Then create sample projects:
-- INSERT INTO projects (owner_id, title, description, tech_stack, status, max_members)
-- VALUES
--   ('<user_id_1>', 'EcoTrack - Carbon Footprint Calculator', 'A web app that helps users track and reduce their carbon footprint through daily activity logging and actionable suggestions.', ARRAY['React', 'Node.js', 'PostgreSQL', 'TailwindCSS'], 'open', 5),
--   ('<user_id_1>', 'StudyBuddy - AI Study Assistant', 'An AI-powered study companion that generates flashcards, quizzes, and summaries from uploaded notes and textbooks.', ARRAY['Next.js', 'Python', 'OpenAI', 'Supabase'], 'open', 4),
--   ('<user_id_2>', 'DevConnect - Code Review Platform', 'A platform where developers can submit code for peer review, get feedback, and improve their coding skills together.', ARRAY['TypeScript', 'React', 'Express', 'MongoDB'], 'in-progress', 6),
--   ('<user_id_2>', 'HealthPulse - Fitness Tracker', 'A comprehensive fitness tracking app with workout plans, nutrition logging, and progress visualization.', ARRAY['React Native', 'Firebase', 'Node.js'], 'open', 3),
--   ('<user_id_1>', 'CodeQuest - Gamified Learning', 'Learn programming through interactive quests, challenges, and multiplayer coding battles.', ARRAY['Vue.js', 'Django', 'PostgreSQL', 'Redis'], 'open', 5);

-- Sample opportunities:
-- INSERT INTO opportunities (author_id, title, description, type, skills_needed, status)
-- VALUES
--   ('<user_id_1>', 'Looking for React developers for EcoTrack', 'We need 2 React developers to help build the dashboard and data visualization components for our carbon footprint tracker.', 'teammate', ARRAY['React', 'TailwindCSS', 'Chart.js'], 'open'),
--   ('<user_id_2>', 'Frontend Developer for Hackathon Team', 'Building a social impact app for the upcoming SDC Hackathon. Need someone experienced with Next.js and responsive design.', 'hackathon', ARRAY['Next.js', 'TypeScript', 'TailwindCSS'], 'open'),
--   ('<user_id_1>', 'Backend Engineer for StudyBuddy', 'Looking for a backend engineer to help integrate AI features and build the API layer for our study assistant app.', 'hiring', ARRAY['Python', 'FastAPI', 'OpenAI', 'PostgreSQL'], 'open'),
--   ('<user_id_2>', 'Mobile Developer Wanted', 'Need a React Native developer to help port our web app to mobile platforms.', 'teammate', ARRAY['React Native', 'TypeScript', 'Firebase'], 'open'),
--   ('<user_id_1>', 'UI/UX Designer for DevConnect', 'Looking for a designer who can create beautiful, intuitive interfaces for our code review platform.', 'teammate', ARRAY['Figma', 'UI/UX Design', 'TailwindCSS'], 'open');
