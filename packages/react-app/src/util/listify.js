import React from "react";
import { capitalize } from ".";

export const Listify = ({ obj }) => {
  return (
    <div>
      {Object.keys(obj).map((k, i) => {
        const v = obj[k];
        if (!v) {
          return;
        }
        return (
          <li key={i}>
            {capitalize(k)}: {(JSON.stringify(v) || "").replaceAll('"', "")}
          </li>
        );
      })}
    </div>
  );
};
