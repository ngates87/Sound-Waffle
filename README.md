# Sound-Waffle
A cross platform sound cue program, with theatrical applications in mind.

**About:** 

Based off a similar app for iOS devices, http://www.soundcueapp.com/, this program aims to address some of the shortcomings of the app. Such As:

- Only being able to play one cue at a time
- Having to use iTunes to load music into the app 
    - which often means I would have to wait until the next day before I could get clips people brought in loaded on my iPad/iPhone
- limited to only iOS


This project is aimed towards working on the Raspberry Pi as a way to create a fairly inexpesnive sound cue play back program. Because it is meant to work on the Raspberry Pi, it also mean it will work on almost any OS. 

This project is built on the Electorn/NodeJs framework, this allowed for a fairly easy way to create a rich UI with easy and familar web technologies. 

Technologies Used:
- NodeJs
- Electron
- Typescript - code
- gulp - build

**GOALS**
- Performant (Raspberry Pi 3 min requirements)
- Super Simple to use
- Simiple code base easy to read, understand and update
- Only most common/useful features
- # Useful to the Theatre Community

Current Features:
- Play n - number of cues at the same time
- set fade time 0-20.0 secs
- Cues can be
    - single song 
    - or playlist (so you never have to leave the app)


Future Features (goals):
- Remote triggering
   - either wired or wireless
       - tried amazon dash, too slow
- Import/Export
    - Collate audio files, and zip up, adjust file paths as needed
        - make it easy to create show on one computer, and easy import on a another.
- Easing Functions
    - currently using jquery, could easly import jquery-ui to add different easing options
- Improve shuffle (start in shuffle mode)
- Unit Testing...
    - the least fun, but probably good idea part. 
- Dmx/Midi support?
- Other?

- 
