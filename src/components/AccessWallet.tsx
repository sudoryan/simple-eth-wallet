import React, { useState } from "react";
import { ethers } from "ethers";
import { withStyles, Button, Input, Typography } from "@material-ui/core";

const styles = (theme: any) => ({
  fullWidth: {
    width: "100%"
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  accessWalletContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginTop: theme.spacing(2),
    justifyContent: "space-between",
    maxWidth: "27em"
  },
  field: {
    margin: `${theme.spacing(2)}px 0`
  },
  bold: {
    fontWeight: "bold"
  }
});

interface Props {
  classes: any;
  onComplete: (wallet: ethers.Wallet) => void;
}

const AccessWallet = (props: Props) => {
  const { classes } = props;
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleAccessWallet = () => {
    try {
      const provider = ethers.getDefaultProvider();
      const wallet = new ethers.Wallet(input, provider);
      props.onComplete(wallet);
    } catch (e) {
      setError("Invalid private key");
    }
  };

  const handleInputChange = ({ target }: any) => setInput(target.value);

  return (
    <div className={classes.container}>
      <Typography variant="h6" className={classes.fullWidth}>
        Access Wallet
      </Typography>
      <div className={classes.accessWalletContainer}>
        <Input
          className={classes.field}
          value={input}
          placeholder="Enter private key"
          onChange={handleInputChange}
        />
        <Button
          className={classes.field}
          onClick={handleAccessWallet}
          color="primary"
          variant="contained"
        >
          Access
        </Button>
        {error ? <Typography color="error">{error}</Typography> : null}
      </div>
    </div>
  );
};

export default withStyles(styles as any)(AccessWallet);
