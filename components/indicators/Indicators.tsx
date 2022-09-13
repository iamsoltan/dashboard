import React from "react";

import styles from "./Indicators.module.scss";

function Indicators({
  totalRevenue,
  currencyIsoCode,
  netRevenue,
  transactions,
  totalRefund,
}: IndicatorProps) {
  return (
    <div className={styles.performance}>
      <h3 className={styles.performance_title}>Key performance indicators</h3>
      <div className={styles.performance_indicators}>
        <div className={styles.performance_indicators_confirmed}>
          <div className={styles.performance_indicator}>
            {totalRevenue !== 0 ? (
              <span className={styles.performance_indicator_number}>
                {totalRevenue}
              </span>
            ) : (
              <span className={styles.performance_indicator_number}>0</span>
            )}
            {currencyIsoCode && (
              <span className={styles.performance_currency}>
                {currencyIsoCode}
              </span>
            )}
            <h4 className={styles.performance_indicator_title}>
              Total revenue
            </h4>
            <p className={styles.performance_indicator_description}>
              Including all captured payments
            </p>
          </div>
          <div className={styles.performance_indicator}>
            {netRevenue ? (
              <span className={styles.performance_indicator_number}>
                {netRevenue}
              </span>
            ) : (
              <span className={styles.performance_indicator_number}>0</span>
            )}
            {currencyIsoCode && (
              <span className={styles.performance_currency}>
                {currencyIsoCode}
              </span>
            )}
            <h4 className={styles.performance_indicator_title}>Net revenue</h4>
            <p className={styles.performance_indicator_description}>
              Total revenue minus refunds
            </p>
          </div>
          <div className={styles.performance_indicator}>
            {netRevenue ? (
              <span className={styles.performance_indicator_number}>
                {transactions?.count}
              </span>
            ) : (
              <span className={styles.performance_indicator_number}>0</span>
            )}
            <h4 className={styles.performance_indicator_title}>
              Confirmed payments
            </h4>
            <p className={styles.performance_indicator_description}>
              Number of captured payments
            </p>
          </div>
          <div
            className={styles.performance_indicator}
            style={{
              borderLeft: "1px solid #7a8c92",
            }}
          >
            {totalRefund?.sum ? (
              <span className={styles.performance_indicator_number}>
                {totalRefund?.sum}
              </span>
            ) : (
              <span className={styles.performance_indicator_number}>0</span>
            )}
            {totalRevenue && (
              <span className={styles.performance_currency}>
                {currencyIsoCode}
              </span>
            )}
            <h4 className={styles.performance_indicator_title}>
              Total Refunds
            </h4>
            <p className={styles.performance_indicator_description}>
              Total amount refunded
            </p>
          </div>
          <div className={styles.performance_indicator}>
            {totalRefund?.count ? (
              <span className={styles.performance_indicator_number}>
                {totalRefund?.count}
              </span>
            ) : (
              <span className={styles.performance_indicator_number}>0</span>
            )}
            <h4 className={styles.performance_indicator_title}>Refund</h4>
            <p className={styles.performance_indicator_description}>
              Number of refunded payments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

type TransactionField = {
  count: number;
};
type RefundField = {
  count: number;
  sum: number;
};

type IndicatorProps = {
  totalRevenue: number;
  currencyIsoCode: string;
  netRevenue: number;
  transactions: TransactionField;
  totalRefund: RefundField;
};

export default Indicators;
