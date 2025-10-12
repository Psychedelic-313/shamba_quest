-- Seed badges
INSERT INTO public.badges (name, description, icon, xp_requirement) VALUES
  ('Seedling', 'Complete your first quiz', '🌱', 0),
  ('Sprout', 'Earn 50 XP', '🌿', 50),
  ('Growing Strong', 'Earn 100 XP', '🌾', 100),
  ('Climate Champion', 'Earn 250 XP', '🌍', 250),
  ('Farming Expert', 'Earn 500 XP', '🏆', 500)
ON CONFLICT (name) DO NOTHING;

-- Seed quiz questions
INSERT INTO public.quiz_questions (question, correct_answer, difficulty, category, xp_reward) VALUES
  ('What is climate-smart agriculture?', 'Farming practices that increase productivity while adapting to climate change and reducing greenhouse gas emissions', 'beginner', 'Climate Basics', 10),
  ('Which crop rotation practice helps improve soil health?', 'Alternating legumes with cereals to fix nitrogen in the soil', 'beginner', 'Soil Management', 10),
  ('What is the main benefit of mulching in farming?', 'Retains soil moisture and reduces evaporation', 'beginner', 'Water Conservation', 10),
  ('How does agroforestry help combat climate change?', 'Trees sequester carbon dioxide and provide shade for crops', 'intermediate', 'Climate Adaptation', 15),
  ('What is the purpose of contour farming?', 'Reduces soil erosion by plowing along the contour lines of slopes', 'intermediate', 'Soil Conservation', 15),
  ('Which indigenous Kenyan crop is drought-resistant?', 'Sorghum and millet are traditional drought-resistant crops', 'intermediate', 'Crop Selection', 15),
  ('Explain the concept of integrated pest management (IPM)', 'A holistic approach combining biological, cultural, and chemical methods to control pests sustainably', 'advanced', 'Pest Management', 20),
  ('How can farmers use weather forecasting for climate adaptation?', 'Plan planting and harvesting schedules based on predicted rainfall patterns', 'advanced', 'Climate Technology', 20),
  ('What role do cover crops play in sustainable agriculture?', 'Prevent soil erosion, improve soil fertility, and suppress weeds', 'advanced', 'Sustainable Practices', 20)
ON CONFLICT DO NOTHING;
 