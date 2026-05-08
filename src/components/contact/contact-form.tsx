'use client';

import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AlertCircle, Loader2, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { contactFormSchema, type ContactFormValues } from '@/lib/schemas';
import {
  sendContactEmail,
  type ContactActionState,
} from '@/app/contact/actions';
import { siteConfig } from '@/config/site';

const FORM_ID = 'contact-form-rhf';
const MESSAGE_MAX = 5000;

/**
 * Builds a `mailto:` URL that preserves what the user typed — used as the
 * graceful fallback when the Resend API is down. Better than losing their
 * words to a generic error.
 */
function buildMailtoFallback(values: ContactFormValues): string {
  const subject = `Portfolio contact from ${values.name}`;
  const body = `${values.message}\n\n— ${values.name} (${values.email})`;
  return `mailto:${siteConfig.author.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [serverState, setServerState] = useState<ContactActionState>({
    status: 'idle',
  });

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      hp_field: '', // honeypot — must stay empty
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    // Pack into FormData so the Server Action receives a standard payload —
    // matches the shape it would get from a no-JS native <form action> too.
    const fd = new FormData();
    fd.set('name', data.name);
    fd.set('email', data.email);
    fd.set('message', data.message);
    fd.set('hp_field', data.hp_field ?? '');

    startTransition(async () => {
      const result = await sendContactEmail({ status: 'idle' }, fd);
      setServerState(result);

      if (result.status === 'invalid') {
        // Map server-side zod errors back into RHF so per-field messages
        // render below each input, identically to client-side validation.
        for (const [field, msg] of Object.entries(result.fieldErrors)) {
          form.setError(field as 'name' | 'email' | 'message', {
            message: msg,
          });
        }
        toast.error('Please fix the highlighted fields.');
      } else if (
        result.status === 'error' ||
        result.status === 'service_unavailable'
      ) {
        toast.error(result.message);
      } else if (result.status === 'success') {
        toast.success("Mail received — I'll be in touch.");
        form.reset();
        setServerState({ status: 'idle' });
      }
    });
  };

  /**
   * Surfaces RHF's silent validation failures as a toast — without this,
   * a click on Send when (e.g.) the message is < 10 chars just renders an
   * inline error and the rest of the page looks frozen, which feels broken.
   */
  const onValidationError = (errors: Record<string, { message?: string }>) => {
    const first = Object.values(errors)[0]?.message;
    toast.error(first ?? 'Please fix the highlighted fields.');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Send a message</CardTitle>
        <CardDescription>
          Goes straight to my inbox. I&apos;ll only use your email to reply.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id={FORM_ID}
          onSubmit={form.handleSubmit(onSubmit, onValidationError)}
          noValidate
        >
          <fieldset disabled={isPending} className="contents">
            {/* Honeypot — bots that auto-fill all text fields will trip it.
                `display:none` keeps Chrome's autofill from helpfully
                writing the user's URL into it (which would be a false
                positive). `readOnly` is a second guard against autofill
                in browsers that ignore display:none for autofill. The
                non-semantic field name (`hp_field`) avoids matching any
                browser autocomplete heuristic. */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              readOnly
              style={{ display: 'none' }}
              {...form.register('hp_field')}
            />

            <FieldGroup>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${FORM_ID}-name`}>Name</FieldLabel>
                      <Input
                        {...field}
                        id={`${FORM_ID}-name`}
                        placeholder="Your name"
                        autoComplete="name"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${FORM_ID}-email`}>
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id={`${FORM_ID}-email`}
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="message"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${FORM_ID}-message`}>
                      Message
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id={`${FORM_ID}-message`}
                        placeholder="Career opportunities, questions about a project, or just a hello — all welcome."
                        rows={6}
                        maxLength={MESSAGE_MAX}
                        className="min-h-32 resize-none"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field.value.length}/{MESSAGE_MAX}
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldDescription>
                      The more context the faster I can reply — links, repos,
                      timeline are all helpful.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Service-unavailable inline alert — preserves the user's typed
                  message in the mailto fallback so they don't lose their words. */}
              {serverState.status === 'service_unavailable' && (
                <div
                  role="alert"
                  className="flex flex-col gap-3 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm sm:flex-row sm:items-start"
                >
                  <AlertCircle
                    aria-hidden="true"
                    className="size-4 shrink-0 text-destructive"
                  />
                  <div className="flex flex-1 flex-col gap-2">
                    <p className="text-foreground">{serverState.message}</p>
                    <a
                      href={buildMailtoFallback(form.getValues())}
                      className="inline-flex w-fit items-center gap-2 text-xs font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
                    >
                      Open in mail client instead
                    </a>
                  </div>
                </div>
              )}
            </FieldGroup>
          </fieldset>
        </form>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => {
            form.reset();
            setServerState({ status: 'idle' });
          }}
        >
          Reset
        </Button>
        <Button
          type="submit"
          form={FORM_ID}
          size="sm"
          disabled={isPending}
          className="hover:cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Sending…</span>
            </>
          ) : (
            <>
              <span>Send message</span>
              <Send className="size-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
