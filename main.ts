function balls_physics_tick_do_accelerations (state: number[][], dt: number) {
    state.push([0, 1])
    state.pop()
    // Apply friction from surface
    for (let local_state3 of state) {
        local_speed = Math.sqrt(local_state3[3] ** 2 + local_state3[4] ** 2)
        if (local_speed > 0) {
            local_delta_v = get_friction_for_ball(local_state3) * dt
            if (local_speed < local_delta_v) {
                local_state3[3] = 0
                local_state3[4] = 0
            } else {
                local_state3[3] = local_state3[3] * ((local_speed - local_delta_v) / local_speed)
                local_state3[4] = local_state3[4] * ((local_speed - local_delta_v) / local_speed)
            }
        }
    }
}
function dist_between_balls (b1: number[], b2: number[]) {
    return Math.sqrt((b1[1] - b2[1]) ** 2 + (b1[2] - b2[2]) ** 2)
}
function get_friction_for_ball (ball: number[]) {
    if (tiles.tileAtLocationEquals(xy_to_loc(ball[1], ball[2]), assets.tile`myTile`)) {
        return 200
    } else {
    	
    }
    return 0
}
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
    local_states = []
    for (let local_ball of balls) {
        local_state = [
        sprites.readDataNumber(local_ball, "ball_id"),
        local_ball.x,
        local_ball.y,
        sprites.readDataNumber(local_ball, "ball_vx"),
        sprites.readDataNumber(local_ball, "ball_vy"),
        sprites.readDataNumber(local_ball, "ball_mass"),
        sprites.readDataNumber(local_ball, "ball_radius")
        ]
        local_states.push(local_state)
    }
    return local_states
}
function balls_physics_tick (state: number[][], dt: number) {
    // Adding and removing a number array from state will force the compiler to realize that state is number[][]
    state.push([0, 1])
    state.pop()
    balls_physics_tick_do_accelerations(state, dt)
    balls_physics_tick_do_velocities(state, dt)
    balls_physics_tick_do_collisions(state, dt)
    return state
}
function balls_physics_tick_do_velocities (state: number[][], dt: number) {
    state.push([0, 1])
    state.pop()
    // Apply velocity
    for (let local_state3 of state) {
        local_state3[1] = local_state3[1] + local_state3[3] * dt
        local_state3[2] = local_state3[2] + local_state3[4] * dt
        if (Math.abs(local_state3[3]) < 0.0001) {
            local_state3[3] = 0
        }
        if (Math.abs(local_state3[4]) < 0.0001) {
            local_state3[4] = 0
        }
    }
}
function copy_balls_state (state: number[][]) {
    state.push([0, 1])
    state.pop()
    local_states2 = [[0, 1]]
    local_states2.pop()
    for (let local_state4 of state) {
        local_states2.push(arrays.copy(local_state4))
    }
    return local_states2
}
// 0: id
// 1: x
// 2: y
// 3: vx
// 4: vy
// 5: mass
// 6: radius
function set_balls_states (balls: any[], new_states: number[][]) {
    new_states.push([0, 1])
    new_states.pop()
    for (let local_state2 of new_states) {
        for (let local_ball3 of balls) {
            if (sprites.readDataNumber(local_ball3, "ball_id") == local_state2[0]) {
                local_ball3.setPosition(local_state2[1], local_state2[2])
                sprites.setDataNumber(local_ball3, "ball_vx", local_state2[3])
                sprites.setDataNumber(local_ball3, "ball_vy", local_state2[4])
                sprites.setDataNumber(local_ball3, "ball_mass", local_state2[5])
                sprites.setDataNumber(local_ball3, "ball_radius", local_state2[6])
                break;
            }
        }
    }
}
function balls_physics_tick_do_collisions (state: number[][], dt: number) {
    state.push([0, 1])
    state.pop()
    for (let index = 0; index <= state.length - 1; index++) {
        for (let index2 = 0; index2 <= state.length - 1 - (index + 1); index2++) {
            local_ball_a = state[index]
            local_ball_b = state[index2 + (index + 1)]
            local_dx = local_ball_a[1] - local_ball_b[1]
            local_dy = local_ball_a[2] - local_ball_b[2]
            local_dist_sq = local_dx ** 2 + local_dy ** 2
            if (local_dist_sq < (local_ball_a[6] + local_ball_b[6]) ** 2) {
                local_dist = Math.sqrt(local_dist_sq)
                local_overlap = local_ball_a[6] + local_ball_b[6] - local_dist
                local_M = local_ball_a[5] + local_ball_b[5]
                local_ball_a[1] = local_ball_a[1] + local_dx / local_dist * (local_overlap * (local_ball_b[5] / local_M))
                local_ball_a[2] = local_ball_a[2] + local_dy / local_dist * (local_overlap * (local_ball_b[5] / local_M))
                local_ball_b[1] = local_ball_b[1] - local_dx / local_dist * (local_overlap * (local_ball_a[5] / local_M))
                local_ball_b[2] = local_ball_b[2] - local_dy / local_dist * (local_overlap * (local_ball_a[5] / local_M))
                local_dot = (local_ball_a[3] - local_ball_b[3]) * (local_ball_a[1] - local_ball_b[1]) + (local_ball_a[4] - local_ball_b[4]) * (local_ball_a[2] - local_ball_b[2])
                local_ball_a[3] = local_ball_a[3] - 2 * local_ball_b[5] / local_M * (local_dot / local_dist_sq * (local_ball_a[1] - local_ball_b[1]))
                local_ball_a[4] = local_ball_a[4] - 2 * local_ball_b[5] / local_M * (local_dot / local_dist_sq * (local_ball_a[2] - local_ball_b[2]))
                local_ball_b[3] = local_ball_b[3] + 2 * local_ball_a[5] / local_M * (local_dot / local_dist_sq * (local_ball_a[1] - local_ball_b[1]))
                local_ball_b[4] = local_ball_b[4] + 2 * local_ball_a[5] / local_M * (local_dot / local_dist_sq * (local_ball_a[2] - local_ball_b[2]))
            }
        }
    }
}
function xy_to_loc (x: number, y: number) {
    return tiles.getTileLocation(Math.floor(y / tiles.getTileLocation(0, 0).right), Math.floor(x / tiles.getTileLocation(0, 0).right))
}
let local_dot = 0
let local_M = 0
let local_overlap = 0
let local_dist = 0
let local_dist_sq = 0
let local_dy = 0
let local_dx = 0
let local_ball_b: number[] = []
let local_ball_a: number[] = []
let local_states2: number[][] = []
let local_state: number[] = []
let local_states: number[][] = []
let local_next_ball_id = 0
let local_sprite_ball: Sprite = null
let local_delta_v = 0
let local_speed = 0
let sprites_green_balls: Sprite[] = []
let sprites_red_balls: Sprite[] = []
let sprite_pallino: Sprite = null
tiles.setCurrentTilemap(tilemap`level1`)
init_balls()
sprite_pallino.setPosition(88, 58)
sprites_red_balls[0].setPosition(45, 44)
sprites_red_balls[1].setPosition(18, 18)
sprites_red_balls[2].setPosition(28, 29)
sprites_red_balls[3].setPosition(40, 11)
sprites_green_balls[0].setPosition(42, 80)
sprites_green_balls[1].setPosition(46, 90)
sprites_green_balls[2].setPosition(60, 95)
sprites_green_balls[3].setPosition(65, 82)
sprites.setDataNumber(sprites_red_balls[0], "ball_vx", -75)
sprites.setDataNumber(sprites_red_balls[0], "ball_vy", -75)
let local_current_balls_state = get_balls_states(sprites.allOfKind(SpriteKind.Player))
for (let index = 0; index < 100; index++) {
    balls_physics_tick(local_current_balls_state, 0.01)
    set_balls_states(sprites.allOfKind(SpriteKind.Player), local_current_balls_state)
    pause(10)
}
