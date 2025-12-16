"use client";

import React, { createContext, useContext } from "react";

type Messages = Record<string, string>;

type Translate = (key: string, vars?: Record<string, string | number>) => string;

const defaultMessages: Messages = {
  "student.dashboard.firstActivityModal.title": "Welcome to Chapter {chapterNumber}",
  "student.dashboard.firstActivityModal.subtitle": "You’re about to start: {activityTitle}",
  "student.dashboard.firstActivityModal.descriptionFallback":
    "Here’s what to expect in this chapter.",
  "student.dashboard.firstActivityModal.startButton": "Start activity",
  "student.dashboard.firstActivityModal.closeButton": "Not now",
};

const I18nContext = createContext<{ t: Translate }>({
  t: (key) => key,
});

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name) =>
    vars[name] === undefined ? `{${name}}` : String(vars[name])
  );
}

export function I18nProvider({
  children,
  messages = defaultMessages,
}: {
  children: React.ReactNode;
  messages?: Messages;
}) {
  const t: Translate = (key, vars) => interpolate(messages[key] ?? key, vars);
  return <I18nContext.Provider value={{ t }}>{children}</I18nContext.Provider>;
}

export function useT() {
  return useContext(I18nContext).t;
}


