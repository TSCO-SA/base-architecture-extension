import * as vscode from 'vscode';
import { 
	generateAngularPath,  
	verifyDir,
} from './helpers/util';
import { 
	createArchFolders,
	createFeatureFolders,
	configFiles,
	createAngularFeatureFiles, 
	createAngularArchFiles,
	configBaseFiles, 
	loadExtensionConfig,
	createEnvironments,
	copyBaseFiles,
	configDockerFiles,
	installDependencies
} from './helpers/functions';
import { ARCHFOLDERS, ASSETSFOLDERS } from './mocks/folders.mock';
import path = require('path');

export function activate(context: vscode.ExtensionContext) {
	
	let disposable = vscode.commands.registerCommand("base-architecture-extension.createfeature", async (uri: vscode.Uri) => {
		const url = generateAngularPath(uri.fsPath);

		const featureName = await vscode.window.showInputBox({
			placeHolder: "Create Feature",
			prompt: "Write the Feature name",
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

			vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				cancellable: false,
				title: 'Creating feature...'
			},async (progress) => {
					
				progress.report({  increment: 0 });
				
				await new Promise(resolve => setTimeout(resolve, 1000));

				createFeatureFolders(featureName);	

				progress.report({  increment: 30 });

				await new Promise(resolve => setTimeout(resolve, 1000));
				configFiles(context.extensionPath, featureName);

				progress.report({  increment: 50 });

				await new Promise(resolve => setTimeout(resolve, 1000));
				createAngularFeatureFiles(featureName);
				
				await new Promise(resolve => setTimeout(resolve, 1000));
				progress.report({ increment: 100 });

				vscode.window.showInformationMessage("Feature module created!");

			});
		}
	});
  	context.subscriptions.push(disposable);

	context.subscriptions.push(vscode.commands.registerCommand("base-architecture-extension.initarchitecture", async () =>{
		const res = await loadExtensionConfig();
		if(res.isErr()){
			vscode.window.showErrorMessage(res.err());
			return;
		}
		const config = res.ok();

		const urlRoot = config.ngWorkspacePath;
		const urlApp = path.join(urlRoot, "src", "app"); 
		const urlAssets = path.join(urlRoot, "src", "assets");		
		let projectName: string;

		if( urlApp !== "" &&  urlAssets !== "" ){
			vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				cancellable: false,
				title: 'Loading...'
			},async (progress) => {
			
				vscode.window
				.showInformationMessage("Do you want to configure docker compose?", "Yes", "No")
				.then( async (answer) => {
					if (answer === "Yes") {
							projectName = await vscode.window.showInputBox({
							placeHolder: "Project name",
							prompt: "Write the project name",
						}) || "";

						if(projectName === ''){
							vscode.window.showErrorMessage('A Project name is mandatory to execute this action');
						} else
						{
							configDockerFiles(context.extensionPath, urlRoot, projectName);
						}
					}
				});
					
				progress.report({  increment: 0 });
				
				await new Promise(resolve => setTimeout(resolve, 1000));
				createArchFolders(urlApp, ARCHFOLDERS);

				progress.report({  increment: 10 });

				await new Promise(resolve => setTimeout(resolve, 1000));
				configBaseFiles(context.extensionPath, urlApp);

				progress.report({  increment: 10 });

				await new Promise(resolve => setTimeout(resolve, 1000));
				createAngularArchFiles();

				progress.report({  increment: 10 });

				await new Promise(resolve => setTimeout(resolve, 1000));
				createEnvironments(context.extensionPath, urlRoot);

				progress.report({  increment: 10 });

				await new Promise(resolve => setTimeout(resolve, 1000));
				createArchFolders(urlAssets, ASSETSFOLDERS);

				progress.report({  increment: 10 });

				await new Promise(resolve => setTimeout(resolve, 1000));
				copyBaseFiles(context.extensionPath, urlRoot);

				progress.report({  increment: 10 });

				await new Promise(resolve => setTimeout(resolve, 1000));
				installDependencies(context.extensionPath, urlRoot);

				await new Promise(resolve => setTimeout(resolve, 3000));
				progress.report({  increment: 100 });

				vscode.window.showInformationMessage("Base Architecture configurated with sucess!");

			});
		}
	})); 
}

// This method is called when your extension is deactivated
export function deactivate() {}
