declare module 'node:test' {
  type TestCallback = () => void | Promise<void>

  export default function test(name: string, fn: TestCallback): void
}

declare module 'node:assert/strict' {
  export function equal(
    actual: unknown,
    expected: unknown,
    message?: string,
  ): void

  const assert: {
    equal(actual: unknown, expected: unknown, message?: string): void
  }

  export default assert
}

interface ImportMetaEnv {
  readonly DEV: boolean
}

interface ImportMeta {
  readonly env?: ImportMetaEnv
}
