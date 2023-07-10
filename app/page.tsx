"use client";

import React, { useState } from "react";

import { StaticImageData } from "next/image";

import DecisionMaker from "./components/DecisionMaker";
import Basic from "./components/Messages/Basic";

import styles from "./page.module.scss";

export enum ActionKey {
  QUERY_AWESOME_APPLICANT = "query-awesome-applicant",
  TU_IMAGE = "tu-image",

  UPDATE_EMAIL = "update-email",
  CONFIRM_EMAIL = "confirm-email",
}

export type Action = {
  key: ActionKey;
  text: string;
  imageData?: StaticImageData;
  onAction?: (input: string) => void | Promise<void>;
};

export type Message = {
  person: "Earth-2's Tu" | "Me";
  text: string;
  pauseFor?: number; // miliseconds

  quoteBlock?: string;

  inputBlock?: {
    placeholder: string;
  };

  actions?: Action[];
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      person: "Earth-2's Tu",
      text:
        // eslint-disable-next-line quotes
        'Hi there! Welcome to the <b style="font-weight: 600;">World Tree</b>. I\'m an <b style="font-weight: 600;">Officer</b> here. What can I help you with?',
      pauseFor: 1200,
      actions: [
        {
          key: ActionKey.QUERY_AWESOME_APPLICANT,
          text: "Query /awesome/applicant",
        },
      ],
    },
  ]);

  const [currentActionKey, setCurrentActionKey] = useState<ActionKey | null>(
    null
  );

  return (
    <main className={styles.main}>
      <DecisionMaker
        messages={messages}
        setMessages={setMessages}
        currentActionKey={currentActionKey}
        setCurrentActionKey={setCurrentActionKey}
      />

      <div className={styles.content}>
        {messages.map((_, index) => (
          <Basic
            key={index}
            messages={messages}
            setMessages={setMessages}
            messageIdx={index}
            onDone={(actionKey) => {
              setCurrentActionKey(actionKey ?? null);
            }}
          />
        ))}
      </div>
    </main>
  );
}
