interface ErrorObject {
  data?: ErrorData | string[] | string;
  status?: number;
}

interface ErrorData {
  [field: string]: string[] | string;
}

export const extractErrorMessage = (
  error: ErrorObject,
  defaultMessage: string = 'Failed to log in. Please try again.'
): string => {
  if (!error) {
    return defaultMessage;
  }

  const { data } = error;

  if (Array.isArray(data)) {
    // If data is an array of messages
    return data.join('\n') || defaultMessage;
  }

  if (typeof data === 'object' && data !== null) {
    // If data is an object, process field-specific errors
    const serverErrors = Object.entries(data)
      .flatMap(([field, messages]) => {
        const msgs = Array.isArray(messages) ? messages : [messages];
        return msgs.map(
          (message: string) => `${capitalize(field)}: ${message}`
        );
      })
      .join('\n'); // Using newline for better readability

    return serverErrors || defaultMessage;
  }

  if (typeof data === 'string') {
    // If data is a single string message
    return data || defaultMessage;
  }

  return defaultMessage;
};

const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1);
