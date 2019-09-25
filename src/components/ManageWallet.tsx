import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  withStyles,
  Button,
  Input,
  Typography,
  CircularProgress,
  Link
} from "@material-ui/core";
import classNames from "classnames";
import QRCode from "qrcode.react";

const styles = (theme: any) => ({
  fullWidth: {
    width: "100%"
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  sendContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },
  sendAmountContainer: {
    display: "flex",
    alignItems: "center"
  },
  manageWalletContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginTop: theme.spacing(2),
    justifyContent: "space-between",
    maxWidth: "27em"
  },
  walletInfoContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginTop: theme.spacing(2),
    justifyContent: "space-between"
  },
  ethTypography: {
    width: "2em",
    marginLeft: "1em"
  },
  sendField: {
    margin: `${theme.spacing(2)}px 0`
  },
  addressTypography: {
    marginTop: "1em"
  },
  wordBreak: {
    wordBreak: "break-word"
  },
  bold: {
    fontWeight: "bold"
  },
  field: {
    margin: `${theme.spacing(2)}px 0`
  }
});

interface Props {
  classes: any;
  wallet: ethers.Wallet;
}

const ManageWallet = (props: Props) => {
  const { classes } = props;
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sendAmount, setSendAmount] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    props.wallet.getBalance().then(_balance => {
      setBalance(+ethers.utils.formatEther(_balance));
      setLoading(false);
    });
  }, [props.wallet]);

  const handleSendAmountChange = ({ target }: any) => {
    setSendAmount(target.value);
  };

  const handleRecipientChange = ({ target }: any) => {
    setRecipient(target.value);
  };

  const handleSend = () => {
    setError("");
    try {
      ethers.utils.getAddress(recipient);
    } catch (e) {
      return setError("Recipient is invalid");
    }
    if (!sendAmount || sendAmount > balance) {
      setError("Invalid send amount");
    }
    let tx = {
      to: recipient,
      value: ethers.utils.parseEther(sendAmount.toString()),
      gasPrice: ethers.utils.parseUnits('40', 'gwei'),
    };
    setLoading(true);
    props.wallet.sendTransaction(tx).then(sentTx => {
      setLoading(false);
      setTxHash(sentTx.hash!);
    }).catch(()=>{
      setLoading(false);
      setError('Failed to submit tx');
    });
  };

  if (loading) {
    return (
      <div className={classNames(classes.container, classes.wordBreak)}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className={classNames(classes.container, classes.wordBreak)}>
      <Typography variant="h6" className={classes.fullWidth}>
        Wallet
      </Typography>
      <div className={classes.manageWalletContainer}>
        <div className={classes.walletInfoContainer}>
          <QRCode value={props.wallet.address} />
          <Typography className={classes.addressTypography}>
            Address:{" "}
            <span className={classes.bold}>{props.wallet.address}</span>
          </Typography>
          <Link
            target="_blank"
            href={`https://etherscan.io/address/${props.wallet.address}`}
            className={classes.addressTypography}
          >
            View account on etherscan
          </Link>
          <Typography className={classes.addressTypography}>
            Balance: <span className={classes.bold}>{balance}</span> eth
          </Typography>
        </div>
        <div className={classes.sendContainer}>
          {txHash ? (
            <>
              <Typography className={classes.sendField}>
                Transaction broadcasted!
              </Typography>
              <Link target="_blank" href={`https://etherscan.io/tx/${txHash}`}>
                View tx on etherscan
              </Link>
            </>
          ) : (
            <>
              <Input
                className={classes.sendField}
                value={recipient}
                onChange={handleRecipientChange}
                placeholder="recipient address"
              />
              <div className={classes.sendAmountContainer}>
                <Input
                  className={classes.sendField}
                  value={sendAmount}
                  type="number"
                  onChange={handleSendAmountChange}
                  placeholder="send amount in eth"
                />
                <Typography className={classes.ethTypography}>eth</Typography>
              </div>
              <Button
                className={classes.sendField}
                onClick={handleSend}
                color="primary"
                variant="contained"
              >
                Send
              </Button>
              {error ? <Typography color="error">{error}</Typography> : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles as any)(ManageWallet);
