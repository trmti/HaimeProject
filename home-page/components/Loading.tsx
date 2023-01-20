import React from 'react';
import styles from '../styles/components/Loading.module.css';

function Loading() {
  return (
    <div className={styles.lds_ellipsis}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
export default Loading;
