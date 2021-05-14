import * as vscode from "vscode";

export class Executor {

    public static runInTerminal(cmdStr: string, workDir: string, terminal: string): void {
        // retrieve configured values
        var silentEnabled = vscode.workspace.getConfiguration("runMe").silent.enabled;
        var confirmationMessage = vscode.workspace.getConfiguration("runMe").silent.showConfirmation;

        if (this.terminals[terminal] === undefined || vscode.window.terminals.indexOf(this.terminals[terminal]) === -1) {
            this.getTerminal(workDir, terminal);
        }

        if ((!workDir) && workDir !== this.prevWorkDir) {
            // close the previous terminal
            this.terminals[terminal].sendText("exit");
            this.getTerminal(workDir, terminal);
        }

        if (workDir !== this.prevWorkDir) {
            this.navigateToWorkDir(workDir, terminal);
        }

        if (!silentEnabled) {
            // don't show terminal in silent mode
            this.terminals[terminal].show();
            if (confirmationMessage) {
                // show info message in silent mode for confirmation
                vscode.window.showInformationMessage('Started running command on selected file');
            }
        }

        this.terminals[terminal].sendText(cmdStr);

        setTimeout(() => {
            vscode.commands.executeCommand("workbench.action.focusActiveEditorGroup");
        }, 100);
    }

    public static onDidCloseTerminal(closedTerminal: vscode.Terminal): void {
        var consoleExists = false;
        vscode.window.terminals.slice().reverse().forEach(terminalItem => {
            if (terminalItem.name === closedTerminal.name) {
                consoleExists = true;
                // this.terminals[closedTerminal.name] = terminalItem;
            }
        });
        if (!consoleExists) {
            delete this.terminals[closedTerminal.name];
            console.log("Closed: " + closedTerminal.name);
        }
    }

    private static terminals: { [id: string]: vscode.Terminal } = {};
    private static prevWorkDir = "";

    private static navigateToWorkDir(workDir: string, terminal: string) {
        this.prevWorkDir = workDir;
        if (workDir) {
            this.terminals[terminal].sendText("cd \"" + workDir + "\"");
        }
    }
    private static getTerminal(workDir: string, terminal: string) {

        const newTerminal = vscode.window.createTerminal(terminal);
        this.terminals[terminal] = newTerminal;
        this.navigateToWorkDir(workDir, terminal);
    }
}