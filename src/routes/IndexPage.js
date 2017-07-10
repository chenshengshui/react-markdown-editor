import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';
import Editor from '../components/Editor/Editor'

function IndexPage() {
  return (
    <div className={styles.normal}>
      <Editor />
    </div>
  );
}
export default connect()(IndexPage);
