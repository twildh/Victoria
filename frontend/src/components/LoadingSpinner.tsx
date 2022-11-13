import styles from "./LoadingSpinner.module.css";

export const LoadingSpinner = () => {
  return (
    <div class={styles.spinnerWrapper}>
      <div class={styles.spinner}>
        <div class={styles.spinnerInner}>
          <div class={styles.spinnerInnerInner} />
        </div>
      </div>
    </div>
  );
};
