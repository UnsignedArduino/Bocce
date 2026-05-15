namespace SpriteKind {
    export const Math = SpriteKind.create()
}
function throw_ball (ball: Sprite) {
    spriteutils.placeAngleFrom(
    ball,
    0,
    0,
    sprite_pallino_start_spot
    )
    throw_ball_ui_and_wait_for_stop(ball)
}
function get_out_team () {
    if (get_next_unthrown_ball(sprites_red_balls) == spriteutils.nullConsts(spriteutils.NullConsts.Null)) {
        if (get_next_unthrown_ball(sprites_green_balls) == spriteutils.nullConsts(spriteutils.NullConsts.Null)) {
            return ""
        } else {
            return "green"
        }
    }
    if (get_next_unthrown_ball(sprites_green_balls) == spriteutils.nullConsts(spriteutils.NullConsts.Null)) {
        return "red"
    }
    local_closest_ball2 = get_closest_ball_to_target(arrays.toConcated(sprites_red_balls, sprites_green_balls), sprite_pallino)
    if (sprites.readDataString(local_closest_ball2, "ball_type") == "red") {
        return "green"
    } else if (sprites.readDataString(local_closest_ball2, "ball_type") == "green") {
        return "red"
    }
    return ""
}
function place_other_balls_wrt_pallino () {
    spriteutils.placeAngleFrom(
    sprite_pallino_start_spot,
    spriteutils.angleFrom(sprite_pallino, sprite_pallino_start_spot),
    32,
    sprite_pallino_start_spot
    )
    spriteutils.placeAngleFrom(
    sprite_pallino_start_spot,
    spriteutils.angleFrom(sprite_pallino, sprite_pallino_start_spot) + spriteutils.consts(spriteutils.Consts.Pi) / 2,
    16,
    sprite_pallino_start_spot
    )
    brute_force_scatter_balls_around_point(sprites_red_balls, sprite_pallino_start_spot, 10)
    spriteutils.placeAngleFrom(
    sprite_pallino_start_spot,
    spriteutils.angleFrom(sprite_pallino, sprite_pallino_start_spot) - spriteutils.consts(spriteutils.Consts.Pi) / 2,
    32,
    sprite_pallino_start_spot
    )
    brute_force_scatter_balls_around_point(sprites_green_balls, sprite_pallino_start_spot, 10)
    spriteutils.placeAngleFrom(
    sprite_pallino_start_spot,
    spriteutils.angleFrom(sprite_pallino, sprite_pallino_start_spot) + spriteutils.consts(spriteutils.Consts.Pi) / 2,
    16,
    sprite_pallino_start_spot
    )
    spriteutils.placeAngleFrom(
    sprite_pallino_start_spot,
    spriteutils.angleFrom(sprite_pallino_start_spot, sprite_pallino),
    32,
    sprite_pallino_start_spot
    )
}
function balls_physics_tick_do_accelerations (state: number[][], dt: number) {
    state.push([0, 1])
    state.pop()
    // Apply friction from surface
    for (let local_state3 of state) {
        local_speed = Math.sqrt(local_state3[3] ** 2 + local_state3[4] ** 2)
        local_delta_v = get_friction_for_ball(local_state3) * dt
        if (local_speed > local_delta_v) {
            local_state3[3] = local_state3[3] * ((local_speed - local_delta_v) / local_speed)
            local_state3[4] = local_state3[4] * ((local_speed - local_delta_v) / local_speed)
        } else {
            local_state3[3] = 0
            local_state3[4] = 0
        }
    }
}
function throw_ball_ui_and_wait_for_stop (ball: Sprite) {
    local_current_balls_state = get_balls_states(sprites.allOfKind(SpriteKind.Player))
    throw_ball_ui(ball, local_current_balls_state)
    set_balls_states(sprites.allOfKind(SpriteKind.Player), local_current_balls_state)
    scene.cameraFollowSprite(ball)
    pause(100)
    while (!(are_all_balls_stopped(global_ball_state))) {
        pause(100)
    }
    sprites.setDataBoolean(ball, "ball_thrown", true)
}
function dist_between_balls (b1: number[], b2: number[]) {
    return Math.sqrt((b1[1] - b2[1]) ** 2 + (b1[2] - b2[2]) ** 2)
}
function hide_other_balls () {
    for (let local_ball of sprites_red_balls) {
        local_ball.setPosition(-999, -999)
    }
    for (let local_ball of sprites_green_balls) {
        local_ball.setPosition(-999, -999)
    }
    set_balls_states(sprites.allOfKind(SpriteKind.Player), get_balls_states(sprites.allOfKind(SpriteKind.Player)))
}
function get_friction_for_ball (ball: any[]) {
    if (tile_at_ball_is_one_of_these(ball, [
    assets.tile`myTile`,
    assets.tile`myTile0`,
    assets.tile`myTile1`,
    assets.tile`myTile2`,
    assets.tile`myTile3`,
    assets.tile`myTile4`,
    assets.tile`myTile5`,
    assets.tile`myTile6`,
    assets.tile`myTile7`,
    assets.tile`myTile8`,
    assets.tile`myTile9`,
    assets.tile`myTile10`,
    assets.tile`myTile11`,
    assets.tile`myTile12`,
    assets.tile`myTile13`
    ])) {
        return 25
    } else if (tile_at_ball_is_one_of_these(ball, [])) {
        return 75
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
        sprites.setDataBoolean(local_ball2, "ball_thrown", false)
    }
    sprites.setDataNumber(sprite_pallino, "ball_mass", 1)
    sprites.setDataNumber(sprite_pallino, "ball_radius", 3)
}
function tile_at_ball_is_one_of_these (ball: number[], tile_images: any[]) {
    for (let local_tile_image of tile_images) {
        if (tiles.tileAtLocationEquals(xy_to_loc(ball[1], ball[2]), local_tile_image)) {
            return true
        }
    }
    return false
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
        if (Math.abs(local_state3[3]) < 0.001) {
            local_state3[3] = 0
        }
        if (Math.abs(local_state3[4]) < 0.001) {
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
                throw_power = Math.constrain(throw_power + 0.1, 33, 100)
            } else if (controller.down.isPressed() && !(controller.up.isPressed())) {
                throw_power = Math.constrain(throw_power - 0.1, 33, 100)
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
function throw_pallino () {
    sprite_pallino_start_spot = sprites.create(img`
        . 
        `, SpriteKind.Player)
    spriteutils.placeAngleFrom(
    sprite_pallino_start_spot,
    0,
    0,
    sprite_pallino
    )
    if (DEBUG) {
        local_current_balls_state = get_balls_states(sprites.allOfKind(SpriteKind.Player))
        apply_ball_throw_to_state(0, 50, sprites.readDataNumber(sprite_pallino, "ball_id"), local_current_balls_state)
        set_balls_states(sprites.allOfKind(SpriteKind.Player), local_current_balls_state)
        scene.cameraFollowSprite(sprite_pallino)
        pause(100)
        while (!(are_all_balls_stopped(global_ball_state))) {
            pause(100)
        }
        sprites.setDataBoolean(sprite_pallino, "ball_thrown", true)
    } else {
        throw_ball_ui_and_wait_for_stop(sprite_pallino)
    }
}
function are_all_balls_stopped (state: number[][]) {
    state.push([0, 1])
    state.pop()
    // Apply velocity
    for (let local_state3 of state) {
        if (local_state3[3] != 0 || local_state3[4] != 0) {
            return false
        }
    }
    return true
}
function get_next_unthrown_ball (balls: any[]) {
    for (let local_ball5 of balls) {
        if (!(sprites.readDataBoolean(local_ball5, "ball_thrown"))) {
            return local_ball5
        }
    }
    return spriteutils.nullConsts(spriteutils.NullConsts.Null)
}
function these_sprites_are_overlapping (sprites2: any[]) {
    for (let index3 = 0; index3 <= sprites2.length - 1; index3++) {
        for (let index4 = 0; index4 <= sprites2.length - 1 - (index3 + 1); index4++) {
            local_sprite_a = sprites2[index3]
            local_sprite_b = sprites2[index4 + (index3 + 1)]
            if (local_sprite_a.overlapsWith(local_sprite_b)) {
                return true
            }
        }
    }
    return false
}
spriteutils.createRenderable(1, function (screen2) {
    if (!(spriteutils.isDestroyed(ball_to_draw_throw_ui_around))) {
        screen2.drawLine(ball_to_draw_throw_ui_around.x - scene.cameraProperty(CameraProperty.Left) - 0, ball_to_draw_throw_ui_around.y - scene.cameraProperty(CameraProperty.Top) - 0, ball_to_draw_throw_ui_around.x - scene.cameraProperty(CameraProperty.Left) - 0 + throw_power / 2 * Math.cos(throw_angle * -1), ball_to_draw_throw_ui_around.y - scene.cameraProperty(CameraProperty.Top) - 0 + throw_power / 2 * Math.sin(throw_angle * -1), 15)
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
function brute_force_scatter_balls_around_point (balls: Sprite[], math_sprite: Sprite, try_radius: number) {
    balls.push(sprites.create(img`
        . 
        `, SpriteKind.Math))
    sprites.destroy(balls.pop())
    for (let local_ball4 of balls) {
        spriteutils.placeAngleFrom(
        local_ball4,
        randint(0, 628318) / 100000,
        randint(0, try_radius),
        math_sprite
        )
    }
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
function get_closest_ball_to_target (balls: Sprite[], target: Sprite) {
    local_closest_dist = 10000000000000000
    local_closest_ball = balls[0]
    for (let local_ball6 of balls) {
        if (spriteutils.distanceBetween(target, local_ball6) < local_closest_dist) {
            local_closest_dist = spriteutils.distanceBetween(sprite_pallino, local_ball6)
            local_closest_ball = local_ball6
        }
    }
    return local_closest_ball
}
function count_points () {
    local_points = 1
    local_ball_list = arrays.copy(arrays.toConcated(sprites_red_balls, sprites_green_balls))
    local_closest_ball3 = get_closest_ball_to_target(local_ball_list, sprite_pallino)
    local_scoring_team = sprites.readDataString(local_closest_ball3, "ball_type")
    local_ball_list.removeAt(local_ball_list.indexOf(local_closest_ball3))
    while (true) {
        local_closest_ball3 = get_closest_ball_to_target(local_ball_list, sprite_pallino)
        if (sprites.readDataString(local_closest_ball3, "ball_type") != local_scoring_team) {
            break;
        } else {
            local_ball_list.removeAt(local_ball_list.indexOf(local_closest_ball3))
            local_points += 1
        }
    }
    return [local_scoring_team, text.stringify(local_points)]
}
function xy_to_loc (x: number, y: number) {
    return tiles.getTileLocation(Math.floor(x / tiles.tileWidth()), Math.floor(y / tiles.tileWidth()))
}
let local_scoring_team = ""
let local_closest_ball3: Sprite = null
let local_ball_list: any[] = []
let local_points = 0
let local_closest_ball: Sprite = null
let local_closest_dist = 0
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
let local_sprite_b: Sprite = null
let local_sprite_a: Sprite = null
let local_states2: number[][] = []
let throw_power = 0
let throw_angle = 0
let ball_to_draw_throw_ui_around: Sprite = null
let local_state: number[] = []
let local_states: number[][] = []
let local_next_ball_id = 0
let local_sprite_ball: Sprite = null
let global_ball_state: number[][] = []
let local_current_balls_state: number[][] = []
let local_delta_v = 0
let local_speed = 0
let sprite_pallino: Sprite = null
let local_closest_ball2: Sprite = null
let sprite_pallino_start_spot: Sprite = null
let local_out_team = ""
let sprites_green_balls: Sprite[] = []
let sprites_red_balls: Sprite[] = []
let DEBUG = false
DEBUG = false
timer.background(function () {
    tiles.loadMap(tiles.createSmallMap(tilemap`level2`))
    init_balls()
    hide_other_balls()
    throw_pallino()
    place_other_balls_wrt_pallino()
    throw_ball(get_next_unthrown_ball(sprites_red_balls))
    throw_ball(get_next_unthrown_ball(sprites_green_balls))
    while (true) {
        local_out_team = get_out_team()
        if (local_out_team == "red") {
            throw_ball(get_next_unthrown_ball(sprites_red_balls))
        } else if (local_out_team == "green") {
            throw_ball(get_next_unthrown_ball(sprites_green_balls))
        } else {
            break;
        }
        pause(0)
    }
    game.splash(count_points())
})
game.onUpdate(function () {
    global_ball_state = get_balls_states(sprites.allOfKind(SpriteKind.Player))
    for (let index = 0; index < 4; index++) {
        balls_physics_tick(global_ball_state, 1 / 30 / 4)
    }
    set_balls_states(sprites.allOfKind(SpriteKind.Player), global_ball_state)
})
