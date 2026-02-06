"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createActivity, verifyActivitiesAdminPassword } from "@/app/(main)/activities/activity-admin-actions";

type FormState = {
  title: string;
  date: string;
  time: string;
  location: string;
  shortDescription: string;
  description: string;
  lumaUrl: string;
};

function isEditableTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;

  const tag = target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;

  if (target.isContentEditable) return true;

  return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
}

function isShortcut(e: KeyboardEvent): boolean {
  const isMac = navigator.platform.toLowerCase().includes("mac");
  const key = e.key;
  const isSlash = key === "/" || key === "?";
  if (!isSlash) return false;

  return isMac
    ? e.metaKey && e.shiftKey && !e.altKey
    : e.ctrlKey && e.shiftKey && !e.altKey;
}

export function ActivityAdminCreateDialog() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);

  const emptyForm = useMemo<FormState>(
    () => ({
      title: "",
      date: "",
      time: "",
      location: "",
      shortDescription: "",
      description: "",
      lumaUrl: "",
    }),
    [],
  );

  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;
      if (!isShortcut(e)) return;

      e.preventDefault();
      setOpen(true);
      setUnlocked(false);
      setBusy(false);
      setPassword("");
      setForm(emptyForm);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [emptyForm]);

  useEffect(() => {
    if (open && !unlocked) {
      setTimeout(() => passwordRef.current?.focus(), 0);
    }
  }, [open, unlocked]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setUnlocked(false);
      setBusy(false);
      setPassword("");
      setForm(emptyForm);
    }
  };

  const handleUnlock = async () => {
    if (busy) return;
    setBusy(true);

    try {
      const ok = await verifyActivitiesAdminPassword(password);
      if (!ok) {
        toast.error("Wrong password.");
        setUnlocked(false);
        return;
      }

      setUnlocked(true);
      toast.success("Unlocked.");
    } finally {
      setBusy(false);
    }
  };

  const handleCreate = async () => {
    if (busy) return;
    setBusy(true);

    try {
      const result = await createActivity(
        {
          title: form.title,
          date: form.date,
          time: form.time,
          location: form.location,
          shortDescription: form.shortDescription,
          description: form.description,
          lumaUrl: form.lumaUrl,
        },
        password,
      );

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success("Activity created.");
      handleOpenChange(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-semibold">
            Create activity
          </DialogTitle>
        </DialogHeader>

        {!unlocked ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activity-admin-password">Password</Label>
              <Input
                ref={passwordRef}
                id="activity-admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password to unlock"
                autoComplete="current-password"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => handleOpenChange(false)} disabled={busy}>
                Cancel
              </Button>
              <Button onClick={handleUnlock} disabled={busy || password.trim().length === 0}>
                Unlock
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="activity-title">Title</Label>
                <Input
                  id="activity-title"
                  value={form.title}
                  onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                  placeholder="Event title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-date">Date</Label>
                <Input
                  id="activity-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-time">Time (optional)</Label>
                <Input
                  id="activity-time"
                  value={form.time}
                  onChange={(e) => setForm((s) => ({ ...s, time: e.target.value }))}
                  placeholder='e.g. "6:30 PM"'
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="activity-location">Location (optional)</Label>
                <Input
                  id="activity-location"
                  value={form.location}
                  onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
                  placeholder="e.g. Miami, FL"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="activity-short-description">Short description (optional)</Label>
                <Input
                  id="activity-short-description"
                  value={form.shortDescription}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, shortDescription: e.target.value }))
                  }
                  placeholder="One-liner shown in lists"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="activity-description">Description</Label>
                <Textarea
                  id="activity-description"
                  value={form.description}
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                  placeholder="Full event details"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="activity-luma-url">Luma URL (optional)</Label>
                <Input
                  id="activity-luma-url"
                  value={form.lumaUrl}
                  onChange={(e) => setForm((s) => ({ ...s, lumaUrl: e.target.value }))}
                  placeholder="https://lu.ma/..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => handleOpenChange(false)} disabled={busy}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={
                  busy ||
                  form.title.trim().length === 0 ||
                  form.date.trim().length === 0 ||
                  form.description.trim().length === 0
                }
              >
                Create activity
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

