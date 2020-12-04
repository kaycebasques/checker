# checker

A link and ID checker.

## Usage

1. Put the pages you want to check in `targets.txt`. One URL per line.
   `all.txt` contains all of the old site's URLs, except 
   `https://developer.chrome.com` has been replaced with `http://localhost:8080`.
1. Run `npm i`.
1. Run `npm run check`.

The results will be written to `report.txt`.