import type { Value } from '@wyw-in-js/processor-utils';

export default function hasLinariaPreval(exports: unknown): exports is {
  __linariaPreval: Record<string, () => Value> | null | undefined;
} {
  if (!exports || typeof exports !== 'object') {
    return false;
  }

  return '__linariaPreval' in exports;
}
