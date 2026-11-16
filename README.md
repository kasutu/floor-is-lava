# SE_finalProject
final project for SE first sem

# Floor is lava
> A platform game that the floor is lava. Hop on to platforms and climb to the top score !

-------------------------------------------------------

# SE GAME DEV NOTES
## NOTES
> lets use the standard loop of airbnb
> for (let i = 0; i < range; i += 1) {}

### steps in committing in git and updating the code
- `git add .`
- `git commit -m "Description"`
- `git push origin main`
 
### more git tutorials here
> https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository


## Resources 
- TEST WEBPAGE: https://pzyco20.github.io/SE_finalProject/
- Github repository: https://github.com/PZYCO20/SE_finalProject.git
- Game dev 101: https://www.youtube.com/watch?v=eI9idPTT0c4&t=5966s
- canvas game tutorial: https://spicyyoghurt.com/tutorials/html5-javascript-game-development/create-a-smooth-canvas-animation
- Simple 2d game engine: https://developer.ibm.com/tutorials/wa-build2dphysicsengine/
- Jump physics: https://2dengine.com/?p=platformers
- Keypress: https://medium.com/analytics-vidhya/implementing-keyboard-controls-or-shortcuts-in-javascript-82e11fccbf0c
- obstacle collision ideas: https://stackoverflow.com/questions/34607871/how-to-create-obstacles-in-canvas
- sprite editor: https://www.piskelapp.com/

# The Team
### Jerome Cabugwason
  - core code and optimization design
  - graphics

### Jaycelle Arianne Basco
  - Idea
  - Story
  - Code
### Roel Adrian Celebria
  - Graphics
  - Code
  - Story

## Technical knowledge
- projectiles
- collision
- 1 player
- canvas
- movements using trigonometry

## Code structure
All tunable values (physics, sizes, speeds, asset paths, key bindings, debug flags) live in `src/config.js`.

```
src/
  config.js            all game settings
  main.js              composition root: builds and wires everything
  Game.js              game state machine + update/render orchestration
  core/GameLoop.js     fixed-timestep loop
  input/               keyboard -> controls/actions
  audio/               sound wrapper
  assets/              image loading
  storage/             high score persistence
  entities/            Player, Platform, Lava, Background (state + drawing)
  physics/             PlayerController (movement), CollisionSystem
  systems/             PlatformField (spawn/move/cull), Score
  graphics/            Viewport (resolution scaling), sprite animation + drawing
  ui/                  Hud (canvas text), Menu (DOM overlay), Fullscreen
  debug/               optional debug overlays (CONFIG.debug.enabled)
```

### Resolution independence
All gameplay math runs in a fixed logical world of `CONFIG.world` (1000×500) units.
`Viewport` scales that world to fit the window or the full screen (letterboxed, sharp on
high-DPI screens). Changing the screen size never changes physics, so don't use
`canvas.width`/`canvas.height` in game code. Use `CONFIG.world` instead.

The game uses ES modules, so serve it over HTTP (`npm start`) rather than opening the file directly.
