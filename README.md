# pick-process-ex README

This extension simply provides a filterable process picker for debugging commands.

## Usage

In `launch.json` add a custom inputs entry:
```json
    "inputs": [
        {
            "id": "MatchRunDllExe",
            "type": "command",
            "command": "pick-process-ex.match",
            "args": {
                // only programs matching this name:
                "program": "rundll.exe",
                // only if commandline arguments include:
                "commandline" : "MyDll.dll",
                // select automatically if there is only one match, otherwise show the user the list to pick from
                "select": "auto" 
            }
        }
    ]
```

And use it in any processId argument in another launch configuration:

```json
    {
        "name": "(Windows) Attach",
        "type": "cppvsdbg",
        "request": "attach",
        "processId": "${input:MatchRunDllExe}" // id matches id of input listed above
    },
```

## Configuration

Currently, the custom command `pick-process-ex.match` accepts the following optional properties:

```json
{
    // determines what process should be returned by the command
    "select": "auto | any | first | last | user",
        // "auto" - select if exactly one match, otherwise prompt user
        // "any" - select any match
        // "first" - select first match
        // "last" - select last match
        // "user" - always prompt user with all matches
    // filters only processes with names matching exactly this name (case-insensitive)
    "program": "SomeProgram.exe",
    // filters only processes that include the provided text
    "commandline": "--debug-me"
}
```
