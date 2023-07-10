"use client";

import React from "react";
import { useEffect, useState } from "react";

import { ActionKey, Message } from "@/app/page";
import { ErrorWrap } from "@/utils/Error";
import { Fade } from "@mui/material";
import clsx from "clsx";
import jQuery from "jquery";
import Image from "next/image";
import Typewriter from "typewriter-effect";

import styles from "./Basic.module.scss";

type Props = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;

  messageIdx: number;
  onDone: (actionKey?: ActionKey) => void;
};

const Basic = (props: Props) => {
  const [fadeIn, setFadeIn] = useState(false);

  const [showQuoteBlock, setShowQuoteBlock] = useState(false);

  const [showInput, setShowInput] = useState(false);
  const [inputString, setInputString] = useState("");

  const [showActions, setShowActions] = useState(false);
  const [chosenAction, setChosenAction] = useState<ActionKey | null>(null);

  // Show message after a delay
  useEffect(() => {
    let timeout = -1;

    if (props.messages[props.messageIdx].pauseFor) {
      timeout = window.setTimeout(() => {
        setFadeIn(true);
      }, props.messages[props.messageIdx].pauseFor);
    } else {
      setFadeIn(true);
    }

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  // Effect for after showing quote block
  useEffect(() => {
    if (showQuoteBlock) {
      if (props.messages[props.messageIdx].actions) {
        const timeout = window.setTimeout(() => {
          setShowActions(true);
        }, 200);

        return () => {
          window.clearTimeout(timeout);
        };
      }

      props.onDone();
    }
  }, [showQuoteBlock]);

  // Effect for after choosing an action
  useEffect(() => {
    if (chosenAction) {
      if (chosenAction === ActionKey.CONFIRM_EMAIL) {
        const action = props.messages[props.messageIdx].actions?.find(
          (val) => val.key === ActionKey.CONFIRM_EMAIL
        );

        Promise.resolve()
          .then(() => {
            if (action?.onAction) {
              return action.onAction(inputString);
            }
          })
          .then(() => {
            props.onDone(chosenAction);
          })
          .catch((err) => {
            console.error(ErrorWrap(err));

            props.setMessages([
              ...props.messages,
              {
                ...props.messages[props.messageIdx],
                person: "Earth-2's Tu",
                text: "Oops! Something went wrong. Please try again.",
              },
            ]);
          });

        return;
      }

      props.onDone(chosenAction);
    }
  }, [chosenAction]);

  return (
    <Fade in={fadeIn}>
      <div className={styles.root}>
        <div
          className={clsx(styles.person, {
            [styles.secondary]:
              props.messages[props.messageIdx].person === "Me",
          })}
        >
          {props.messages[props.messageIdx].person}
        </div>

        <Typewriter
          options={{
            wrapperClassName: styles.typewriterWrapper,
          }}
          onInit={(typewriter) => {
            const pauseFor = props.messages[props.messageIdx].pauseFor;

            if (pauseFor) {
              typewriter.pauseFor(pauseFor + 1000);
            }

            typewriter
              .changeDelay(30)
              .typeString(props.messages[props.messageIdx].text)
              .pauseFor(1500)
              .callFunction(function hideCursor() {
                jQuery(".Typewriter__cursor").css({
                  animation: "unset",
                  opacity: 0,
                  transition: "opacity 200ms, animation 200ms",
                });
              })
              .pauseFor(200)
              .callFunction(function onDone() {
                if (props.messages[props.messageIdx].quoteBlock) {
                  return setShowQuoteBlock(true);
                }

                if (props.messages[props.messageIdx].inputBlock) {
                  setShowInput(true);
                  setShowActions(true);
                  return;
                }

                if (props.messages[props.messageIdx].actions) {
                  return setShowActions(true);
                }

                props.onDone();
              })
              .start();
          }}
        />

        {/* Quote Block */}
        <Fade
          in={
            showQuoteBlock &&
            props.messages[props.messageIdx].quoteBlock !== undefined
          }
        >
          <div
            className={clsx(styles.quoteBlock, {
              [styles.hidden]: !showQuoteBlock,
            })}
          >
            <pre>{props.messages[props.messageIdx].quoteBlock}</pre>
          </div>
        </Fade>

        {/* Input Block */}
        <Fade in={showInput}>
          <div
            className={clsx(styles.inputBlock, {
              [styles.hidden]: !showInput,
            })}
          >
            <input
              placeholder={
                props.messages[props.messageIdx].inputBlock?.placeholder
              }
              onChange={(event) => {
                setInputString(event.target.value);
              }}
            />
          </div>
        </Fade>

        {/* Actions Block */}
        <Fade
          in={
            showActions &&
            props.messages[props.messageIdx].actions !== undefined
          }
        >
          <div
            className={clsx(styles.actions, {
              [styles.hidden]: !showActions,
            })}
          >
            {props.messages[props.messageIdx].actions?.map((action, index) => (
              <React.Fragment key={index}>
                {action.key === ActionKey.TU_IMAGE && action.imageData && (
                  <Image
                    src={action.imageData.src}
                    alt={action.key}
                    className={styles.imageChip}
                    width={action.imageData.width}
                    height={action.imageData.height}
                    onClick={() => {
                      if (chosenAction !== null) {
                        return;
                      }
                      setChosenAction(action.key);
                    }}
                  />
                )}

                {action.key !== ActionKey.TU_IMAGE && (
                  <div
                    key={index}
                    className={clsx(styles.chip, {
                      [styles.chosen]: chosenAction === action.key,
                    })}
                    onClick={() => {
                      if (chosenAction !== null) {
                        return;
                      }
                      setChosenAction(action.key);
                    }}
                  >
                    {action.text}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </Fade>
      </div>
    </Fade>
  );
};

export default Basic;
