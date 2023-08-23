import * as vscode from 'vscode';
import { generateAngularPath, createFolders, configFiles } from './util';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('base-file-extension.helloWorld', async (uri: vscode.Uri) => {

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
			vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				cancellable: false,
				title: 'Creating feature...'
			},async (progress) => {
				
				progress.report({  increment: 0 });
			
				await new Promise(resolve => setTimeout(resolve, 1000));
				createFolders(featureName);	

				progress.report({  increment: 50 });

				await new Promise(resolve => setTimeout(resolve, 1000));
				configFiles(context.extensionPath, featureName);
			
				progress.report({ increment: 100 });

				vscode.window.showInformationMessage("Feature module created!");

			});
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
