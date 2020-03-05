# spleeter tool and multitrack player integration


MT5 - A multitrack HTML5 Player
Online demo at http://mainline.i3s.unice.fr, give a look also at the user's manual and documentation.

MT5 is a sort of jukebox like multitrack player that has been developed for musicians who like to study a song track by track, or mute some tracks and play along it.

In order to run it, you will need nodeJS and some node modules. Just run npm install to download the modules.

Then look at the server.js file, you may want to change the default port value. Look at lines:

// Config
var PORT = process.env.PORT,
TRACKS_PATH = './client/multitrack/',
addrIP = process.env.IP;

And change port and IP, for example, use something like:
// Config
var PORT = '8081',
TRACKS_PATH = './client/multitrack/',
addrIP = '127.0.0.1';
Then run npm install and then node server.js and open http://localhost:8081 on a web browser. Then select any song in the drop down menu.

The multitrack songs are located in the directory assigned to TRACK_PATH, this is by default client/multitrack, and a multitrack song is just a directory with files in it, corresponding to the tracks. Just create new dir with mp3, ogg, wav files and reload the page, you will be able to play new songs.

MT5 has been kept simple. It runs on any modern browser, desktop or mobile, (that means all except IE which promised web audio support for its version 12).

The dirty work of managing the GUI, events, etc is done in sound.js... the main clock is in there too. We use requestAnimationFrame in order to measure time by intervals of about 1/60th of a second. Deltas are measured there in order to know "where we are in a song", and be able to jump or restart after a stop or a pause.

Web audio pausing or jumping in a song is way unnatural as the AudioBufferSource nodes can be started and stopped only once. This "fire and forget" approach chosen in web audio for these particular nodes means that we need to rebuild partially the web audio graph at each pause or jump. The play/pause/jump and building of the audio graph is done in the song.js file.

I will try to complete this documentation, do not hesitate to contact me at micbuffa at gmail dot com.

There is an online demo at http://mainline.i3s.unice.fr




<img src="https://github.com/deezer/spleeter/raw/master/images/spleeter_logo.png" height="80" />

[![CircleCI](https://circleci.com/gh/deezer/spleeter/tree/master.svg?style=shield)](https://circleci.com/gh/deezer/spleeter/tree/master) ![PyPI - Python Version](https://img.shields.io/pypi/pyversions/spleeter) [![PyPI version](https://badge.fury.io/py/spleeter.svg)](https://badge.fury.io/py/spleeter) [![Conda](https://img.shields.io/conda/vn/conda-forge/spleeter)](https://anaconda.org/conda-forge/spleeter) [![Docker Pulls](https://img.shields.io/docker/pulls/researchdeezer/spleeter)](https://hub.docker.com/r/researchdeezer/spleeter) [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/deezer/spleeter/blob/master/spleeter.ipynb) [![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/spleeter/community)



## About

**Spleeter** is the [Deezer](https://www.deezer.com/) source separation library with pretrained models
written in [Python](https://www.python.org/) and uses [Tensorflow](https://tensorflow.org/). It makes it easy
to train source separation model (assuming you have a dataset of isolated sources), and provides
already trained state of the art model for performing various flavour of separation :

* Vocals (singing voice) / accompaniment separation ([2 stems](https://github.com/deezer/spleeter/wiki/2.-Getting-started#using-2stems-model))
* Vocals / drums / bass / other separation ([4 stems](https://github.com/deezer/spleeter/wiki/2.-Getting-started#using-4stems-model))
* Vocals / drums / bass / piano / other separation ([5 stems](https://github.com/deezer/spleeter/wiki/2.-Getting-started#using-5stems-model))

2 stems and 4 stems models have state of the art performances on the [musdb](https://sigsep.github.io/datasets/musdb.html) dataset. **Spleeter** is also very fast as it can perform separation of audio files to 4 stems 100x faster than real-time when run on a GPU. 

We designed **Spleeter** so you can use it straight from [command line](https://github.com/deezer/spleeter/wiki/2.-Getting-started#usage)
as well as directly in your own development pipeline as a [Python library](https://github.com/deezer/spleeter/wiki/4.-API-Reference#separator). It can be installed with [Conda](https://github.com/deezer/spleeter/wiki/1.-Installation#using-conda),
with [pip](https://github.com/deezer/spleeter/wiki/1.-Installation#using-pip) or be used with
[Docker](https://github.com/deezer/spleeter/wiki/2.-Getting-started#using-docker-image).

## Quick start 

Want to try it out ? Just clone the repository and install a
[Conda](https://github.com/deezer/spleeter/wiki/1.-Installation#using-conda)
environment to start separating audio file as follows:

```bash
git clone https://github.com/Deezer/spleeter
conda install -c conda-forge spleeter
spleeter separate -i spleeter/audio_example.mp3 -p spleeter:2stems -o output
```
You should get two separated audio files (`vocals.wav` and `accompaniment.wav`)
in the `output/audio_example` folder.

### Windows users 

   It appears that sometimes the shortcut command `spleeter` does not work properly on windows. This is a known issue that we will hopefully fix soon. In the meantime replace `spleeter separate` by `python -m spleeter separate` in the above line and it should work.

For a more detailed documentation, please check the [repository wiki](https://github.com/deezer/spleeter/wiki)

Want to try it out but don't want to install anything ? we've setup a [Google Colab](https://colab.research.google.com/github/deezer/spleeter/blob/master/spleeter.ipynb)

## Reference


- Deezer Research - Source Separation Engine Story - deezer.io blog post:
    * [English version](https://deezer.io/releasing-spleeter-deezer-r-d-source-separation-engine-2b88985e797e)
    * [Japanese version](http://dzr.fm/splitterjp)
- [Music Source Separation tool with pre-trained models / ISMIR2019 extended abstract](http://archives.ismir.net/ismir2019/latebreaking/000036.pdf)

If you use **Spleeter** in your work, please cite:

```BibTeX
@misc{spleeter2019,
  title={Spleeter: A Fast And State-of-the Art Music Source Separation Tool With Pre-trained Models},
  author={Romain Hennequin and Anis Khlif and Felix Voituret and Manuel Moussallam},
  howpublished={Late-Breaking/Demo ISMIR 2019},
  month={November},
  note={Deezer Research},
  year={2019}
}
```

## License
The code of **Spleeter** is MIT-licensed.

## Disclaimer
If you plan to use Spleeter on copyrighted material, make sure you get proper authorization from right owners beforehand.

## Note
This repository include a demo audio file `audio_example.mp3` which is an excerpt
from Slow Motion Dream by Steven M Bryant (c) copyright 2011 Licensed under a Creative
Commons Attribution (3.0) license. http://dig.ccmixter.org/files/stevieb357/34740
Ft: CSoul,Alex Beroza & Robert Siekawitch

