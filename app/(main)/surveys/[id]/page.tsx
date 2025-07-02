import { notFound } from 'next/navigation';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getSurveyResults, getSurveyWithSections } from '@/app/actions/survey.actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

export default async function SurveyResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: survey, error: surveyError } = await getSurveyWithSections(id);
  const { data: results, error: resultsError } = await getSurveyResults(id);

  if (surveyError || !survey) {
    notFound();
  }

  const totalResponses = results?.totalResponses || 0;

  // Process results for display
  const processedResults =
    results?.questionStats?.map(([questionId, stats]: [string, any]) => {
      const question = stats.question;
      const responses = stats.responses;

      // Count occurrences for each response
      const responseCounts = responses.reduce((acc: Record<string, number>, response: string) => {
        acc[response] = (acc[response] || 0) + 1;
        return acc;
      }, {});

      // Convert to array for charts
      const chartData = Object.entries(responseCounts).map(([value, count]) => ({
        value,
        count,
        percentage: totalResponses > 0 ? (((count as number) / totalResponses) * 100).toFixed(1) : '0',
      }));

      return {
        question,
        type: question.type,
        chartData,
      };
    }) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-4xl">{survey.title}</h1>
        <p className="text-muted-foreground">{survey.description}</p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="font-semibold">Total Responses:</span>
          <span className="font-bold text-2xl text-primary">{totalResponses}</span>
        </div>
      </div>

      {totalResponses === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No responses yet. Share the survey to start collecting data.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {processedResults.map((result: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-xl">{result.question.question}</CardTitle>
                <CardDescription>Question type: {result.type}</CardDescription>
              </CardHeader>
              <CardContent>
                {(result.type === 'radio' || result.type === 'select') && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {result.chartData.map((item: any) => (
                        <div className="space-y-1" key={item.value}>
                          <div className="flex items-center justify-between text-sm">
                            <span>{item.value}</span>
                            <span className="font-medium">
                              {item.count} ({item.percentage}%)
                            </span>
                          </div>
                          <Progress className="h-2" value={Number.parseFloat(item.percentage)} />
                        </div>
                      ))}
                    </div>
                    {result.chartData.length <= 5 && (
                      <div className="mt-6 h-64">
                        <ResponsiveContainer height="100%" width="100%">
                          <PieChart>
                            <Pie
                              cx="50%"
                              cy="50%"
                              data={result.chartData}
                              dataKey="count"
                              fill="#8884d8"
                              label={({ value, percentage }) => `${value}: ${percentage}%`}
                              labelLine={false}
                              outerRadius={80}
                            >
                              {result.chartData.map((entry: any, idx: number) => (
                                <Cell fill={COLORS[idx % COLORS.length]} key={`cell-${idx}`} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                )}

                {(result.type === 'text' || result.type === 'textarea') && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      Top {Math.min(5, result.chartData.length)} responses
                    </p>
                    <div className="h-64">
                      <ResponsiveContainer height="100%" width="100%">
                        <BarChart data={result.chartData.slice(0, 5)}>
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

                {result.type === 'checkbox' && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {result.chartData.map((item: any) => (
                        <div className="space-y-1" key={item.value}>
                          <div className="flex items-center justify-between text-sm">
                            <span>{item.value}</span>
                            <span className="font-medium">{item.count} selections</span>
                          </div>
                          <Progress className="h-2" value={(item.count / totalResponses) * 100} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
