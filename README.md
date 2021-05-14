[![](https://vsmarketplacebadge.apphb.com/version-short/AbhishekPSR.run-me.svg)](https://marketplace.visualstudio.com/items?itemName=AbhishekPSR.run-me)


[![](https://vsmarketplacebadge.apphb.com/downloads/AbhishekPSR.run-me.svg)](https://marketplace.visualstudio.com/items?itemName=AbhishekPSR.run-me)


[![](https://vsmarketplacebadge.apphb.com/rating-short/AbhishekPSR.run-me.svg)](https://marketplace.visualstudio.com/items?itemName=AbhishekPSR.run-me)

  

# Run Me - Run file in Terminal


This is a Visual Studio Code Extension that will allow to execute a configurable command on selected file. 
Now you can execute your custom scripts/commands on files without leaving VS Code in a easier way.

> Fork From [Save and Run](https://marketplace.visualstudio.com/items?itemName=wk-j.save-and-run) Extension, but works with only single command/file Filter, hence simpler to configure and use.
  


## Features


- Configurable command

- Working Directory can also be configured

- Regex pattern matching for files that trigger commands running

- Silent Mode

- Run any `VS Code Commands / Extensions` before/after executing the command

> Any unsaved changes in the file will be saved before running the command



## Commands


The following commands are exposed in the command palette

-  `Run Me: Execute File`
  
The following keyboard shortcuts are exposed in the command palette

-  `ctrl` + `alt` + `e` / `cmd` + `alt` + `e` - to run the command on open file



## Configuration


The following attributes can be configured from Settings:

-  `Command` - *Command to be run* on selected file.

-  `FileFilter` - A regex for matching which files to run command on

-  `WorkDir` - *Working Directory* where the command should be run

-  `Silent.Enabled` - Doesn't show the terminal when the command is run.

-  `Silent.ShowConfirmation` - Show pop up to confirm that command is running (only when silent mode is enabled)

-  `Advanced.runVSCommandsBeforeRun` - VS Code Commands or Extension to be run before execution of command

-  `Advanced.runVSCommandsAfterRun` - VS Code Commands or Extension to be run after execution of command

  

## Placeholder Tokens
  

Command supports placeholders similar to tasks.json.

-  `${workspaceRoot}` - workspace root folder

-  `${workspaceFolder}` - the path of the folder opened in VS Code

-  `${file}` - path of file

-  `${relativeFile}` - relative path of file

-  `${fileBasename}` - file's basename

-  `${fileDirname}` - directory name of file

-  `${fileExtname}` - extension (including .) of file

-  `${fileBasenameNoExt}` - file's basename without extension

-  `${cwd}` - current working directory



## Environment Variable Tokens
  

-  `${env.Name}` - example: `${env.PATH}`

  

## Release Notes


### 0.0.1

- Initial release



## Credits


* Run Me follows some procedures similar to implementation in the following open source projects
	-  [`Save and Run`](https://github.com/wk-j/vscode-save-and-run)

* Icons made by [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com/)