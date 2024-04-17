import { Button } from "react-bootstrap";
import styles from "./pagination.module.scss";

export const Pagination = ({
  pageNumbers,
  paginate,
  currentPage,
  prevPage,
  nextPage,
  prevPageList,
  nextPageList,
}: {
  pageNumbers: number[];
  paginate: (number: number) => void;
  currentPage: number;
  prevPage: () => void;
  nextPage: () => void;
  prevPageList: () => void;
  nextPageList: () => void;
}) => {
  return (
    <div className={styles.flex}>
      <Button className={styles.button} onClick={prevPageList}>
        {"<<"}
      </Button>

      <Button className={styles.button} onClick={prevPage}>
        {"<"}
      </Button>

      <ul className={styles.pagination}>
        {!!pageNumbers.length &&
          pageNumbers.map((number) => (
            <li
              className={`${styles.item} ${currentPage === number ? styles.active : ""}`}
              key={number}
              onClick={() => paginate(number)}
            >
              <div>{number}</div>
            </li>
          ))}
      </ul>

      <Button className={styles.button} onClick={nextPage}>
        {">"}
      </Button>

      <Button className={styles.button} onClick={nextPageList}>
        {">>"}
      </Button>
    </div>
  );
};
