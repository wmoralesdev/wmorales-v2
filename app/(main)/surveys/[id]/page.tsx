import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getSurveyWithSections, getSurveyResults } from '@/app/actions/survey.actions';
import { notFound } from 'next/navigation';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

export default async function SurveyResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const { data: survey, error: surveyError } = await getSurveyWithSections(id);
  const { data: results, error: resultsError } = await getSurveyResults(id);

  if (surveyError || !survey) {
    notFound();
  }

  const totalResponses = results?.totalResponses || 0;

  // Process results for display
  const processedResults = results?.questionStats?.map(([questionId, stats]: [string, any]) => {
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
      percentage: totalResponses > 0 ? ((count as number) / totalResponses * 100).toFixed(1) : '0',
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
        <h1 className="text-4xl font-bold mb-2">{survey.title}</h1>
        <p className="text-muted-foreground">{survey.description}</p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="font-semibold">Total Responses:</span>
          <span className="text-2xl font-bold text-primary">{totalResponses}</span>
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
                        <div key={item.value} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{item.value}</span>
                            <span className="font-medium">
                              {item.count} ({item.percentage}%)
                            </span>
                          </div>
                          <Progress value={parseFloat(item.percentage)} className="h-2" />
                        </div>
                      ))}
                    </div>
                    {result.chartData.length <= 5 && (
                      <div className="h-64 mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={result.chartData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ value, percentage }) => `${value}: ${percentage}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                            >
                              {result.chartData.map((entry: any, idx: number) => (
                                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
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
                    <p className="text-sm text-muted-foreground">
                      Top {Math.min(5, result.chartData.length)} responses
                    </p>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
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
                        <div key={item.value} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{item.value}</span>
                            <span className="font-medium">
                              {item.count} selections
                            </span>
                          </div>
                          <Progress 
                            value={(item.count / totalResponses) * 100} 
                            className="h-2" 
                          />
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