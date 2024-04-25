const BACKEND_SERVER_URL =
  process.env.INTERNAL_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL;

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type FetchOptions<T> = {
  method: Method;
  body?: T;
  headers?: Record<string, string>;
};

export async function customFetch<T>(path: string, options?: FetchOptions<T>) {
  const apiEndpoint = `${BACKEND_SERVER_URL}${path}`;
  try {
    const config = buildConfig(options);
    const response = await fetch(apiEndpoint, config);
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch ${apiEndpoint}: ${error}`);
  }
}

function buildConfig<T>(options?: FetchOptions<T>): RequestInit {
  const method = options?.method || "GET";
  const body = options?.body;
  const headers = options?.headers;
  validateRequestBody(method, body);

  const baseHeaders = {
    ...headers,
    ...(doesMethodRequireBody(method) && body
      ? { "Content-Type": "application/json" }
      : {}),
  };

  return {
    method: method,
    headers: baseHeaders,
    ...(doesMethodRequireBody(method) && body
      ? { body: JSON.stringify(body) }
      : {}),
  };
}

function validateRequestBody<T>(method: Method, body?: T): void {
  if (!doesMethodRequireBody(method) && body) {
    throw new Error(`${method} requests should not have a body`);
  }

  if (doesMethodRequireBody(method) && !body) {
    throw new Error(`Request body is required for ${method} requests`);
  }
}

// New function to determine if the method requires a body
function doesMethodRequireBody(method: Method): boolean {
  return ["POST", "PUT", "PATCH"].includes(method);
}
