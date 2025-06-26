import styles from "~/styles/ProgressBar.module.css";

export default function ProgressBar({ value }: { value: number }) {
  return (
    <div className={styles.progressBar}>
      <div
        className={styles.progress}
        style={{ width: `${Math.min(value, 100)}%` }}
      ></div>
    </div>
  );
}
