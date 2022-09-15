import { Transform } from 'class-transformer';
import normalizeEmail, {
  NormalizeEmailOptions,
} from 'validator/lib/normalizeEmail';

/**
 * Canonicalizes an email address.
 */
export default function NormalizeEmail(options?: NormalizeEmailOptions) {
  return Transform(({ value }) =>
    typeof value === 'string' ? normalizeEmail(value, options) : value,
  );
}
