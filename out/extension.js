"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const util_1 = require("./util");
function activate(context) {
    let disposable = vscode.commands.registerCommand('base-file-extension.helloWorld', async (uri) => {
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
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                cancellable: false,
                title: 'Creating feature...'
            }, async (progress) => {
                progress.report({ increment: 0 });
                await new Promise(resolve => setTimeout(resolve, 1000));
                (0, util_1.createFolders)(featureName);
                progress.report({ increment: 50 });
                await new Promise(resolve => setTimeout(resolve, 1000));
                (0, util_1.configFiles)(context.extensionPath, featureName);
                progress.report({ increment: 100 });
                vscode.window.showInformationMessage("Feature module created!");
            });
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map