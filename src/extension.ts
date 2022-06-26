// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import {
  filterProcesses,
  FilterProcessOptions,
  Process,
} from "./filterProcesses";

interface MatchProcessOptions extends FilterProcessOptions {
  select?:
    | "any" // select any match
    | "first" // select first match
    | "last" // select last match
    | "user" // always prompt user to select an entry
    | "auto"; // select if exactly one match, otherwise prompt user
}

interface ProcessPickItem extends vscode.QuickPickItem {
  process: Process;
}

async function matchProcess(opts: MatchProcessOptions) {
  const processes = await filterProcesses(opts);

  const items = processes.map<ProcessPickItem>((process) => ({
    label: `${process.name} (${process.pid})`,
    description: process.commandline,
    process,
  }));
  let result: ProcessPickItem | undefined;
  switch (opts.select) {
    case "any":
    case "first":
      result = items[0];
      break;
    case "last":
      result = items.slice(-1)[0];
      break;
    default:
    case "auto":
      if (items.length === 1) {
        result = items[0];
        break;
      }
    case "user": {
      result = await vscode.window.showQuickPick(items);
      break;
    }
  }

  return result ? String(result.process.pid) : "";
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("pick-process-ex.match", matchProcess)
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
