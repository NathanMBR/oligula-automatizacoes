# To-do

Priority items are marked with an asterisk (\*).

## Logging

### General

- Find a way to log messages inside a file (check `tauri-plugin-log` crate/package)\*

## Automator

### General

- Migrate completely from crate `autopilot` to `enigo`

### Schema Saving System (SSS)

- Confirm delete before executing
- Load schema: Add message when no saved/valid schemas are found

### Runner

- Add highlight to running step
- Add error modal if automation run fails
- Add notification if automation run fails
- Add notification when automation finishes run

### Steps

- Add variable: add support to list variables
- Add while step
- Add join string step
- Add minimize app step
- Check UI responsiveness
- Merge `AutomationCard` options in a menu
- Add "duplicate step" option
- Move mouse: Add "smooth movement" option
- Keyboard press: add support to manually insert key

## Settings Menu

### Automator

- Add option to disable notification when automation finishes or fails
- Move mouse: add "capture delay" setting (default to 5s)
- Minimum delay between steps should be 0.1s

## Spreadsheet Formatter

### General

- Read data from base spreadsheet
- Transform into target stylesheet layout

## Inmetro Seal Generator

### General

- Discuss implementation details
- Select logos and text to be inserted in the seal
- Compact the seal the most possible
- Add the most possible number of seals in an A4 paper sheet
- Print paper sheet (if possible)
- Generate `.png` / `.docx` / `.pdf` file
