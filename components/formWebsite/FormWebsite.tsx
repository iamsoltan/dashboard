import React from "react";
import { useRouter } from "next/router";
import {
  Checkbox,
  Switch,
  FormGroup,
  FormControl,
  Grid,
  TextField,
  Button,
  CircularProgress,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { useKeycloak } from "@react-keycloak/ssr";
import type { KeycloakInstance } from "keycloak-js";
import { useIntl } from "react-intl";
import { useQuery } from "react-query";
import { includes, map } from "lodash";
import { getAllMethods } from "services/websites";
import { FormWebsiteType, websiteType } from "shared/models";
import { adminRole } from "shared/constants";
import styles from "./FormWebsite.module.scss";

const FormMerchant = ({
  handleSubmit,
  isLoading = false,
  currentItem,
}: FormWebsiteType) => {
  const { keycloak } = useKeycloak<KeycloakInstance>();
  const isAuth = keycloak?.authenticated === true;
  const isMerchant = isAuth && keycloak?.hasRealmRole(adminRole) === false;
  const isMerchantNotCreating = !(isMerchant && !!currentItem === false);
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });
  const { locale } = useRouter();

  const { data: methods } = useQuery("methods", () =>
    getAllMethods({ locale })
  );
  // TODO : temporary data formatting until backend update its own structure
  const formatOutGo = (data: any) => {
    const x = { ...data };
    const cleanMethods = data?.paymentMethods?.map(Number);
    const methodsArray = map(methods, "id");
    x.paymentMethods = cleanMethods.filter((e: number) =>
      methodsArray.includes(e)
    );

    if (isMerchantNotCreating) {
      x.status = x.status === true ? "active" : "inactive";
    }
    if (isMerchant) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { status, commission, ...rest } = x;
      return rest;
    }
    return x;
  };
  // TODO : temporary data formatting until backend update its own structure
  const formatIncome = (data: any) => {
    const x = { ...data };
    x.status = x.status === "active";
    x.paymentMethods = map(x.paymentMethods, "id");
    x.paymentMethods = x?.paymentMethods?.map(String);
    return x;
  };
  const submitForm = async (data: websiteType) => {
    handleSubmit(formatOutGo(data));
  };
  const initialValues = () => {
    if (currentItem) return formatIncome(currentItem);

    if (isMerchant)
      return {
        name: "",
        description: "",
        url: "",
        successUrl: "",
        failUrl: "",
        notificationUrl: "",
        tax: false,
        paymentMethods: [],
      };
    return {
      name: "",
      description: "",
      url: "",
      commission: "",
      successUrl: "",
      failUrl: "",
      notificationUrl: "",
      status: false,
      tax: false,
      paymentMethods: [],
    };
  };

  const myFormInitValues: websiteType = initialValues();
  return (
    <div className={styles.form}>
      <Formik
        initialValues={myFormInitValues}
        onSubmit={(values: websiteType) => submitForm(values)}
        validationSchema={Yup.object().shape({
          name: Yup.string().min(3).required(f("websitenameRequired")),
          description: Yup.string().required(f("websiteDescRequired")),
          url: Yup.string().url().required(f("websiteUrlRequired")),
          successUrl: Yup.string().url().required(f("successUrlRequired")),
          failUrl: Yup.string().url().required(f("failUrlRequired")),
          notificationUrl: Yup.string()
            .url()
            .required(f("notificationUrlRequired")),
          paymentMethods: Yup.array().of(Yup.string()),
          commission: Yup.string().nullable().notRequired(),
          status: Yup.bool().notRequired(),
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
            <h2 className="">
              {currentItem ? f("UPDATE_WEBSITE") : f("ADD_WEBSITE")}
            </h2>
            <Grid container direction="column">
              <Grid p={2} item lg={6} xs={12}>
                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("name")}</div>
                  <TextField
                    name="name"
                    inputProps={{ className: styles.form_textfield }}
                    id="name"
                    placeholder={f("websitename")}
                    value={values.name}
                    type="text"
                    helperText={errors.name && errors.name ? errors.name : ""}
                    error={!!(errors.name && errors.name)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("url")}</div>
                  <TextField
                    name="url"
                    inputProps={{ className: styles.form_textfield }}
                    id="url"
                    placeholder={f("websiteUrl")}
                    value={values.url}
                    type="text"
                    helperText={errors.url && errors.url ? errors.url : ""}
                    error={!!(errors.url && errors.url)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("description")}</div>
                  <TextField
                    name="description"
                    id="description"
                    minRows={3}
                    type="text"
                    multiline
                    placeholder={f("websiteDescription")}
                    inputProps={{ className: styles.form_textfield }}
                    value={values.description}
                    helperText={
                      errors.description && errors.description
                        ? errors.description
                        : ""
                    }
                    error={!!(errors.description && errors.description)}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("successUrl")}</div>
                  <TextField
                    name="successUrl"
                    id="successUrl"
                    type="text"
                    placeholder={f("websiteSuccessUrl")}
                    inputProps={{ className: styles.form_textfield }}
                    value={values.successUrl}
                    helperText={
                      errors.successUrl && errors.successUrl
                        ? errors.successUrl
                        : ""
                    }
                    error={!!(errors.successUrl && errors.successUrl)}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("FailUrl")}</div>
                  <TextField
                    name="failUrl"
                    id="failUrl"
                    type="text"
                    placeholder={f("websiteFailUrl")}
                    inputProps={{ className: styles.form_textfield }}
                    value={values.failUrl}
                    helperText={
                      errors.failUrl && errors.failUrl ? errors.failUrl : ""
                    }
                    error={!!(errors.failUrl && errors.failUrl)}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid p={2} item lg={6} xs={12}>
                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>
                    {f("NotificationUrl")}
                  </div>
                  <TextField
                    name="notificationUrl"
                    id="notificationUrl"
                    type="text"
                    placeholder={f("websiteNotificationUrl")}
                    inputProps={{ className: styles.form_textfield }}
                    value={values.notificationUrl}
                    helperText={
                      errors.notificationUrl && errors.notificationUrl
                        ? errors.notificationUrl
                        : ""
                    }
                    error={!!(errors.notificationUrl && errors.notificationUrl)}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                {isMerchantNotCreating && (
                  <>
                    <Grid item xs={12} className={styles.form_items}>
                      <div className={styles.form_label}>{f("commission")}</div>
                      <TextField
                        name="commission"
                        id="commission"
                        placeholder="enter your commission"
                        value={values.commission}
                        onInput={(e) => {
                          const target = e.target as HTMLInputElement;
                          target.value = Math.max(0, parseInt(target.value, 10))
                            .toString()
                            .slice(0, 2);
                        }}
                        disabled={currentItem && isMerchant}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                        type="number"
                        helperText={
                          errors.commission && errors.commission
                            ? errors.commission
                            : ""
                        }
                        error={!!(errors.commission && errors.commission)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} className={styles.form_items}>
                      <div className={styles.form_label}>{f("status")}</div>
                      <FormControl sx={{ margin: 2 }} error={!!errors.status}>
                        <FormControlLabel
                          control={
                            <Switch
                              name="status"
                              checked={values.status}
                              onChange={handleChange}
                              disabled={currentItem && isMerchant}
                            />
                          }
                          label=""
                        />
                        <FormHelperText>{errors.status}</FormHelperText>
                      </FormControl>
                    </Grid>
                  </>
                )}
                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("vat")}</div>
                  <FormControl sx={{ margin: 2 }} error={!!errors.tax}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="tax"
                          checked={values.tax}
                          onChange={handleChange}
                        />
                      }
                      label=""
                    />
                    <FormHelperText>{errors.tax}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} className={styles.form_select}>
                  <div className={styles.form_label_payment}>
                    {f("methods")}
                  </div>
                  <FormControl
                    component="fieldset"
                    variant="standard"
                    error={!!errors.paymentMethods}
                  >
                    <FormGroup>
                      {methods?.map((option: any) => (
                        <FormControlLabel
                          key={option.id}
                          control={
                            <Checkbox
                              name="paymentMethods"
                              onChange={handleChange}
                              checked={includes(
                                values.paymentMethods,
                                option.id.toString()
                              )}
                              value={option.id}
                            />
                          }
                          label={option.name}
                        />
                      ))}
                    </FormGroup>
                    <FormHelperText>{errors.paymentMethods}</FormHelperText>
                  </FormControl>
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

export default FormMerchant;
