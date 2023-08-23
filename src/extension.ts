import * as vscode from 'vscode';
import { generateAngularPath, createFolders, configFiles, verifyDir, createModules, verifyTerminal } from './util';

export function activate(context: vscode.ExtensionContext) {
	let terminal!: vscode.Terminal;
	
	let disposable = vscode.commands.registerCommand("base-file-extension.createfeature", async (uri: vscode.Uri) => {
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
			if(verifyDir(featureName)) {
				vscode.window.showInformationMessage("Feature is already created!");
				return;
			}

			terminal = verifyTerminal(terminal);

			vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				cancellable: false,
				title: 'Creating feature...'
			},async (progress) => {
					
				progress.report({  increment: 0 });
				
				await new Promise(resolve => setTimeout(resolve, 1000));
				createFolders(featureName);	

				progress.report({  increment: 30 });

				await new Promise(resolve => setTimeout(resolve, 1000));
				configFiles(context.extensionPath, featureName);

				progress.report({  increment: 50 });

				await new Promise(resolve => setTimeout(resolve, 1000));
				createModules(terminal, featureName);
				
				await new Promise(resolve => setTimeout(resolve, 1000));
				progress.report({ increment: 100 });

				vscode.window.showInformationMessage("Feature module created!");

			});
		}
	});

  	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
