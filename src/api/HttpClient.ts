import { errorToast } from "../main";
import Cookies from "universal-cookie";

export type HttpResponse<T> = {
  success: boolean;
  data: T;
  message: string;
};

type HttpMethod = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";

type RequiredBodyHttpMethod = "POST" | "PUT" | "PATCH";

type HttpCallParams<T extends HttpMethod = HttpMethod> = {
  url: string;
  method: HttpMethod;
  body?: T extends RequiredBodyHttpMethod ? unknown : undefined;
};
type HttpCallWithAuthorizationParams<T extends HttpMethod = HttpMethod> = {
  url: string;
  method: T;
  body?: T extends RequiredBodyHttpMethod ? unknown : undefined;
  token?: string;
};

export async function httpCall<HttpResponse>({
  url,
  method,
  body,
}: HttpCallParams): Promise<HttpResponse> {
  const cookies = new Cookies();
  const user = cookies.get("user");
  const accessToken = user?.accessToken;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  try{
    const response = await fetch(url, {
      method: method,
      headers,
      credentials: "include",
      body: JSON.stringify(body),
    });
  
    if (response.status >= 500) {
      errorToast("Server error. Please try again later.");
      return {} as HttpResponse;
    }
  
    return await response.json();
  } catch (e) {
    errorToast("Server error. Please try again later.");
    return {} as HttpResponse;
  }

}

export async function httpCallWithAuthorization<Data>({
                                                        token,
                                                        url,
                                                        method,
                                                        body,
                                                      }: HttpCallWithAuthorizationParams): Promise<Data> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (body) {
    console.log("Request Body:", JSON.stringify(body, null, 2));
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers,
      credentials: "include",
      body: JSON.stringify(body),
    });

    console.log("Response Status:", response.status);
    console.log("Response Headers:", response.headers);

    if (response.status >= 500) {
      errorToast("Server error. Please try again later.");
      return {} as Data;
    }

    const contentType = response.headers.get("content-type");
    console.log("Content-Type:", contentType);

    if (contentType && contentType.includes("application/json")) {
      const jsonData = await response.json();
      console.log("Parsed JSON Data:", jsonData);
      return jsonData;
    } else {
      console.warn("Response is not JSON or is empty");
      return {} as Data;
    }
  } catch (error) {
    errorToast("Network error. Please check your connection and try again.");
    console.error("Fetch error:", error);
    return {} as Data;
  }
}

// export async function httpCallWithAuthorization<Data>({
//   token,
//   url,
//   method,
//   body,
// }: HttpCallWithAuthorizationParams): Promise<Data> {
//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };
//
//   try {
//     const response = await fetch(url, {
//       method: method,
//       headers,
//       credentials: "include",
//       body: JSON.stringify(body),
//     });
//
//     if (response.status >= 500) {
//       errorToast("Server error. Please try again later.");
//       return {} as Data;
//     }
//
//     const contentType = response.headers.get("content-type");
//     if (contentType && contentType.includes("application/json")) {
//       return await response.json();
//     } else {
//       return {} as Data;
//     }
//   } catch (error) {
//     errorToast("Network error. Please check your connection and try again.");
//     console.error("Fetch error:", error);
//     return {} as Data;
//   }
// }
