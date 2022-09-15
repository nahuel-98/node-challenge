import { Transform, TransformOptions } from 'class-transformer';

/**
 * Converts a value to a string.
 *
 * If the parameter is not set, leaves it as is.
 * If the parameter is an array, returns its first element as a string.
 *
 * @usageNotes
 * Query string params can be strings, arrays of strings or objects.
 * Use this decorator when you ant to make sure the property is of the first type.
 */
export default function NormalizeQueryParamString(options?: TransformOptions) {
  return Transform(({ value }) => {
    if (value == undefined) {
      return value;
    }

    if (Array.isArray(value) && value.length > 0) {
      return String(value[0]);
    }

    return String(value);
  }, options);
}
