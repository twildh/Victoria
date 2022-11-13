import styles from "./Banner.module.css";
export enum BannerType {
  ERROR = "error",
  INFO = "info",
}

export const Banner = (props: { type?: BannerType; text: string }) => {
  return (
    <div
      class={`${styles.banner} ${
        props.type === BannerType.ERROR ? styles.error : styles.info
      }`}
    >
      {props.text}
    </div>
  );
};
