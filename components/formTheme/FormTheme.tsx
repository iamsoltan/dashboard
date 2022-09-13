import React from "react";
import { Grid, TextField, Button, CircularProgress } from "@mui/material";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";

import { useIntl } from "react-intl";

import { FormWebsiteType, themeType, websiteType } from "shared/models";

import styles from "./FormTheme.module.scss";

const FormTheme = ({
  handleSubmit,
  isLoading = false,
  currentItem,
}: FormWebsiteType) => {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });

  // TODO : temporary data formatting until backend update its own structure
  const formatOutGo = (localForm: themeType): any => {
    const paymentMethods =
      currentItem?.paymentMethods.map((e: any) => e.id) || [];
    return {
      ...currentItem,
      paymentMethods,
      theme: { ...localForm },
    };
  };

  // TODO : temporary data formatting until backend update its own structure
  const formatIncome = (data: websiteType) => {
    const primaryColor = data?.theme?.primaryColor || "";
    return { primaryColor };
  };
  const submitForm = async (data: themeType) => {
    handleSubmit(formatOutGo(data));
  };
  const initialValues: themeType = formatIncome(currentItem as websiteType);

  return (
    <div className={styles.form}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values: themeType) => submitForm(values)}
        validationSchema={Yup.object().shape({
          primaryColor: Yup.string().min(3),
        })}
      >
        {({
          values,
          errors,
          handleBlur,
          handleChange,
          isSubmitting,
        }: FormikProps<websiteType>) => (
          <Form className={styles.form_container}>
            <h2 className="">{f("UPDATE_WEBSITE_THEME")}</h2>
            <Grid container direction="column">
              <Grid p={2} item lg={6} xs={12}>
                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("primaryColor")}</div>
                  <CropSquareIcon
                    sx={{
                      color: "#ffffff00",
                      border: "1px solid #0a0a0a",
                      backgroundColor: values.primaryColor,
                      margin: 2,
                    }}
                  />
                  <TextField
                    name="primaryColor"
                    inputProps={{ className: styles.form_textfield }}
                    id="primaryColor"
                    placeholder={f("primaryColor")}
                    value={values.primaryColor}
                    type="text"
                    helperText={
                      errors.primaryColor && errors.primaryColor
                        ? errors.primaryColor
                        : ""
                    }
                    error={!!(errors.primaryColor && errors.primaryColor)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} className={styles.form_button}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || isLoading}
                  className={styles.form_btn}
                >
                  {isLoading ? (
                    <CircularProgress color="secondary" />
                  ) : (
                    f("submit")
                  )}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormTheme;
