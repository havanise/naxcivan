/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { propsEqual } from "react-shallow-equal";
import { usePrevious } from "./usePrevious";

/**
 * Filter helper hook
 * @param {{types: null}} filterVariants
 * @param {Function} callback
 */
export function useFilterHandle(filterVariants: any, callback: any) {
  const [filters, setFilters] = useState(filterVariants);
  const prevFilters = usePrevious(filters);

  const onFilter = useCallback((name: any, value = "all") => {
    if (
      value === "all" ||
      value === "" ||
      value === null ||
      value === undefined
    ) {
      setFilters((values: any) => ({ ...values, [name]: undefined }));
    } else {
      setFilters((values: any) => ({
        ...values,
        [name]: value,
        history: undefined,
      }));
    }
  }, []);

  useEffect(() => {
    if (!propsEqual(prevFilters || {}, filters)) {
      callback({ filters });
    }
  });

  return [filters, onFilter, setFilters];
}
