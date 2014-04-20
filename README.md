hungry-llama
============

Edmund is a Hungry Llama, but he is a very picky eater and his tates change very quickly. This is a multiplayer
web-based game where players need to quickly figure out what to feed Edmund.

Oh, and Edmund only communicates through digital logic diagrams. He's weird like that. 

(Hat tip to the Apple II game Rocky's Boots, one of my favorites.)

## Strike List
- Integration tests
- Don't send whole data blob with every change
- Randomize questions (?)
- Tutorial to walk through different symbols and how they work
- Timer on questions. Score based on time, not just first correct
- Don't send socket ids in game data
- Better way to send names into game other than the url
- Some sort of score reward/reveal moment
- Show that answer was wrong when submitted
- Use a SPA framework for the front-end: Backbone?
- Make a build process that produces production-ready minified and uglified files
- ~~Don't hard-code socket.io connection string in client~~