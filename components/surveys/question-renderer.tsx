'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import type { Question, Option } from '@/lib/types/survey.types';

type QuestionRendererProps = {
  question: Question;
  form: UseFormReturn<any>;
};

export function QuestionRenderer({ question, form }: QuestionRendererProps) {
  const renderQuestion = () => {
    switch (question.type) {
      case 'text':
        return (
          <FormField
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {question.question}
                  {question.required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={question.placeholder}
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'textarea':
        return (
          <FormField
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {question.question}
                  {question.required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={question.placeholder}
                    className="min-h-[100px]"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'radio':
        return (
          <FormField
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {question.question}
                  {question.required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="space-y-2"
                  >
                    {question.options?.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                        <Label 
                          htmlFor={`${question.id}-${option.value}`}
                          className="font-normal cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'checkbox':
        return (
          <FormField
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {question.question}
                  {question.required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {question.options?.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${question.id}-${option.value}`}
                          checked={field.value?.includes(option.value)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            if (checked) {
                              field.onChange([...currentValue, option.value]);
                            } else {
                              field.onChange(currentValue.filter((v: string) => v !== option.value));
                            }
                          }}
                        />
                        <Label
                          htmlFor={`${question.id}-${option.value}`}
                          className="font-normal cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'select':
        return (
          <FormField
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {question.question}
                  {question.required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={question.placeholder || 'Select an option'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {question.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  return <div className="w-full">{renderQuestion()}</div>;
}