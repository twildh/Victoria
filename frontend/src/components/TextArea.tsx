import { JSX } from "solid-js";
import styles from "./TextArea.module.scss";

type TextAreaProps = {
  value?: string;
  readonly?: boolean;
  onInput?: JSX.EventHandler<HTMLTextAreaElement, Event>;
};

export const TextArea = (props: TextAreaProps) => {
  return <textarea class={styles.textarea} {...props} />;
};
