import * as vscode from 'vscode';
import * as path from 'path';
import { Executor } from './executor';
import fs = require("fs");


const missingConfigMessage = "command not configured under settings";
const fileFilterMismatchMessage = "File did not match the fileFilter configured under settings";
const incorrectWorkDirMessage = "configured Work Dir doesn't exist";



export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "run-me" is now active!');

	// listener on terminal close
	if ("onDidCloseTerminal" in vscode.window as any) {
		(vscode.window as any).onDidCloseTerminal((terminal: vscode.Terminal) => {
			Executor.onDidCloseTerminal(terminal);
		});
	}
	let disposable = vscode.commands.registerCommand('run-me.execute-file', () => {
		// The code you place here will be executed every time your command is executed

		if (vscode.window.activeTextEditor) {

			// retrieve configured values
			var fileFilter = vscode.workspace.getConfiguration("runMe").fileFilter;
			var workDir = vscode.workspace.getConfiguration("runMe").workDir;

			var cmdStr = vscode.workspace.getConfiguration("runMe").command;
			var commandsBeforeRun: string[][] = [];
			var commandsAfterRun: string[][] = [];
			try {
				commandsBeforeRun = vscode.workspace.getConfiguration("runMe").advanced.runVSCommandsBeforeRun;
			} catch (err) { }
			try {
				commandsAfterRun = vscode.workspace.getConfiguration("runMe").advanced.runVSCommandsAfterRun;
			} catch (err) { }


			if (cmdStr === "") {
				infoMessageWithSettingOption(missingConfigMessage);
				return;
			}
			// Variables to store the data related to open/active file
			var currentlyOpenDocument = vscode.window.activeTextEditor.document;
			var currentlyOpenFileUri = currentlyOpenDocument.uri;
			var filePath = currentlyOpenDocument.fileName;
			var fileBasename = path.basename(filePath);

			if (fileFilter === "" || fileBasename.match(fileFilter) != null) {

				var fileDirname = path.dirname(filePath);
				var extName = path.extname(fileBasename);
				var fileBasenameNoExt = path.basename(currentlyOpenDocument.fileName, extName);

				var rootFolder = vscode.workspace.getWorkspaceFolder(currentlyOpenFileUri);
				var workspaceFolders = vscode.workspace.workspaceFolders;

				// replace the variable in command string
				if (rootFolder) {
					var root = rootFolder.uri.path;
					var relativeFile = "." + currentlyOpenDocument.fileName.replace(root, "");
					cmdStr = cmdStr.replace(/\${relativeFile}/g, relativeFile);
					cmdStr = cmdStr.replace(/\${workspaceFolder}/g, root);
				}
				cmdStr = cmdStr.replace(/\${file}/g, `${filePath}`);
				if (workspaceFolders) {
					cmdStr = cmdStr.replace(/\${workspaceRoot}/g, `${workspaceFolders[0]}`);
				}
				cmdStr = cmdStr.replace(/\${fileBasename}/g, `${fileBasename}`);
				cmdStr = cmdStr.replace(/\${fileDirname}/g, `${fileDirname}`);
				cmdStr = cmdStr.replace(/\${fileExtname}/g, `${extName}`);
				cmdStr = cmdStr.replace(/\${fileBasenameNoExt}/g, `${fileBasenameNoExt}`);
				cmdStr = cmdStr.replace(/\${cwd}/g, `${process.cwd()}`);

				// replace environment variables ${env.Name}
				cmdStr = cmdStr.replace(/\${env\.([^}]+)}/g, (sub: string, envName: string) => {
					return process.env[envName];
				});

				//save the file before running
				currentlyOpenDocument.save();

				// run configured vs code commands
				runVSCommands(commandsBeforeRun);

				// check if work directory exists
				if (workDir && !fs.existsSync(workDir)) {
					errorMessageWithSettingOption(incorrectWorkDirMessage);
					return;
				}

				// run the command in terminal window
				const terminalName = "Run " + fileBasename;
				Executor.runInTerminal(cmdStr, workDir, terminalName);

				// run configured vs code commands
				runVSCommands(commandsAfterRun);

			}
			else {
				infoMessageWithSettingOption(fileFilterMismatchMessage);
			}
		}

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }


function infoMessageWithSettingOption(message: string) {
	const options = ['open settings'];
	vscode.window.showInformationMessage(message, ...options).then(selection => {
		if (selection === 'open settings') {
			// open extension settings on click of button
			runVSCommand(['workbench.action.openSetting', '@ext:AbhishekPSR.run-me']);
		}
	});
}

function errorMessageWithSettingOption(message: string) {
	const options = ['open settings'];
	vscode.window.showErrorMessage(message, ...options).then(selection => {
		if (selection === 'open settings') {
			// open extension settings on click of button
			runVSCommand(['workbench.action.openSettings', '@ext:AbhishekPSR.run-me']);
		}
	});
}

// run a single VS Code Command
function runVSCommand(cmdArr: string[]) {
	if (cmdArr.length < 1) {
		return;
	}
	var commandName = cmdArr[0];
	if (cmdArr.length > 1) {
		var inputs = cmdArr.slice(1);
		vscode.commands.executeCommand(commandName, inputs);
	}
	else {
		vscode.commands.executeCommand(commandName);
	}
}

// run a list of VS Code Commands
function runVSCommands(commands: string[][]) {
	commands.forEach((element: string[]) => {
		runVSCommand(element);
	});
}