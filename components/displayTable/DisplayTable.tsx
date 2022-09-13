import React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Title from "components/title";
import { dataTableElementType, dataTableType } from "shared/models";

export default function CustomDisplayTable({ title, rows }: dataTableType) {
  return (
    <>
      <Title>{title}</Title>
      <TableContainer component={Paper} sx={{ maxHeight: 600, width: 600 }}>
        <Table aria-label="custom pagination table">
          <TableBody>
            {rows.map((row: dataTableElementType) => (
              <TableRow key={row.key}>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ borderBottom: "none" }}
                >
                  {row.label}
                </TableCell>
                <TableCell
                  style={{ width: 300 }}
                  align="left"
                  sx={{ borderBottom: "none" }}
                >
                  {row.value} {row?.symbol}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
