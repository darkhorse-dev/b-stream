#!/bin/bash

FILENAME=$1
FILEEXT=$2

if ! type "ffmpeg" > /dev/null; then
  exit 1
fi

echo "\n=> Executing ffmpeg -i $FILENAME.$FILEEXT -vn -ar 44100 -ac 2 -ab 192k -f $FILEEXT $FILENAME-converted.$FILEEXT"

ffmpeg -i $FILENAME.$FILEEXT -vn -ar 44100 -ac 2 -ab 192k -f $FILEEXT $FILENAME-converted.$FILEEXT

exit 0
