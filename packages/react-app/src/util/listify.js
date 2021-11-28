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
        const value = (JSON.stringify(v) || "").replaceAll('"', "");

        return (
          <li key={i}>
            {capitalize(k)}:{" "}
            {value.indexOf("http") !== -1 ? (
              <a target="_blank" href={value}>
                {value}
              </a>
            ) : (
              <span>{value}</span>
            )}
          </li>
        );
      })}
    </div>
  );
};
