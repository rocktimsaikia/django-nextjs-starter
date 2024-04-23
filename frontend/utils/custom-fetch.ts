const BACKEND_SERVER_URL =
  process.env.INTERNAL_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL;

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type FetchOptions<T> = {
  method: Method;
  body?: T;
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
  validateRequestBody(method, body);

  return {
    method: method,
    // "headers" and "body" are only required in the request
    // for POST, PUT, and PATCH requests. Since the "body" is
    // optional, we only include it if it exists.
    ...(["POST", "PUT", "PATCH"].includes(method) && body
      ? {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      : {}),
  };
}

function validateRequestBody<T>(method: Method, body?: T): void {
  const doesMethodRequireBody = ["POST", "PUT", "PATCH"].includes(method);

  if (!doesMethodRequireBody && body) {
    throw new Error(`${method} requests should not have a body`);
  }

  if (doesMethodRequireBody && !body) {
    throw new Error(`Request body is required for ${method} requests`);
  }
}
