import * as vscode from 'vscode';
import { generateAngularPath, createFolders, configFiles, verifyDir, createAngularFiles, verifyTerminal, configBaseFiles, createEnvironments } from './util';
import { FEATUREFOLDERS, BASEFOLDERS } from "./mocks/folders.mock";
import path = require('path');

export function activate(context: vscode.ExtensionContext) {
	let terminal!: vscode.Terminal;
	
	let disposable = vscode.commands.registerCommand("base-architecture-extension.createfeature", async (uri: vscode.Uri) => {
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
				createFolders(featureName, FEATUREFOLDERS);	

				progress.report({  increment: 30 });

				await new Promise(resolve => setTimeout(resolve, 1000));
				configFiles(context.extensionPath, featureName);

				progress.report({  increment: 50 });

				await new Promise(resolve => setTimeout(resolve, 1000));
				createAngularFiles(terminal, featureName);
				
				await new Promise(resolve => setTimeout(resolve, 1000));
				progress.report({ increment: 100 });

				vscode.window.showInformationMessage("Feature module created!");

			});
		}
	});
  	context.subscriptions.push(disposable);

	context.subscriptions.push(vscode.commands.registerCommand("base-architecture-extension.initarchitecture", async () =>{
		const uri =  vscode.workspace.workspaceFolders || [];
		 
		if(uri.length > 0) {
			const urlRoot = path.resolve(uri[0]?.uri.fsPath);
			const urlApp = path.join(urlRoot, "src", "app");

			vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				cancellable: false,
				title: 'Loading...'
			},async (progress) => {
					
				progress.report({  increment: 0 });
				
				await new Promise(resolve => setTimeout(resolve, 1000));
				createFolders(urlApp, BASEFOLDERS, false);

				progress.report({  increment: 10 });

				await new Promise(resolve => setTimeout(resolve, 1000));
				configBaseFiles(context.extensionPath, urlApp);

				progress.report({  increment: 10 });

				await new Promise(resolve => setTimeout(resolve, 1000));
				createEnvironments(context.extensionPath, urlRoot);

				await new Promise(resolve => setTimeout(resolve, 1000));
				progress.report({  increment: 100 });

				
				vscode.window.showInformationMessage("Sucess!");

			});
		}
	})); 
}

// This method is called when your extension is deactivated
export function deactivate() {}
