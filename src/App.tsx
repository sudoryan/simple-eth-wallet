import React, { useState } from "react";
import { withStyles, Paper, Button, Typography } from "@material-ui/core";
import GenerateWallet from "./components/GenerateWallet";
import ManageWallet from "./components/ManageWallet";
import AccessWallet from "./components/AccessWallet";
import { ethers } from "ethers";

const styles = (theme: any) => ({
  appContainer: {
    padding: "1em"
  },
  container: {
    minHeight: "400px",
    height: "100%",
    marginRight: "auto",
    marginLeft: "auto",
    maxWidth: "960px",
    paddingRight: "10px",
    paddingLeft: "10px"
  },
  backButtonWrapper: {
    width: "100%",
    margin: "1em 0",
    height: "3em",
    display: "flex"
  },
  contentWrapper: {
    padding: "2em"
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between"
  },
  optionButton: {
    margin: "1em 0"
  }
});

interface Props {
  classes: any;
}

enum PAGE {
  INITIAL,
  ACCESS_WALLET,
  GENERATE_WALLET
}

const App = (props: Props) => {
  const { classes } = props;
  const [page, setPage] = useState(PAGE.INITIAL);
  const [wallet, setWallet] = useState(null as null | ethers.Wallet);

  const handleBack = () => {
    setWallet(null);
    setPage(PAGE.INITIAL);
  };
  
  const handleAccessedWallet = (_wallet: ethers.Wallet) => setWallet(_wallet);

  const renderContent = () => {
    const handleAccessWalletClick = () => setPage(PAGE.ACCESS_WALLET);
    const handleGenerateWalletClick = () => setPage(PAGE.GENERATE_WALLET);
    if (wallet) {
      return <ManageWallet wallet={wallet} />;
    }
    if (page === PAGE.INITIAL) {
      return (
        <div className={classes.optionsContainer}>
          <Button
            className={classes.optionButton}
            variant="contained"
            color="primary"
            onClick={handleAccessWalletClick}
          >
            Access Wallet
          </Button>
          <Typography>OR</Typography>
          <Button
            className={classes.optionButton}
            variant="outlined"
            color="primary"
            onClick={handleGenerateWalletClick}
          >
            Generate Wallet
          </Button>
        </div>
      );
    }
    if (page === PAGE.ACCESS_WALLET) {
      return <AccessWallet onComplete={handleAccessedWallet} />;
    }
    if (page === PAGE.GENERATE_WALLET) {
      return <GenerateWallet />;
    }
    return null;
  };

  return (
    <div className={classes.appWrapper}>
      <div className={classes.appContainer}>
        <header>
          <Typography variant="h4" color="primary">
            Simple Ethereum Wallet
          </Typography>
        </header>
        <div className={classes.container}>
          <div className={classes.backButtonWrapper}>
            {page !== PAGE.INITIAL ? (
              <Button onClick={handleBack} color="primary">
                BACK
              </Button>
            ) : null}
          </div>
          <Paper className={classes.contentWrapper}>{renderContent()}</Paper>
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles as any)(App);
