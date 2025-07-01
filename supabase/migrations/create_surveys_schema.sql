-- Create surveys table
CREATE TABLE IF NOT EXISTS surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create survey_sections table
CREATE TABLE IF NOT EXISTS survey_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  section_order INTEGER NOT NULL,
  path TEXT, -- For conditional routing
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create survey_questions table
CREATE TABLE IF NOT EXISTS survey_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID NOT NULL REFERENCES survey_sections(id) ON DELETE CASCADE,
  question_order INTEGER NOT NULL,
  question TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'textarea', 'radio', 'checkbox', 'select')),
  required BOOLEAN DEFAULT false,
  placeholder TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create survey_question_options table
CREATE TABLE IF NOT EXISTS survey_question_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
  option_order INTEGER NOT NULL,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  path TEXT, -- For conditional routing based on answer
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT, -- For anonymous users
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create survey_answers table
CREATE TABLE IF NOT EXISTS survey_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  response_id UUID NOT NULL REFERENCES survey_responses(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
  answer_text TEXT, -- For text/textarea answers
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create survey_answer_options table (for checkbox multiple selections)
CREATE TABLE IF NOT EXISTS survey_answer_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  answer_id UUID NOT NULL REFERENCES survey_answers(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES survey_question_options(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_survey_sections_survey_id ON survey_sections(survey_id);
CREATE INDEX idx_survey_questions_section_id ON survey_questions(section_id);
CREATE INDEX idx_survey_question_options_question_id ON survey_question_options(question_id);
CREATE INDEX idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX idx_survey_responses_user_id ON survey_responses(user_id);
CREATE INDEX idx_survey_answers_response_id ON survey_answers(response_id);
CREATE INDEX idx_survey_answers_question_id ON survey_answers(question_id);

-- Enable Row Level Security (RLS)
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answer_options ENABLE ROW LEVEL SECURITY;

-- RLS Policies for surveys (everyone can view active surveys)
CREATE POLICY "Active surveys are viewable by everyone" ON surveys
  FOR SELECT USING (status = 'active');

-- RLS Policies for survey structure (viewable if survey is viewable)
CREATE POLICY "Survey sections are viewable if survey is active" ON survey_sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM surveys 
      WHERE surveys.id = survey_sections.survey_id 
      AND surveys.status = 'active'
    )
  );

CREATE POLICY "Survey questions are viewable if survey is active" ON survey_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM survey_sections
      JOIN surveys ON surveys.id = survey_sections.survey_id
      WHERE survey_sections.id = survey_questions.section_id
      AND surveys.status = 'active'
    )
  );

CREATE POLICY "Survey options are viewable if survey is active" ON survey_question_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM survey_questions
      JOIN survey_sections ON survey_sections.id = survey_questions.section_id
      JOIN surveys ON surveys.id = survey_sections.survey_id
      WHERE survey_questions.id = survey_question_options.question_id
      AND surveys.status = 'active'
    )
  );

-- RLS Policies for responses and answers
CREATE POLICY "Users can create their own responses" ON survey_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own responses" ON survey_responses
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create answers for their responses" ON survey_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM survey_responses
      WHERE survey_responses.id = survey_answers.response_id
      AND (survey_responses.user_id = auth.uid() OR survey_responses.user_id IS NULL)
    )
  );

CREATE POLICY "Users can create answer options for their answers" ON survey_answer_options
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM survey_answers
      JOIN survey_responses ON survey_responses.id = survey_answers.response_id
      WHERE survey_answers.id = survey_answer_options.answer_id
      AND (survey_responses.user_id = auth.uid() OR survey_responses.user_id IS NULL)
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language plpgsql;

-- Trigger for updating updated_at
CREATE TRIGGER update_surveys_updated_at BEFORE UPDATE ON surveys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();