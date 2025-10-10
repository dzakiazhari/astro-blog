import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./tools/test-alias-loader.mjs", pathToFileURL("./"));
