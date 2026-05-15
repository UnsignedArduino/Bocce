function init_balls () {
    sprite_pallino = sprites.create(img`
        . 1 1 1 . 
        1 1 1 1 1 
        1 1 1 1 1 
        1 1 1 1 1 
        . 1 1 1 . 
        `, SpriteKind.Player)
    sprites.setDataString(sprite_pallino, "ball_type", "pallino")
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
        sprites_green_balls.push(local_sprite_ball)
    }
    local_next_ball_id = 0
    for (let local_ball2 of sprites.allOfKind(SpriteKind.Player)) {
        sprites.setDataNumber(local_ball2, "ball_id", local_next_ball_id)
        local_next_ball_id += 1
        sprites.setDataNumber(local_ball2, "ball_vx", 0)
        sprites.setDataNumber(local_ball2, "ball_vy", 0)
        sprites.setDataNumber(local_ball2, "ball_mass", 3)
        sprites.setDataNumber(local_ball2, "ball_radius", 5)
    }
    sprites.setDataNumber(sprite_pallino, "ball_mass", 1)
    sprites.setDataNumber(sprite_pallino, "ball_radius", 3)
}
function get_balls_states (balls: any[]) {
    local_ball_states = []
    for (let local_ball of balls) {
        local_ball_state = [
        sprites.readDataNumber(local_ball, "ball_id"),
        local_ball.x,
        local_ball.y,
        sprites.readDataNumber(local_ball, "ball_vx"),
        sprites.readDataNumber(local_ball, "ball_vy"),
        sprites.readDataNumber(local_ball, "ball_mass"),
        sprites.readDataNumber(local_ball, "ball_radius")
        ]
        local_ball_states.push(local_ball_state)
    }
    return local_ball_states
}
function balls_physics_tick (state: any[], dt: number) {
    return state
}
function set_balls_states (balls: any[], new_states: number[][]) {
    new_states.push([0, 1])
    new_states.pop()
    for (let local_ball_state2 of new_states) {
        for (let local_ball3 of balls) {
            if (sprites.readDataNumber(local_ball3, "ball_id") == local_ball_state2[0]) {
                local_ball3.setPosition(local_ball_state2[1], local_ball_state2[2])
                sprites.setDataNumber(local_ball3, "ball_vx", local_ball_state2[3])
                sprites.setDataNumber(local_ball3, "ball_vy", local_ball_state2[4])
                sprites.setDataNumber(local_ball3, "ball_mass", [0][5])
                sprites.setDataNumber(local_ball3, "ball_radius", local_ball_state2[6])
                break;
            }
        }
    }
}
let local_ball_state: number[] = []
let local_ball_states: number[][] = []
let local_next_ball_id = 0
let local_sprite_ball: Sprite = null
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
let local_next_balls_state = balls_physics_tick(local_current_balls_state, 1)
set_balls_states(sprites.allOfKind(SpriteKind.Player), local_next_balls_state)
