import { useEffect, useState } from "react";

import TuImage from "@/public/Tu.jpg";
import { ErrorWrap } from "@/utils/Error";
import axios from "axios";

import { ActionKey, Message } from "../page";

type Props = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;

  currentActionKey: ActionKey | null;
  setCurrentActionKey: React.Dispatch<React.SetStateAction<ActionKey | null>>;
};

const DecisionMaker = (props: Props) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (props.currentActionKey === ActionKey.QUERY_AWESOME_APPLICANT) {
      props.setMessages([
        ...props.messages,
        {
          person: "Earth-2's Tu",
          text: "Please click on my picture to proceed.",

          actions: [{ key: ActionKey.TU_IMAGE, text: "", imageData: TuImage }],
        },
      ]);
    }
    //
    else if (props.currentActionKey === ActionKey.TU_IMAGE) {
      axios({
        method: "get",
        url: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/awesome/applicant`,
      })
        .then((userData) => {
          const { user } = userData.data;

          setUserId(user.id);

          props.setMessages([
            ...props.messages,
            {
              person: "Earth-2's Tu",
              text: "Here is your result.",

              quoteBlock: JSON.stringify(user, undefined, 2),

              actions: [{ key: ActionKey.UPDATE_EMAIL, text: "Update email" }],
            },
          ]);
        })
        .catch((err) => {
          console.error(ErrorWrap(err));
        });
    }
    //
    else if (props.currentActionKey === ActionKey.UPDATE_EMAIL) {
      props.setMessages([
        ...props.messages,
        {
          person: "Earth-2's Tu",
          text: "Please input a new email.",

          inputBlock: {
            placeholder: "new_email@gmail.com",
          },

          actions: [
            {
              key: ActionKey.CONFIRM_EMAIL,
              text: "Confirm",
              onAction: (input: string) => {
                return axios({
                  method: "post",
                  url: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/awesome/applicant/update`,
                  data: {
                    id: userId,
                    newEmail: input,
                  },
                });
              },
            },
          ],
        },
      ]);
    }
    //
    else if (props.currentActionKey === ActionKey.CONFIRM_EMAIL) {
      axios({
        method: "get",
        url: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/awesome/applicant`,
        params: {
          userId,
        },
      })
        .then((userData) => {
          const { user } = userData.data;

          props.setMessages([
            ...props.messages,
            {
              person: "Earth-2's Tu",
              text: "Here is the updated data.",

              quoteBlock: JSON.stringify(user, undefined, 2),

              actions: [{ key: ActionKey.UPDATE_EMAIL, text: "Update email" }],
            },
          ]);
        })
        .catch((err) => {
          console.error(ErrorWrap(err));
        });
    }

    // Reset
    if (props.currentActionKey) {
      props.setCurrentActionKey(null);
    }
  }, [props.currentActionKey]);

  return null;
};

export default DecisionMaker;
