import { Transform } from 'class-transformer';
import trim from 'validator/lib/trim';

/**
 * Removes characters from the beginning and the end of a string.
 *
 * @param chars Characters to remove (whitespace by default)
 */
export default function Trim(chars?: string) {
  return Transform(({ value }) =>
    typeof value === 'string' ? trim(value, chars) : value,
  );
}
