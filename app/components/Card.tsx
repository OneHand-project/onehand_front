import styles from "~/styles/Card.module.css";

export default function CategoryCard({
  logo,
  name,
}: {
  logo: string;
  name: string;
}) {
  return (
    <>
      <div className={styles.containers}>
        <div className={styles.roundedimg}>
          <img src={logo} alt="logo" width={"60px"} loading="lazy" />
        </div>
        <p>{name}</p>
      </div>
    </>
  );
}
