import React from "react";
import { Button } from "../../../design-system";
export default function LegacyButton({ className = "", ...props }) {
  return <Button {...props} className={className} />;
}
