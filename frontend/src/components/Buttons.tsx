import styles from "./Buttons.module.scss";

type ButtonProps = {
  onClick: (event: MouseEvent) => void;
  text: string;
  disabled?: boolean;
};

const Button = (props: ButtonProps & { class?: string }) => {
  const handleButtonClick = (e: MouseEvent) => {
    props.onClick(e);
  };

  return (
    <button
      class={`${styles.button} ${props.class || ""} ${
        props.disabled ? styles.disabled : ""
      }`}
      disabled={props.disabled}
      onClick={handleButtonClick}
    >
      {props.text}
    </button>
  );
};

export const AcceptButton = (props: ButtonProps) => {
  return <Button class={styles.acceptButton} {...props} />;
};

export const DenyButton = (props: ButtonProps) => {
  return <Button class={styles.denyButton} {...props} />;
};
