# Flashpoint Metadata Editor
This is a simple web interface for creating and saving metadata edits of Flashpoint entries.

## Prerequisites
* [Golang](https://go.dev/) (should be added to PATH environment variable)
* [flashpoint.sqlite](http://infinity.unstable.life/Flashpoint/Data/flashpoint.sqlite) (must be placed in the `backend` directory)
* [selection.json](https://cdn.discordapp.com/attachments/516027726851735632/1058873965742936164/selection.json) (must be placed in the `static` directory)

## Build Instructions
1. Download the source code
2. Open the command prompt in the `backend` directory
3. Run the `go build` command
4. Once finished building, open `metaeditor.exe` to start the server