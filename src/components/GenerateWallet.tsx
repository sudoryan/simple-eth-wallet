import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { withStyles, Typography } from "@material-ui/core";

const styles = (theme: any) => ({
  wordBreak: {
    wordBreak: "break-word"
  },
  field: {
    padding: theme.spacing(2)
  },
  bold: {
    fontWeight: "bold"
  }
});

interface Props {
  classes: any;
}
const GenerateWallet = (props: Props) => {
  const { classes } = props;
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  useEffect(() => {
    const wallet = ethers.Wallet.createRandom();
    setAddress(wallet.address);
    setPrivateKey(wallet.privateKey);
  }, []);

  return (
    <div className={classes.wordBreak}>
      <Typography variant="h6" gutterBottom>
        Generated Wallet
      </Typography>
      <Typography className={classes.field}>
        Address: <span className={classes.bold}>{address}</span>
      </Typography>
      <Typography className={classes.field}>
        Private Key: <span className={classes.bold}>{privateKey}</span>
      </Typography>
    </div>
  );
};

export default withStyles(styles as any)(GenerateWallet);
