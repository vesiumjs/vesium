import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { VITEPRESS_ROOT_PATH } from '../path.ts';

const TSCONFIG_BUILD_PATH = path.resolve(VITEPRESS_ROOT_PATH, '../../tsconfig.build.json');

interface CachedState {
  builder: ts.EmitAndSemanticDiagnosticsBuilderProgram;
  /** Emit cache: source path -> (source mtime, emitted d.ts text); kept across rebuilds */
  emitCache: Map<string, { version: number; text: string }>;
}

let parsedConfig: ReturnType<typeof parseConfig> | undefined;
let options: ts.CompilerOptions | undefined;
let host: ts.CompilerHost | undefined;
let state: CachedState | undefined;
let tsconfigVersion: number | undefined;

/**
 * Source-file cache for the compiler host, keyed by file mtime. `createProgram`'s incremental
 * path detects changed files by comparing the host-returned instance with the previous
 * program's one, but the default host re-parses every file on each rebuild. Serving unmodified
 * files from this cache (the same trick `tsc --watch` relies on) makes a rebuild re-parse only
 * the file that actually changed.
 */
const sourceFileCache = new Map<string, { version: number; sourceFile: ts.SourceFile }>();

function parseConfig() {
  const config = ts.readConfigFile(TSCONFIG_BUILD_PATH, ts.sys.readFile);
  if (config.error) {
    throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
  }
  return ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(TSCONFIG_BUILD_PATH));
}

function getFileVersion(fileName: string): number | undefined {
  const stat = fs.statSync(fileName, { throwIfNoEntry: false });
  return stat?.isFile() ? stat.mtimeMs : undefined;
}

function createCachingHost(compilerOptions: ts.CompilerOptions): ts.CompilerHost {
  const base = ts.createIncrementalCompilerHost(compilerOptions);
  const originalGetSourceFile = base.getSourceFile!.bind(base);
  base.getSourceFile = (fileName, languageVersionOrOptions, onError, shouldCreateNewSourceFile) => {
    const version = getFileVersion(fileName);
    if (version === undefined) {
      return undefined;
    }
    const cached = sourceFileCache.get(fileName);
    if (cached && cached.version === version) {
      return cached.sourceFile;
    }
    const sourceFile = originalGetSourceFile(fileName, languageVersionOrOptions, onError, shouldCreateNewSourceFile);
    if (sourceFile) {
      sourceFileCache.set(fileName, { version, sourceFile });
    }
    return sourceFile;
  };
  return base;
}

/**
 * Whether any source file changed since the current builder was created. Scans the root file
 * list with cheap `stat` calls instead of rebuilding the program on every request.
 *
 * Deleted files are dropped from the source cache so a single rebuild absorbs the deletion;
 * files that reappear (or were created after startup and match the tsconfig globs) force a
 * rebuild so the program picks them up again.
 */
function isProgramStale(): boolean {
  for (const fileName of parsedConfig!.fileNames) {
    const version = getFileVersion(fileName);
    const cached = sourceFileCache.get(fileName);
    if (version === undefined) {
      if (cached) {
        sourceFileCache.delete(fileName);
        return true; // deleted — rebuild once without it
      }
      continue; // already absorbed, no longer relevant
    }
    if (!cached || cached.version !== version) {
      return true; // new, restored, or modified
    }
  }
  return false;
}

function getBuilder(): ts.EmitAndSemanticDiagnosticsBuilderProgram {
  const configVersion = getFileVersion(TSCONFIG_BUILD_PATH);
  if (configVersion !== undefined && tsconfigVersion !== undefined && configVersion !== tsconfigVersion) {
    // tsconfig.build.json changed — drop every cached artifact so the new options apply.
    parsedConfig = undefined;
    options = undefined;
    host = undefined;
    sourceFileCache.clear();
    state = undefined;
  }
  tsconfigVersion = configVersion;
  if (state && !isProgramStale()) {
    return state.builder;
  }
  parsedConfig ??= parseConfig();
  options ??= {
    ...parsedConfig.options,
    // Docs only display the `.d.ts` text, so skip declaration maps; `noEmit` is flipped back
    // on because the tsconfig is shared with `vue-tsc --build`, which must not emit files.
    declaration: true,
    emitDeclarationOnly: true,
    declarationMap: false,
    noEmit: false,
  };
  host ??= createCachingHost(options);
  state = {
    builder: ts.createEmitAndSemanticDiagnosticsBuilderProgram(
      parsedConfig.fileNames,
      options,
      host,
      state?.builder,
      undefined,
      undefined,
    ),
    emitCache: state?.emitCache ?? new Map(),
  };
  return state.builder;
}

/**
 * Returns the `.d.ts` declaration text for a source file, generated in-process from
 * `tsconfig.build.json` (no subprocess, no pre-generated `.types` directory).
 *
 * The builder is created lazily on the first request and rebuilt only when a source file or
 * the tsconfig changed since the last build; unchanged files are served from the emit cache,
 * so `dts` blocks always reflect the current source types in both `docs:dev` and `docs:build`.
 */
export function getDtsForSource(sourcePath: string): string | undefined {
  const version = getFileVersion(sourcePath);
  if (version === undefined) {
    return undefined;
  }
  let builder = getBuilder();
  const cached = state!.emitCache.get(sourcePath);
  if (cached && cached.version === version) {
    return cached.text;
  }
  let sourceFile = builder.getProgram().getSourceFile(sourcePath);
  if (!sourceFile) {
    // The file is not in the project snapshot — e.g. it was created after startup and the
    // tsconfig globs have not been re-read yet. Re-read them and rebuild once to pick it up.
    parsedConfig = parseConfig();
    options = undefined;
    host = undefined;
    sourceFileCache.clear();
    state = undefined;
    builder = getBuilder();
    sourceFile = builder.getProgram().getSourceFile(sourcePath);
  }
  if (!sourceFile) {
    return undefined;
  }
  try {
    const outputs: { name: string; text: string }[] = [];
    builder.emit(sourceFile, (name, text) => outputs.push({ name, text }), undefined, true);
    const text = outputs.find(file => file.name.endsWith('.d.ts'))?.text;
    if (text !== undefined) {
      state!.emitCache.set(sourcePath, { version, text });
    }
    return text;
  }
  catch {
    return undefined;
  }
}
