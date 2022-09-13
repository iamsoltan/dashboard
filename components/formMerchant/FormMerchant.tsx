import React from "react";
import {
  Grid,
  TextField,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { getCountries, getCurrencies } from "services/merchants";
import { useQuery } from "react-query";
import {
  FormMerchantType,
  merchantType,
  objectOfStringsNumberType,
} from "shared/models";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import FieldSelect from "../fieldSelect";
import styles from "./FormMerchant.module.scss";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const FormMerchant = ({
  handleSubmit,
  isLoading = false,
  currentItem,
}: FormMerchantType) => {
  const { locale } = useRouter();

  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });

  const formatCurrencies = (currenciesList: objectOfStringsNumberType[]) =>
    currenciesList
      ? currenciesList.map((e: objectOfStringsNumberType) => {
          e.value = e.code as string | number;
          return e;
        })
      : [];

  const formatCountries = (countriesList: objectOfStringsNumberType[]) =>
    countriesList
      ? countriesList.map((e: objectOfStringsNumberType) => {
          e.value = e.iso3 as string | number;
          e.label = e.name as string;
          return e;
        })
      : [];
  const { data: currencies } = useQuery("currencies", () =>
    getCurrencies({ locale })
  );
  const { data: countries } = useQuery("countries", () =>
    getCountries({ locale })
  );

  const submitForm = async (data: merchantType) => handleSubmit(data);

  const myFormInitValues: merchantType = currentItem || {
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    currencyIsoCode: "",
    countryIsoCode: "",
    enabled: false,
  };
  return (
    <div className={styles.form}>
      <Formik
        initialValues={myFormInitValues}
        onSubmit={(values: merchantType) => submitForm(values)}
        validationSchema={Yup.object().shape({
          email: Yup.string().email(f("emailValid")).required(f("emailReq")),
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
          countryIsoCode: Yup.string().required(f("countryRequired")),
          currencyIsoCode: Yup.string().required(f("currencyRequired")),
          enabled: Yup.bool()
            .oneOf([true, false], "Field must be bool")
            .required("This field is required"),
        })}
      >
        {({
          values,
          errors,
          handleBlur,
          handleChange,
          isSubmitting,
        }: FormikProps<merchantType>) => (
          <Form className={styles.form_container}>
            <h2 className="">
              {currentItem ? "UPDATE MERCHANT" : f("addNewMerchant")}
            </h2>
            <Grid container direction="row">
              <Grid p={2} item lg={6} xs={12}>
                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("firstName")}</div>
                  <TextField
                    name="firstName"
                    inputProps={{ className: styles.form_textfield }}
                    id="firstName"
                    placeholder={f("firstnamePlaceholder")} // enter your first name
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
                  />
                </Grid>
                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("lastName")}</div>
                  <TextField
                    name="lastName"
                    inputProps={{ className: styles.form_textfield }}
                    id="lastName"
                    placeholder={f("lastnamePlaceholder")} // enter your last name
                    value={values.lastName}
                    type="text"
                    helperText={
                      errors.lastName && errors.lastName ? errors.lastName : ""
                    }
                    error={!!(errors.lastName && errors.lastName)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("email")}</div>
                  <TextField
                    name="email"
                    inputProps={{ className: styles.form_textfield }}
                    id="email"
                    placeholder={f("emailPlaceholder")}
                    value={values.email}
                    type="email"
                    helperText={
                      errors.email && errors.email ? errors.email : ""
                    }
                    error={!!(errors.email && errors.email)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("address")}</div>
                  <TextField
                    name="address"
                    inputProps={{ className: styles.form_textfield }}
                    id="address"
                    placeholder={f("addressPlaceholder")} // enter your address
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
                  />
                </Grid>
              </Grid>
              <Grid p={2} item lg={6} xs={12}>
                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("phoneNumber")}</div>
                  <TextField
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder={f("phonePlaceholder")} // enter your phone
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
                  />
                </Grid>

                <Grid item xs={12} className={styles.form_items}>
                  <div className={styles.form_label}>{f("status")}</div>
                  <FormControl sx={{ margin: 2 }} error={!!errors.enabled}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="enabled"
                          checked={values.enabled}
                          onChange={handleChange}
                        />
                      }
                      label=""
                    />
                    <FormHelperText>{errors.enabled}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} className={styles.form_select}>
                  <div className={styles.form_label}>{f("currency")}</div>
                  {currencies && (
                    <FieldSelect
                      id="currencyIsoCode"
                      name="currencyIsoCode"
                      options={formatCurrencies(currencies)}
                      onChangeField={handleChange}
                      value={values.currencyIsoCode || ""}
                      error={errors.currencyIsoCode}
                    />
                  )}
                </Grid>
                <Grid item xs={12} className={styles.form_select}>
                  <div className={styles.form_label}>{f("country")}</div>
                  {countries && (
                    <FieldSelect
                      id="countryIsoCode"
                      name="countryIsoCode"
                      options={formatCountries(countries)}
                      onChangeField={handleChange}
                      value={values.countryIsoCode || ""}
                      error={errors.countryIsoCode}
                    />
                  )}
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
