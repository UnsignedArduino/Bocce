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
        return 50
    } else if (tiles.tileAtLocationEquals(xy_to_loc(ball[1], ball[2]), assets.tile`myTile0`)) {
        return 100
    } else {
        return 1e+22
    }
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
function throw_ball_ui (ball: Sprite, states: any[]) {
    ball_to_draw_throw_ui_around = ball
    throw_angle = 0
    throw_power = 50
    while (true) {
        if (controller.A.isPressed()) {
            break;
        } else if (controller.B.isPressed()) {
            scene.cameraFollowSprite(null)
            if (controller.up.isPressed() && !(controller.down.isPressed())) {
                scene.centerCameraAt(scene.cameraProperty(CameraProperty.X) + 0, scene.cameraProperty(CameraProperty.Y) + -1)
            } else if (controller.down.isPressed() && !(controller.up.isPressed())) {
                scene.centerCameraAt(scene.cameraProperty(CameraProperty.X) + 0, scene.cameraProperty(CameraProperty.Y) + 1)
            }
            if (controller.left.isPressed() && !(controller.right.isPressed())) {
                scene.centerCameraAt(scene.cameraProperty(CameraProperty.X) + -1, scene.cameraProperty(CameraProperty.Y) + 0)
            } else if (controller.right.isPressed() && !(controller.left.isPressed())) {
                scene.centerCameraAt(scene.cameraProperty(CameraProperty.X) + 1, scene.cameraProperty(CameraProperty.Y) + 0)
            }
        } else {
            scene.cameraFollowSprite(ball)
            if (controller.up.isPressed() && !(controller.down.isPressed())) {
                throw_power = Math.constrain(throw_power + 0.1, 10, 100)
            } else if (controller.down.isPressed() && !(controller.up.isPressed())) {
                throw_power = Math.constrain(throw_power - 0.1, 10, 100)
            }
            if (controller.left.isPressed() && !(controller.right.isPressed())) {
                throw_angle += spriteutils.consts(spriteutils.Consts.Pi) / 180
            } else if (controller.right.isPressed() && !(controller.left.isPressed())) {
                throw_angle += spriteutils.consts(spriteutils.Consts.Pi) / -180
            }
        }
        pause(0)
    }
    ball_to_draw_throw_ui_around = spriteutils.nullConsts(spriteutils.NullConsts.Null)
    apply_ball_throw_to_state(throw_angle, throw_power, sprites.readDataNumber(ball, "ball_id"), states)
    scene.cameraFollowSprite(null)
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
spriteutils.createRenderable(1, function (screen2) {
    if (!(spriteutils.isDestroyed(ball_to_draw_throw_ui_around))) {
        screen2.drawLine(ball_to_draw_throw_ui_around.x - scene.cameraProperty(CameraProperty.Left) - 1, ball_to_draw_throw_ui_around.y - scene.cameraProperty(CameraProperty.Top) - 1, ball_to_draw_throw_ui_around.x - scene.cameraProperty(CameraProperty.Left) - 1 + throw_power / 2 * Math.cos(throw_angle * -1), ball_to_draw_throw_ui_around.y - scene.cameraProperty(CameraProperty.Top) + throw_power / 2 * Math.sin(throw_angle * -1), 15)
    }
})
function apply_ball_throw_to_state (angle: number, power2: number, ball_id: number, states: number[][]) {
    states.push([0, 1])
    states.pop()
    for (let local_state5 of states) {
        if (local_state5[0] == ball_id) {
            local_state6 = local_state5
            break;
        }
    }
    local_state6[3] = power2 * Math.cos(angle * -1)
    local_state6[4] = power2 * Math.sin(angle * -1)
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
    return tiles.getTileLocation(Math.floor(x / 16), Math.floor(y / 16))
}
let local_global_state: number[][] = []
let local_dot = 0
let local_M = 0
let local_overlap = 0
let local_dist = 0
let local_dist_sq = 0
let local_dy = 0
let local_dx = 0
let local_ball_b: number[] = []
let local_ball_a: number[] = []
let local_state6: number[] = []
let local_states2: number[][] = []
let throw_power = 0
let throw_angle = 0
let ball_to_draw_throw_ui_around: Sprite = null
let local_state: number[] = []
let local_states: number[][] = []
let sprites_green_balls: Sprite[] = []
let local_next_ball_id = 0
let local_sprite_ball: Sprite = null
let sprite_pallino: Sprite = null
let local_delta_v = 0
let local_speed = 0
let sprites_red_balls: Sprite[] = []
let local_current_balls_state: number[][] = []
timer.background(function () {
    tiles.setCurrentTilemap(tilemap`level1`)
    init_balls()
    for (let local_ball of sprites.allOfKind(SpriteKind.Player)) {
        local_ball.setPosition(randint(16, 144), randint(16, 104))
    }
    local_current_balls_state = get_balls_states(sprites.allOfKind(SpriteKind.Player))
    throw_ball_ui(sprites_red_balls[0], local_current_balls_state)
    set_balls_states(sprites.allOfKind(SpriteKind.Player), local_current_balls_state)
})
game.onUpdate(function () {
    local_global_state = get_balls_states(sprites.allOfKind(SpriteKind.Player))
    for (let index = 0; index < 4; index++) {
        balls_physics_tick(local_global_state, 1 / 30 / 4)
    }
    set_balls_states(sprites.allOfKind(SpriteKind.Player), local_global_state)
})
