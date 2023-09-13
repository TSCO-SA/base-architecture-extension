import * as vscode from 'vscode';
var spawn = require('child_process').spawn;

let currentTerminal!: vscode.Terminal;

const verifyTerminal = () => {
    if (!currentTerminal || currentTerminal.exitStatus) {
        currentTerminal = vscode.window.createTerminal("Base File: Create");
    }
};

export const executeScript = (script: string) => {
    verifyTerminal();

    currentTerminal.show();
    currentTerminal.sendText(script);
};

export const executeWithCallBack = (script: string, baseUrl: string, callback: () => void) => {
    const child = spawn(script, {shell: true, cwd: baseUrl});

    child.stdout.on('data', function (data: any) {
        callback();
    });
};