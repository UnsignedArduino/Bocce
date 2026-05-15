function tick_balls_states (ball_states: any[], dt: number) {
    return [0]
}
function init_balls () {
    local_next_ball_id = 0
    sprite_pallino = sprites.create(img`
        . 1 1 1 . 
        1 1 1 1 1 
        1 1 1 1 1 
        1 1 1 1 1 
        . 1 1 1 . 
        `, SpriteKind.Player)
    sprites.setDataString(sprite_pallino, "ball_type", "pallino")
    sprites.setDataNumber(sprite_pallino, "ball_mass", 0.333)
    sprites.setDataNumber(sprite_pallino, "ball_id", local_next_ball_id)
    local_next_ball_id += 1
    sprites_red_balls = []
    for (let index = 0; index < 4; index++) {
        local_sprite_ball = sprites.create(img`
            . . 2 2 2 2 2 . . 
            . 2 2 2 2 2 2 2 . 
            2 2 2 2 2 2 2 2 2 
            2 2 2 2 2 2 2 2 2 
            2 2 2 2 2 2 2 2 2 
            2 2 2 2 2 2 2 2 2 
            2 2 2 2 2 2 2 2 2 
            . 2 2 2 2 2 2 2 . 
            . . 2 2 2 2 2 . . 
            `, SpriteKind.Player)
        sprites.setDataString(local_sprite_ball, "ball_type", "red")
        sprites.setDataNumber(local_sprite_ball, "ball_mass", 1)
        sprites.setDataNumber(local_sprite_ball, "ball_id", local_next_ball_id)
        sprites_red_balls.push(local_sprite_ball)
        local_next_ball_id += 1
    }
    sprites_green_balls = []
    for (let index = 0; index < 4; index++) {
        local_sprite_ball = sprites.create(img`
            . . 7 7 7 7 7 . . 
            . 7 7 7 7 7 7 7 . 
            7 7 7 7 7 7 7 7 7 
            7 7 7 7 7 7 7 7 7 
            7 7 7 7 7 7 7 7 7 
            7 7 7 7 7 7 7 7 7 
            7 7 7 7 7 7 7 7 7 
            . 7 7 7 7 7 7 7 . 
            . . 7 7 7 7 7 . . 
            `, SpriteKind.Player)
        sprites.setDataString(local_sprite_ball, "ball_type", "green")
        sprites.setDataNumber(local_sprite_ball, "ball_mass", 1)
        sprites.setDataNumber(local_sprite_ball, "ball_id", local_next_ball_id)
        sprites_green_balls.push(local_sprite_ball)
        local_next_ball_id += 1
    }
}
function get_balls_states (balls: any[]) {
    local_ball_states = [0]
    return local_ball_states
}
function set_balls_states (balls: any[], new_state: any[]) {
	
}
let local_ball_states: number[] = []
let local_sprite_ball: Sprite = null
let local_next_ball_id = 0
let sprites_green_balls: Sprite[] = []
let sprites_red_balls: Sprite[] = []
let sprite_pallino: Sprite = null
tiles.setCurrentTilemap(tilemap`level1`)
init_balls()
sprite_pallino.setPosition(88, 58)
sprites_red_balls[0].setPosition(45, 44)
sprites_red_balls[1].setPosition(12, 26)
sprites_red_balls[2].setPosition(28, 29)
sprites_red_balls[3].setPosition(40, 11)
sprites_green_balls[0].setPosition(42, 80)
sprites_green_balls[1].setPosition(46, 90)
sprites_green_balls[2].setPosition(60, 95)
sprites_green_balls[3].setPosition(65, 82)
let local_current_balls_state = get_balls_states(sprites.allOfKind(SpriteKind.Player))
let local_next_balls_states = tick_balls_states(local_current_balls_state, 1)
set_balls_states(sprites.allOfKind(SpriteKind.Player), local_next_balls_states)
