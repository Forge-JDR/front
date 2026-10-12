import React from "react";
import { Field } from "../../../design-system";
export default function FieldForm({ errorMessage, ...props }) {
  return <Field {...props} error={errorMessage} />;
}
