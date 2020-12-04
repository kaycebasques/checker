# checker

A link checker.

## Usage

1. Put the pages you want to check in `targets.txt`. One URL per line.
   `all.txt` contains all of the old site's URLs, except 
   `https://developer.chrome.com` has been replaced with `http://localhost:8080`.
1. `npm i`
1. `npm run check`

The results will be written to `report.txt` as JSON.
Needed redirects will be written to `redirects.txt`.