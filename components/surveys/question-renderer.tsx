'use client';

import type { UseFormReturn } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import type { Option, Question } from '@/lib/types/survey.types';

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
                  {question.required && <span className="ml-1 text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <Input placeholder={question.placeholder} {...field} value={field.value || ''} />
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
                  {question.required && <span className="ml-1 text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-[100px]"
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

      case 'radio':
        return (
          <FormField
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {question.question}
                  {question.required && <span className="ml-1 text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <RadioGroup className="space-y-2" defaultValue={field.value} onValueChange={field.onChange}>
                    {question.options?.map((option) => (
                      <div className="flex items-center space-x-2" key={option.value}>
                        <RadioGroupItem id={`${question.id}-${option.value}`} value={option.value} />
                        <Label className="cursor-pointer font-normal" htmlFor={`${question.id}-${option.value}`}>
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
                  {question.required && <span className="ml-1 text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {question.options?.map((option) => (
                      <div className="flex items-center space-x-2" key={option.value}>
                        <Checkbox
                          checked={field.value?.includes(option.value)}
                          id={`${question.id}-${option.value}`}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            if (checked) {
                              field.onChange([...currentValue, option.value]);
                            } else {
                              field.onChange(currentValue.filter((v: string) => v !== option.value));
                            }
                          }}
                        />
                        <Label className="cursor-pointer font-normal" htmlFor={`${question.id}-${option.value}`}>
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
                  {question.required && <span className="ml-1 text-destructive">*</span>}
                </FormLabel>
                <Select defaultValue={field.value} onValueChange={field.onChange}>
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
