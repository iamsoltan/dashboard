import React from "react";
import {
  Grid,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { useIntl } from "react-intl";
import { FormProfileType, profileType } from "shared/models";

import styles from "./FormProfile.module.scss";

const FormProfile = ({
  handleSubmit,
  isLoading = false,
  currentItem,
}: FormProfileType) => {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const submitForm = async (data: profileType) => handleSubmit(data);

  const myFormInitValues: profileType = currentItem || {
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    currencyIsoCode: "",
    countryName: "",
  };
  // console.log({ currentItem });

  return (
    <div className={styles.form}>
      <Formik
        enableReinitialize
        initialValues={myFormInitValues}
        onSubmit={(values: profileType) => submitForm(values)}
        validationSchema={Yup.object().shape({
          email: Yup.string().required(f("emailReq")).email(f("emailValid")),
          phoneNumber: Yup.string()
            .matches(phoneRegExp, f("phonenotValid"))
            .min(8, f("phonenotValid"))
            .max(16, f("phonenotValid"))
            .required(f("phoneRequired")),
          lastName: Yup.string()
            .required(f("lastnemaRequired"))
            .min(3, f("lastnameMincaracter")),
          firstName: Yup.string()
            .required(f("firstnameRequired"))
            .min(3, f("firstnameMincaracter")),
          address: Yup.string().required(f("addressRequired")),
          currencyIsoCode: Yup.string().required(f("currencyRequired")),
          countryName: Yup.string().required(f("countryRequired")),
        })}
      >
        {({
          values,
          errors,
          handleBlur,
          handleChange,
          isSubmitting,
        }: FormikProps<profileType>) => (
          <Form>
            <Grid container direction="row">
              <div className={styles.form_section}>
                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("id")}</div>
                  <div className={styles.form_data}>
                    <FormControl sx={{ margin: 2 }}>
                      <div>{values.id}</div>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("firstName")}</div>
                  <div className={styles.form_data}>
                    <TextField
                      name="firstName"
                      inputProps={{ className: styles.form_textfield }}
                      id="firstName"
                      placeholder={f("firstnamePlaceholder")}
                      value={values.firstName}
                      type="text"
                      helperText={
                        errors.firstName && errors.firstName
                          ? errors.firstName
                          : ""
                      }
                      error={!!(errors.firstName && errors.firstName)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      fullWidth
                    />
                  </div>
                </Grid>
                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("lastName")}</div>
                  <div className={styles.form_data}>
                    <TextField
                      name="lastName"
                      inputProps={{ className: styles.form_textfield }}
                      id="lastName"
                      placeholder={f("lastnamePlaceholder")}
                      value={values.lastName}
                      type="text"
                      helperText={
                        errors.lastName && errors.lastName
                          ? errors.lastName
                          : ""
                      }
                      error={!!(errors.lastName && errors.lastName)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      fullWidth
                    />
                  </div>
                </Grid>

                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("address")}</div>
                  <div className={styles.form_data}>
                    <TextField
                      name="address"
                      inputProps={{ className: styles.form_textfield }}
                      id="address"
                      placeholder={f("addressPlaceholder")}
                      value={values.address}
                      minRows={3}
                      type="text"
                      multiline
                      helperText={
                        errors.address && errors.address ? errors.address : ""
                      }
                      error={!!(errors.address && errors.address)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      fullWidth
                    />
                  </div>
                </Grid>

                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("phoneNumber")}</div>
                  <div className={styles.form_data}>
                    <TextField
                      name="phoneNumber"
                      id="phoneNumber"
                      placeholder={f("phonePlaceholder")}
                      value={values.phoneNumber}
                      type="text"
                      helperText={
                        errors.phoneNumber && errors.phoneNumber
                          ? errors.phoneNumber
                          : ""
                      }
                      error={!!(errors.phoneNumber && errors.phoneNumber)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      fullWidth
                    />
                  </div>
                </Grid>
                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("email")}</div>
                  <div className={styles.form_data}>
                    <FormControl sx={{ margin: 2 }} error={!!errors.email}>
                      <div>{values.email}</div>
                      <FormHelperText>{errors.email}</FormHelperText>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("country")}</div>
                  <div className={styles.form_data}>
                    <FormControl
                      sx={{ margin: 2 }}
                      error={!!errors.countryName}
                    >
                      <div>{values.countryName}</div>
                      <FormHelperText>{errors.countryName}</FormHelperText>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("currency")}</div>
                  <div className={styles.form_data}>
                    <FormControl
                      sx={{ margin: 2 }}
                      error={!!errors.currencyIsoCode}
                    >
                      <div>{values.currencyIsoCode}</div>
                      <FormHelperText>{errors.currencyIsoCode}</FormHelperText>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className={styles.form_button}>
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
                        f("update")
                      )}
                    </Button>
                  </div>
                </Grid>
              </div>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormProfile;
