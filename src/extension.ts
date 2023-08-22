import * as vscode from "vscode";
import { generateAngularPath, createFolders, configFiles } from "./util";

export function activate(context: vscode.ExtensionContext) {
  let terminal!: vscode.Terminal;
  let disposableTerminal!: vscode.Terminal;
  let disposable = vscode.commands.registerCommand(
    "base-file-extension.helloWorld",
    async (uri: vscode.Uri) => {
      const url = generateAngularPath(uri.fsPath);

      const featureName = await vscode.window.showInputBox({
      	placeHolder: "Create Feature",
      	prompt: "Digite o nome do Feature",
      	value: url,
      	valueSelection: [url.length, url.length]
      });

      if(featureName === ''){
      	vscode.window.showErrorMessage('A Feature name is mandatory to execute this action');
      }

      if(featureName !== undefined){
      	createFolders(featureName);
      	configFiles(context.extensionPath, featureName);
      	console.log(featureName);
      }

      if (terminal) {
        if (terminal.processId === disposableTerminal.processId) {
          terminal = vscode.window.createTerminal("Ex #1");
        }
        terminal.sendText("echo 'Sent text immediately after creating'");
      } else {
        terminal = vscode.window.createTerminal("Ex #1");
        terminal.sendText("echo 'Hello world!' \n echo 'Hello worl2!'");
      }

      vscode.window.onDidCloseTerminal((e) => {
        disposableTerminal = e;
      });
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
