export const stringifyBigInt = (obj: any): any => {
  if (typeof obj === 'bigint') {
    return obj.toString();
  } else if (Array.isArray(obj)) {
    return obj.map((item) => stringifyBigInt(item));
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).reduce((acc, key) => {
      if (
        key === 'block_signed_at' ||
        key === 'quote_rate' ||
        key === 'quote_rate_24h' ||
        key === 'quote' ||
        key === 'pretty_quote' ||
        key === 'quote_24h' ||
        key === 'pretty_quote_24h' ||
        key === 'protocol_metadata'
      ) {
        acc[key] = obj[key];
      } else {
        acc[key] = stringifyBigInt(obj[key]);
      }
      return acc;
    }, {});
  } else if (obj === null) {
    return null;
  }
  return obj;
};
