# To-do

Priority items are marked with an asterisk (\*).

## Logging

### General

- Find a way to log messages inside a file (check `tauri-plugin-log` crate/package)\*

## Automator

### Schema Saving System (SSS)

- Confirm delete before executing
- Load schema: Add message when no saved/valid schemas are found

### Steps

- Add types to variables (list and non-list)\*
- Add destruct list variable step\*
- Add keyboard combination press step (for example, `Ctrl + Shift + K`)\*
- Add while step
- Add error modal for running steps
- Add minimize app step
- Check UI responsiveness
- Write text: fix not writing latin characters (check `enigo` crate)
- Merge `AutomationCard` options in a menu
- Move mouse: Add "smooth movement" option
- Add notification when automation finishes run
- Add notification if automation run fails

## Settings Menu

### Automator

- Add option to disable notification when automation finishes or fails
- Move mouse: add "capture delay" setting (default to 5s)

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
