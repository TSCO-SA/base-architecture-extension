"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const util_1 = require("./util");
const path = require("path");
function activate(context) {
    let terminal;
    let disposable = vscode.commands.registerCommand("base-architecture-extension.createfeature", async (uri) => {
        const url = (0, util_1.generateAngularPath)(uri.fsPath);
        const featureName = await vscode.window.showInputBox({
            placeHolder: "Create Feature",
            prompt: "Digite o nome do Feature",
            value: url,
            valueSelection: [url.length, url.length]
        });
        if (featureName === '') {
            vscode.window.showErrorMessage('A Feature name is mandatory to execute this action');
        }
        if (featureName !== undefined) {
            if ((0, util_1.verifyDir)(featureName)) {
                vscode.window.showInformationMessage("Feature is already created!");
                return;
            }
            terminal = (0, util_1.verifyTerminal)(terminal);
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                cancellable: false,
                title: 'Creating feature...'
            }, async (progress) => {
                progress.report({ increment: 0 });
                await new Promise(resolve => setTimeout(resolve, 1000));
                (0, util_1.createFeatureFolders)(featureName);
                progress.report({ increment: 30 });
                await new Promise(resolve => setTimeout(resolve, 1000));
                (0, util_1.configFiles)(context.extensionPath, featureName);
                progress.report({ increment: 50 });
                await new Promise(resolve => setTimeout(resolve, 1000));
                (0, util_1.createAngularFiles)(terminal, featureName);
                await new Promise(resolve => setTimeout(resolve, 1000));
                progress.report({ increment: 100 });
                vscode.window.showInformationMessage("Feature module created!");
            });
        }
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(vscode.commands.registerCommand("base-architecture-extension.initarchitecture", async () => {
        const uri = vscode.workspace.workspaceFolders || [];
        const url = path.join(uri[0]?.uri.fsPath, "src", "app");
        if (url !== "") {
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                cancellable: false,
                title: 'Loading...'
            }, async (progress) => {
                progress.report({ increment: 0 });
                await new Promise(resolve => setTimeout(resolve, 1000));
                (0, util_1.createArchFolders)(url);
                progress.report({ increment: 50 });
                await new Promise(resolve => setTimeout(resolve, 1000));
                (0, util_1.configBaseFiles)(context.extensionPath, url);
                await new Promise(resolve => setTimeout(resolve, 1000));
                progress.report({ increment: 100 });
                vscode.window.showInformationMessage("Sucess!");
            });
        }
    }));
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map