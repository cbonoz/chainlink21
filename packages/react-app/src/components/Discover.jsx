import React, { useState, useEffect } from "react";
import { DEMO_PROPERTIES, USE_LOCAL } from "../util";
import { getProperties } from "../util/moral";
import PropertyCard from "./PropertyCard";

function Discover({ setProperty, history }) {
  const [properties, setProperties] = useState();
  const [loading, setLoading] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const results = await getProperties();
      setProperties(results);
    } catch (e) {
      console.error("error getting properties", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (USE_LOCAL) {
      setProperties(DEMO_PROPERTIES);
      return;
    }

    fetchProperties();
  }, []);

  return (
    <div>
      {(properties || []).map((p, i) => {
        return (
          <span
            key={i}
            onClick={() => {
              setProperty(p);
              history.push(`/property/${p.id || p.cid}`);
              // window.location.reload();
            }}
          >
            <PropertyCard {...p} />
          </span>
        );
      })}
    </div>
  );
}

export default Discover;
