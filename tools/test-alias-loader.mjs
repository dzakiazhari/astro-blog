import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const ALIAS_PREFIX = "@/";
const BUILD_ROOT = path.resolve(process.cwd(), ".tmp/test-build");

export function resolve(specifier, context, defaultResolve) {
  if (specifier.startsWith(ALIAS_PREFIX)) {
    const relativePath = specifier.slice(ALIAS_PREFIX.length);
    const resolvedPath = pathToFileURL(
      path.resolve(BUILD_ROOT, `${relativePath}.js`),
    ).href;

    return defaultResolve(resolvedPath, context, defaultResolve);
  }

  if (
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    !path.extname(specifier)
  ) {
    const parentDirectory = context.parentURL
      ? path.dirname(fileURLToPath(context.parentURL))
      : process.cwd();
    const resolvedPath = pathToFileURL(
      path.resolve(parentDirectory, `${specifier}.js`),
    ).href;

    return defaultResolve(resolvedPath, context, defaultResolve);
  }

  return defaultResolve(specifier, context, defaultResolve);
}
