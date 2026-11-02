# Ocean waves

`ocean-waves.mp3` is the unmodified owner-supplied recording:
`/Users/phyothihaoo/Downloads/solarmusic-ocean-waves-112906.mp3`.

The source is 789,942 bytes, approximately 24.69 seconds, stereo MP3 at 44.1 kHz.
The source filename is retained here for provenance; no separate license grant or
creator identity is inferred from the filename.

`ocean-sound.js` fetches the file only after the visitor enables Ocean sound.
It creates an in-memory loop with a 0.9-second equal-power tail/head crossfade,
then plays it through Web Audio gain control at 30% by default. Playback fades
in over 1.8 seconds and out over 0.35 seconds. The source file stays unchanged.

Volume is saved locally; enabled sound is never restored automatically. Theme
changes, hidden tabs and page exit stop playback and release the audio context.
Sound controls are independent of decorative-motion preferences and the radio.
