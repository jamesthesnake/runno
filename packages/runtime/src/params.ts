import { RunnoProvider } from "./provider";
import { Runtime, Syntax } from "./types";

function isTruthy(param: string | null | undefined) {
  if (param === null || param === undefined) {
    return false;
  }

  if (param.toLowerCase() == "false") {
    return false;
  }

  if (!isNaN(param as any)) {
    return !!parseInt(param, 10);
  }

  return true;
}

function runtimeToSyntax(runtime: string | undefined | null): Syntax {
  if (runtime == "python") {
    return "python";
  }
  if (runtime == "quickjs") {
    return "js";
  }
  if (runtime == "sqlite") {
    return "sql";
  }
  return undefined;
}

export function handleParams(provider: RunnoProvider) {
  const hash = window.location.hash.slice(1);
  const search = window.location.search.slice(1);
  const urlParams = `${hash}&${search}`;
  const params = new URLSearchParams(urlParams);

  const code = params.get("code") || "";
  const command = params.get("command");
  const runtimeName = params.get("runtime");
  const showEditor = isTruthy(params.get("editor"));

  if (showEditor) {
    provider.showEditor();
    provider.setEditorProgram(
      runtimeToSyntax(runtimeName),
      runtimeName as Runtime,
      code
    );
  }

  if (runtimeName) {
    provider.interactiveRunCode(runtimeName as Runtime, code);
  } else if (command) {
    provider.interactiveUnsafeCommand(command, {
      code: {
        name: "code",
        content: code,
      },
    });
  } else {
    // No command was specified
    return;
  }
}
