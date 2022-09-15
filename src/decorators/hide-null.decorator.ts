import { Transform } from 'class-transformer';

/**
 * Converts `null` properties to `undefined` when transforming to a plain object
 */
export default function HideNull() {
  return Transform(({ value }) => (value !== null ? value : undefined), {
    toPlainOnly: true,
  });
}
