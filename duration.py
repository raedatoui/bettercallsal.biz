import requests
from requests.exceptions import HTTPError
import subprocess
import ffmpy
import json

URL = 'http://bettercallsal.fit'


def get_duration(source_path):
    tup_resp = ffmpy.FFprobe(
        inputs={source_path: None},
        global_options=[
            '-v', 'quiet',
            '-print_format', 'json',
            '-show_entries',
            'format=duration']
    ).run(stdout=subprocess.PIPE)

    meta = json.loads(tup_resp[0].decode('utf-8'))
    dur = meta['format']['duration']
    print(source_path, dur)
    return dur


def main():
    try:
        response = requests.get('{}/videos.json'.format(URL))
        response.raise_for_status()
        videos = response.json()
        for key, value in videos.items():
            for video in value:
                source_path = '{}/videos/{}'.format(URL, video['file'])
                video['duration'] = get_duration(source_path)
        with open('videos.json', 'w') as outfile:
            json.dump(videos, outfile)
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')


if __name__ == "__main__":
    main()
