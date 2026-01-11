// Type dyal error li kayji mn API
interface MedusaApiError {
  response?: {
    data: {
      message?: string
    } | string
    status: number
    headers: Record<string, string>
  }
  request?: unknown
  config?: {
    url: string
    baseURL: string
  }
  message?: string
}

// Kan-handliw errors li kayjin mn Medusa API
export default function medusaError(error: MedusaApiError): never {
  if (error.response) {
    // Request t-dar w server jaweb b status code li bra mn 2xx
    const u = new URL(error.config?.url ?? "", error.config?.baseURL ?? "")
    console.error("Resource:", u.toString())
    console.error("Response data:", error.response.data)
    console.error("Status code:", error.response.status)
    console.error("Headers:", error.response.headers)

    // Kan-staxtrajou l-message mn response data
    const message = typeof error.response.data === "string"
      ? error.response.data
      : error.response.data.message ?? String(error.response.data)

    throw new Error(message.charAt(0).toUpperCase() + message.slice(1) + ".")
  } else if (error.request) {
    // Request t-dar walakin ma jawbch l-server
    throw new Error("Ma ja ta jawab: " + String(error.request))
  } else {
    // Chi haja wq3at mni kont kan-prefari l-request
    throw new Error("Kayan mochkil f setup dyal request: " + (error.message ?? "Unknown error"))
  }
}
