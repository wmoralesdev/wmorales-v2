"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MonoText } from "@/components/ui/mono-text";
import { OpenWithCursorButton } from "@/components/ui/open-with-cursor-button";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  title: z.string().trim().min(1, "Title is required").max(80),
  prompt: z.string().trim().min(1, "Prompt is required").max(5000),
  includeContext: z.boolean().default(true),
});

type Values = z.infer<typeof schema>;

function FormExample({
  strings,
}: {
  strings: {
    titleLabel: string;
    titlePlaceholder: string;
    promptLabel: string;
    promptPlaceholder: string;
    includeContextLabel: string;
    includeContextDescription: string;
    submit: string;
    submitted: string;
    helper: string;
  };
}) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "Refactor this component",
      prompt:
        "Improve readability and reduce duplication. Keep behavior the same.\n\nConstraints:\n- TypeScript\n- Keep CSS-only animations subtle\n- Respect prefers-reduced-motion",
      includeContext: true,
    },
    mode: "onChange",
  });

  const title = form.watch("title");
  const prompt = form.watch("prompt");
  const includeContext = form.watch("includeContext");

  const composedPrompt = includeContext ? `${title}\n\n${prompt}` : prompt;

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(() => {
          toast.success(strings.submitted);
        })}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{strings.titleLabel}</FormLabel>
                <FormControl>
                  <Input placeholder={strings.titlePlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="includeContext"
            render={({ field }) => (
              <FormItem className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(Boolean(v))}
                    aria-label={strings.includeContextLabel}
                  />
                </FormControl>
                <div className="grid gap-1">
                  <FormLabel className="leading-none">
                    {strings.includeContextLabel}
                  </FormLabel>
                  <FormDescription className="text-xs">
                    {strings.includeContextDescription}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{strings.promptLabel}</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-40 font-mono"
                  placeholder={strings.promptPlaceholder}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {strings.helper} <MonoText>{'font-mono'}</MonoText>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" size="sm">
            {strings.submit}
          </Button>
          <CopyButton value={composedPrompt} />
          <OpenWithCursorButton title={title} prompt={prompt}>
            Open with Cursor
          </OpenWithCursorButton>
        </div>
      </form>
    </Form>
  );
}

export { FormExample };
