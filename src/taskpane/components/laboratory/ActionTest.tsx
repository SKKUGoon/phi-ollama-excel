/* eslint-disable no-undef */
import * as React from "react";
import { Button, tokens, makeStyles } from "@fluentui/react-components";
import { useAppDispatch } from "../../redux/store/hook";
import { focusSheet } from "../../redux/store/model/modelMethodSheet";

const useStyles = makeStyles({
  instructions: {
    fontWeight: tokens.fontWeightSemibold,
    marginTop: "20px",
    marginBottom: "10px",
  },
  textPromptAndInsertion: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textAreaField: {
    marginLeft: "20px",
    marginTop: "30px",
    marginBottom: "20px",
    marginRight: "20px",
    maxWidth: "50%",
  },
});

const ActionTest: React.FC = () => {
  const dispatch = useAppDispatch();

  const actions = async () => {
    await Excel.run(async (context) => {
      try {
        console.log(`Action init`);
        await dispatch(focusSheet({ context: context, name: "Some", address: "A1" }));
        console.log(`Action successfully ended`);
      } catch (err) {
        console.error(err);
      }
    });
  };

  const styles = useStyles();

  return (
    <div className={styles.textPromptAndInsertion}>
      <Button appearance="primary" disabled={false} size="medium" onClick={actions}>
        Action Test
      </Button>
    </div>
  );
};

export default ActionTest;
