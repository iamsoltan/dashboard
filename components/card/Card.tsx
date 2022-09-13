import React from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useIntl } from "react-intl";

import Dialog from "components/dialog";
import requestWithdraw from "services/withdraw";
import { withdrawMethodType } from "shared/models";
import styles from "./Card.module.scss";

const Card = ({ method }: { method: withdrawMethodType }) => {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });
  const [amount, setAmount] = React.useState<number>(0);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<string | null>("");

  const withdrawMutation = useMutation(requestWithdraw, {
    onSuccess: (res) => {
      if (res.TRANSACTION_STATE !== "REJECTED") {
        toast.dismiss();
        toast.success("Successful withdraw request !");
      } else {
        toast.dismiss();
        toast.error(`Cannot process withdrawal request !\n${res.MESSAGE}`);
      }
    },
    onError: (error: any) => {
      toast.dismiss();
      toast.error(`Cannot process withdrawal request !\n${error.message}`);
    },
  });

  const handleSubmit = () => {
    if (errors === null && withdrawMutation.isLoading === false) {
      withdrawMutation.mutate({ amount });
      toast.loading("Your Withdrawal request is being processed...");
      setOpenDialog(false);
      setAmount(0);
    }
  };

  const handleOpenDialog = () => {
    if (amount === 0) {
      setErrors(f("errorMinOneTND"));
      return;
    }
    if (errors === null) setOpenDialog(true);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const entry = event.target.value;
    if (entry.match(/[^$,.\d]/)) return;
    setErrors(null);
    setAmount(+entry);
  };
  return (
    <div
      key={method.id}
      className={styles.card_container}
      style={{ width: "150" }}
    >
      <img
        src={`${method.logo}`}
        alt={`method of ${method.name}`}
        className={styles.card_img}
      />
      <FormControl fullWidth sx={{ m: 1 }} error={!!errors}>
        <InputLabel htmlFor="outlined-adornment-amount">
          {f("amount")}
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-amount"
          type="number"
          value={amount}
          onChange={handleChange}
          startAdornment={
            <InputAdornment position="start">{f("tnd")}</InputAdornment>
          }
          label="Amount"
        />
        <FormHelperText>{errors}</FormHelperText>
      </FormControl>
      <Button
        variant="outlined"
        className={styles.card_btn}
        onClick={handleOpenDialog}
      >
        {`${f("withdrawFrom")} ${method.label}`}
      </Button>
      {openDialog && (
        <Dialog
          openDialog={openDialog}
          handleClose={() => setOpenDialog(false)}
          dialogTitle={f("confirmWithdraw")}
          dialogContent={f("confirmWithdrawContent").replace(
            "{amount}",
            `${amount}`
          )}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Card;
