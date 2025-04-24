// Define types for SQL query results
export type SqlQueryResult<T = Record<string, any>> = T[];

// Define the FullQueryResults type that's mentioned in the error
export interface FullQueryResults<T> {
  rows?: T[];
  command?: string;
  rowCount?: number;
  oid?: number;
  fields?: any[];
}

// Type guard to check if a result has rows
export function hasRows(result: any): result is { rows: any[] } {
  return result && Array.isArray(result.rows);
}

// Type guard to check if a result is an array
export function isArray(result: any): result is any[] {
  return Array.isArray(result);
}

// Type guard to check if a result is a FullQueryResults
export function isFullQueryResults(
  result: any
): result is FullQueryResults<any> {
  return (
    result &&
    typeof result === "object" &&
    ("rows" in result || "command" in result)
  );
}

// Helper function to safely get results from SQL queries
export function getQueryResults<T = Record<string, any>>(result: any): T[] {
  if (isArray(result)) {
    return result as T[];
  }
  if (hasRows(result)) {
    return result.rows as T[];
  }
  if (isFullQueryResults(result)) {
    return (result.rows || []) as T[];
  }
  return [] as T[];
}

// Helper function to safely get a single result from SQL queries
export function getQueryResult<T = Record<string, any>>(result: any): T | null {
  const results = getQueryResults<T>(result);
  return results.length > 0 ? results[0] : null;
}

// Enhanced SQL function that returns properly typed results
export function createTypedSql<T = Record<string, any>>(sqlFunction: any) {
  return async (...args: any[]): Promise<T[]> => {
    const result = await sqlFunction(...args);
    return getQueryResults<T>(result);
  };
}

// Enhanced SQL function that returns a single result
export function createTypedSqlSingle<T = Record<string, any>>(
  sqlFunction: any
) {
  return async (...args: any[]): Promise<T | null> => {
    const result = await sqlFunction(...args);
    return getQueryResult<T>(result);
  };
}

// Helper function to make any SQL result filterable
export function makeFilterable<T = Record<string, any>>(result: any): T[] {
  return getQueryResults<T>(result);
}

// A simple helper function that always returns an array, regardless of input format
export function ensureArray<T = any>(result: any): T[] {
  // If it's already an array, return it
  if (Array.isArray(result)) {
    return result as T[];
  }

  // If it has a rows property that's an array, return that
  if (result && Array.isArray(result.rows)) {
    return result.rows as T[];
  }

  // Return empty array as fallback
  return [] as T[];
}

// A simple helper to get the first item or null
export function getFirstItem<T = any>(result: any): T | null {
  const array = ensureArray<T>(result);
  return array.length > 0 ? array[0] : null;
}
