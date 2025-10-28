"use client";

import type { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { Question } from "@/lib/types/survey.types";

type QuestionRendererProps = {
  question: Question;
  form: UseFormReturn<Record<string, string | string[]>>;
};

const FormLabelWrapper = ({ children }: { children: React.ReactNode }) => (
  <FormLabel className="mb-2 text-gray-300">{children}</FormLabel>
);

export function QuestionRenderer({ question, form }: QuestionRendererProps) {
  const renderField = () => {
    switch (question.type) {
      case "text":
        return (
          <FormField
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabelWrapper>
                  {question.question}
                  {question.required && (
                    <span className="ml-1 text-purple-400">*</span>
                  )}
                </FormLabelWrapper>
                <FormControl>
                  <Input
                    placeholder={question.placeholder}
                    {...field}
                    className="border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-500 focus:border-purple-500/50"
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        );

      case "textarea":
        return (
          <FormField
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabelWrapper>
                  {question.question}
                  {question.required && (
                    <span className="ml-1 text-purple-400">*</span>
                  )}
                </FormLabelWrapper>
                <FormControl>
                  <Textarea
                    className="min-h-[100px] border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-500 focus:border-purple-500/50"
                    placeholder={question.placeholder}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        );

      case "radio":
        return (
          <FormField
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabelWrapper>
                  {question.question}
                  {question.required && (
                    <span className="ml-1 text-purple-400">*</span>
                  )}
                </FormLabelWrapper>
                <FormControl>
                  <RadioGroup
                    className="grid grid-cols-2 gap-3"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    {question.options?.map((option) => (
                      <FormItem
                        className="flex items-center space-x-2 space-y-0"
                        key={option.value}
                      >
                        <FormControl>
                          <RadioGroupItem
                            className="border-gray-600 text-purple-500"
                            value={option.value}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal text-gray-300">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        );

      case "checkbox":
        return (
          <FormField
            control={form.control}
            name={question.id}
            render={() => (
              <FormItem>
                <FormLabelWrapper>
                  {question.question}
                  {question.required && (
                    <span className="ml-1 text-purple-400">*</span>
                  )}
                </FormLabelWrapper>
                <div className="grid grid-cols-2 gap-3">
                  {question.options?.map((option) => (
                    <FormField
                      control={form.control}
                      key={option.value}
                      name={question.id}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.value)}
                              className="border-gray-600 data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-500"
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                if (checked) {
                                  field.onChange([
                                    ...currentValue,
                                    option.value,
                                  ]);
                                } else {
                                  field.onChange(
                                    currentValue.filter(
                                      (v: string) => v !== option.value
                                    )
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer font-normal text-gray-300">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        );

      case "select":
        return (
          <FormField
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabelWrapper>
                  {question.question}
                  {question.required && (
                    <span className="ml-1 text-purple-400">*</span>
                  )}
                </FormLabelWrapper>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="w-full border-gray-700 bg-gray-800/50 text-white focus:border-purple-500/50">
                      <SelectValue
                        className="placeholder:text-gray-500"
                        placeholder={question.placeholder || "Select an option"}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    {question.options?.map((option) => (
                      <SelectItem
                        className="text-gray-300 focus:bg-purple-500/20 focus:text-white"
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  return <div className="w-full">{renderField()}</div>;
}
