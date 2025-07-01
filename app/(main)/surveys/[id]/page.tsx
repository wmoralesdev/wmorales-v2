import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

// Mock data for now
const mockSurveyData = {
  id: '1',
  title: 'Developer Experience Survey',
  description: 'Help us understand your development workflow and preferences',
  totalResponses: 142,
  questions: [
    {
      id: '1',
      question: 'Are you a developer or investor?',
      type: 'radio',
      responses: [
        { label: 'Developer', value: 'developer', count: 89, percentage: 62.7 },
        { label: 'Investor', value: 'investor', count: 53, percentage: 37.3 },
      ],
    },
    {
      id: '2',
      question: 'What is your favorite programming language?',
      type: 'text',
      topResponses: [
        { value: 'TypeScript', count: 45 },
        { value: 'JavaScript', count: 32 },
        { value: 'Python', count: 28 },
        { value: 'Go', count: 15 },
        { value: 'Rust', count: 12 },
      ],
    },
  ],
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

export default async function SurveyResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // For now using mock data
  const survey = mockSurveyData;

  if (!survey) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{survey.title}</h1>
        <p className="text-muted-foreground">{survey.description}</p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="font-semibold">Total Responses:</span>
          <span className="text-2xl font-bold text-primary">{survey.totalResponses}</span>
        </div>
      </div>

      <div className="grid gap-6">
        {survey.questions.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-xl">{question.question}</CardTitle>
              <CardDescription>Question type: {question.type}</CardDescription>
            </CardHeader>
            <CardContent>
              {question.type === 'radio' && question.responses && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {question.responses.map((response) => (
                      <div key={response.value} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{response.label}</span>
                          <span className="font-medium">{response.count} ({response.percentage}%)</span>
                        </div>
                        <Progress value={response.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                  <div className="h-64 mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={question.responses}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ label, percentage }) => `${label}: ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {question.responses.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {question.type === 'text' && question.topResponses && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Top 5 responses</p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={question.topResponses}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="value" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}