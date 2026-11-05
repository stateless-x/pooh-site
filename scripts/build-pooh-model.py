"""
Builds the Pooh bear mascot as a 3D model (GLB) for use with three.js.

WHY THIS EXISTS: the mascot only existed as 2D clay-style renders, so there
was nothing a 3D scene could load. This script is the editable master: the
bear is generated from the numbers below rather than sculpted by hand, so a
proportion can be changed here and the model rebuilt, the same way
public/brand/pooh-mark.svg is the editable master for the logo.

Run (needs Blender in /Applications; written against Blender 5.0):
  npm run model

It also renders the poster the home hero shows before, or instead of, the
live 3D scene. Add `-- --preview <dir>` to the Blender command to also render
check images.

The bear follows the logo master and the home hero illustration: a gumdrop
body, two round ears, round charcoal glasses, a red scarf, and intentionally
no face, nose, or mouth.

The parts that should move are separate nodes with their pivot where the
joint is, so the page can animate them without a skeleton:

  Pooh
    Body                    static (body, feet, tail)
    ArmL, ArmR              pivot at the shoulder
    Scarf                   static wrap and knot
      ScarfTailA, ScarfTailB  pivot at the knot
    Head                    pivot at the neck, hidden inside the scarf
      Glasses

There are no textures and no UVs. Each part is a flat colour, and the clay
look comes from the low-frequency lumps pushed into the surface plus the
material chosen in three.js, which keeps the file small.

Outputs to src/assets/models/ so the file is content-hashed and long-cached by
Astro's bundler rather than served unhashed from public/.
"""

import math
import os
import sys

import bmesh
import bpy
from mathutils import Matrix, Vector, noise

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "assets", "models", "pooh.glb")
POSTER = os.path.join(ROOT, "src", "assets", "images", "illustrations", "pooh-stage-poster.webp")

# The poster must line up with the first frame of the live scene, so these
# numbers are a contract with src/lib/pooh-stage: same camera, same lights,
# same contact shadow. Written in three.js terms (Y up, facing +Z).
STAGE_CAMERA = (0, 1.9, 6.1)
STAGE_TARGET = (0, 0.9, 0)
STAGE_FOV = 20  # vertical, degrees, on a square stage
STAGE_SUN = (-2, 4, 3)
STAGE_SHADOW = (0.62, 0.50, 0.10)  # radius across, radius deep, opacity

# Colours are the brand tokens from DESIGN.md. The bear is a shade warmer than
# the page cream so it does not dissolve into a cream background.
CREAM = "#FCF1DE"
SCARF = "#D92731"
GLASSES = "#282722"

# Blender is Z up and the bear faces -Y, which the exporter turns into the
# glTF convention of Y up, facing +Z (toward a default three.js camera).
# The bear's own left is +X.
HEAD_CENTER = Vector((0, 0, 1.0))
HEAD_RADII = Vector((0.50, 0.45, 0.42))
HEAD_LOW = 0.75  # the lower half runs long so there is no neck pinch
HEAD_POWER = 0.9
NECK = Vector((0, 0, 0.70))

BODY_CENTER = Vector((0, 0, 0.38))
BODY_RADII = Vector((0.58, 0.50, 0.57))
BODY_LOW = 0.44
BODY_POWER = 0.92

SCARF_Z = 0.675
SCARF_RX = 0.50
SCARF_RY = 0.445
KNOT_ANGLE = math.radians(-55)  # front, toward the bear's left


def srgb(hex_colour):
    """Hex sRGB to the linear RGBA that Blender materials expect."""
    def lin(c):
        c /= 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    h = hex_colour.lstrip("#")
    return (*[lin(int(h[i:i + 2], 16)) for i in (0, 2, 4)], 1.0)


def material(name, hex_colour, roughness):
    mat = bpy.data.materials.new(name)
    if bpy.app.version < (5, 0):
        mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = srgb(hex_colour)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = 0.0
    return mat


def surface(center, radii, low, power, direction):
    """A point on a rounded blob: an ellipsoid whose lower half can be longer
    than its upper half, squared off slightly when power is below 1."""
    d = Vector(direction).normalized()
    p = Vector([math.copysign(abs(c) ** power, c) for c in d])
    rz = radii.z if p.z >= 0 else low
    return center + Vector((p.x * radii.x, p.y * radii.y, p.z * rz))


def blob(bm, center, radii, low=None, power=1.0, subdivisions=4, matrix=None):
    low = radii.z if low is None else low
    verts = bmesh.ops.create_icosphere(bm, subdivisions=subdivisions, radius=1.0)["verts"]
    for v in verts:
        co = surface(Vector((0, 0, 0)), radii, low, power, v.co)
        v.co = center + (matrix @ co if matrix else co)


def tube(bm, points, section, hint, minor=8, closed=False):
    """Sweeps an elliptical section along a path. `section` is the half size
    across and along `hint`, the direction the section's second axis leans to."""
    points = [Vector(p) for p in points]
    n = len(points)
    rings = []
    for i, p in enumerate(points):
        before = points[(i - 1) % n] if closed else points[max(i - 1, 0)]
        after = points[(i + 1) % n] if closed else points[min(i + 1, n - 1)]
        tangent = (after - before).normalized()
        side = tangent.cross(hint).normalized()
        up = side.cross(tangent).normalized()
        rings.append([
            bm.verts.new(p + side * math.cos(a) * section[0] + up * math.sin(a) * section[1])
            for a in (math.tau * j / minor for j in range(minor))
        ])
    for i in range(n if closed else n - 1):
        a, b = rings[i], rings[(i + 1) % n]
        for j in range(minor):
            k = (j + 1) % minor
            bm.faces.new((a[j], a[k], b[k], b[j]))
    if not closed:
        bm.faces.new(rings[0])
        bm.faces.new(rings[-1])


def bezier(p0, p1, p2, steps):
    return [
        (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t ** 2 * p2
        for t in (i / steps for i in range(steps + 1))
    ]


def lumps(mesh, amplitude, frequency, seed):
    """Pushes the surface in and out a little so it reads as hand-shaped clay
    rather than a perfect computer sphere."""
    offset = Vector((seed * 7.13, seed * 3.71, seed * 1.37))
    moved = [
        v.co + v.normal * noise.noise(v.co * frequency + offset) * amplitude
        for v in mesh.vertices
    ]
    for v, co in zip(mesh.vertices, moved):
        v.co = co


def make_object(name, bm, mat, parent=None, pivot=Vector((0, 0, 0)), lump=None):
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    mesh.materials.append(mat)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    finish(obj, parent, pivot, lump)
    return obj


def finish(obj, parent, pivot, lump):
    mesh = obj.data
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    if lump:
        lumps(mesh, *lump)
    # Geometry is authored in world space, then shifted so the object's origin
    # is its pivot. Parents are never rotated, so plain subtraction is enough.
    mesh.transform(Matrix.Translation(-pivot))
    obj.parent = parent
    obj.location = pivot - (parent.matrix_world.translation if parent else Vector())
    bpy.context.view_layer.update()


def melt(obj, voxel, smooth_iterations, triangles):
    """Fuses overlapping blobs into one piece of clay: remesh into a single
    skin, smooth the creases where parts were pressed together, then thin the
    result down to a triangle budget."""
    remesh = obj.modifiers.new("remesh", "REMESH")
    remesh.mode = "VOXEL"
    remesh.voxel_size = voxel
    smooth = obj.modifiers.new("smooth", "SMOOTH")
    smooth.factor = 0.5
    smooth.iterations = smooth_iterations

    def evaluated():
        graph = bpy.context.evaluated_depsgraph_get()
        graph.update()
        return bpy.data.meshes.new_from_object(obj.evaluated_get(graph))

    dense = evaluated()
    dense_triangles = sum(len(p.vertices) - 2 for p in dense.polygons)
    bpy.data.meshes.remove(dense)

    decimate = obj.modifiers.new("decimate", "DECIMATE")
    decimate.ratio = min(1.0, triangles / dense_triangles)
    mesh = evaluated()
    rough, mat = obj.data, obj.data.materials[0]
    obj.modifiers.clear()
    obj.data = mesh
    bpy.data.meshes.remove(rough)
    mesh.name = obj.name
    if not mesh.materials:
        mesh.materials.append(mat)


def build():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    clay = material("Clay", CREAM, 0.85)
    red = material("Scarf", SCARF, 0.9)
    dark = material("Glasses", GLASSES, 0.45)

    root = bpy.data.objects.new("Pooh", None)
    bpy.context.scene.collection.objects.link(root)

    # ---- body, feet, tail ----
    bm = bmesh.new()
    blob(bm, BODY_CENTER, BODY_RADII, BODY_LOW, BODY_POWER)
    for v in bm.verts:
        v.co.z = max(v.co.z, 0.0)  # flat base so the bear sits
    for side in (-1, 1):
        blob(bm, Vector((side * 0.27, -0.40, 0.09)), Vector((0.16, 0.18, 0.10)), subdivisions=3)
    blob(bm, Vector((0, 0.47, 0.22)), Vector((0.10, 0.10, 0.10)), subdivisions=3)
    body = make_object("Body", bm, clay, root)
    melt(body, voxel=0.028, smooth_iterations=10, triangles=2600)
    finish(body, root, Vector(), (0.008, 2.6, 1))

    # ---- arms ----
    for name, side in (("ArmL", 1), ("ArmR", -1)):
        shoulder = Vector((side * 0.50, -0.16, 0.56))
        lean = Matrix.Rotation(math.radians(-12 * side), 3, "Y") @ Matrix.Rotation(math.radians(-35), 3, "X")
        bm = bmesh.new()
        blob(bm, shoulder + lean @ Vector((0, 0, -0.15)), Vector((0.11, 0.12, 0.19)),
             matrix=lean)
        make_object(name, bm, clay, root, shoulder, (0.004, 4.0, 2 + side))

    # ---- head and ears ----
    bm = bmesh.new()
    blob(bm, HEAD_CENTER, HEAD_RADII, HEAD_LOW, HEAD_POWER)
    for side in (-1, 1):
        blob(bm, Vector((side * 0.34, 0.0, 1.40)), Vector((0.17, 0.125, 0.17)), subdivisions=3)
    head = make_object("Head", bm, clay, root)
    melt(head, voxel=0.028, smooth_iterations=4, triangles=3600)
    finish(head, root, NECK, (0.008, 2.6, 5))

    # ---- glasses ----
    def head_point(direction):
        return surface(HEAD_CENTER, HEAD_RADII, HEAD_LOW, HEAD_POWER, direction)

    def head_normal(direction):
        d = Vector(direction).normalized()
        across = d.cross(Vector((0, 0, 1))).normalized()
        along = across.cross(d)
        e = 0.01
        normal = (head_point(d + across * e) - head_point(d - across * e)).cross(
            head_point(d + along * e) - head_point(d - along * e))
        return normal.normalized() if normal.dot(d) > 0 else -normal.normalized()

    bm = bmesh.new()
    lens_radius = 0.13
    inner = {}
    for side in (-1, 1):
        direction = Vector((side * 0.37, -0.93, -0.05))
        normal = head_normal(direction)
        center = head_point(direction)
        up = (Vector((0, 0, 1)) - normal * normal.z).normalized()
        right = up.cross(normal).normalized()  # points toward +X for both lenses
        tube(bm, [center + (right * math.cos(a) + up * math.sin(a)) * lens_radius
                  for a in (math.tau * i / 36 for i in range(36))],
             (0.022, 0.022), normal, closed=True)
        toward_nose = -side * right
        inner[side] = center + (toward_nose * math.cos(0.35) + up * math.sin(0.35)) * lens_radius
        # Short temple hugging the side of the head, ending inside it.
        start = center - toward_nose * lens_radius
        temple = [start]
        for azimuth in (52, 59, 66):
            a = math.radians(azimuth)
            lift = 0.012 if azimuth < 66 else -0.03
            d = Vector((side * math.sin(a), -math.cos(a), -0.03))
            temple.append(head_point(d) + head_normal(d) * lift)
        tube(bm, temple, (0.016, 0.016), Vector((0, 0, 1)), minor=6)
    middle = (inner[-1] + inner[1]) / 2 + Vector((0, -0.018, 0.022))
    tube(bm, bezier(inner[-1], middle, inner[1], 6), (0.017, 0.017), Vector((0, -1, 0)), minor=6)
    make_object("Glasses", bm, dark, head, Vector((0, -0.42, 0.97)))

    # ---- scarf ----
    def scarf_point(angle, radial=0.0, drop=0.0):
        return Vector((
            (SCARF_RX + radial) * math.cos(angle),
            (SCARF_RY + radial) * math.sin(angle),
            SCARF_Z + 0.02 * math.sin(angle) - drop,  # sits a little higher at the back
        ))

    bm = bmesh.new()
    tube(bm, [scarf_point(math.tau * i / 56) for i in range(56)],
         (0.068, 0.098), Vector((0, 0, 1)), minor=14, closed=True)
    knot = scarf_point(KNOT_ANGLE, radial=0.035, drop=0.03)
    outward = Vector((math.cos(KNOT_ANGLE), math.sin(KNOT_ANGLE), 0))
    around = Vector((0, 0, 1)).cross(outward)
    frame = Matrix((around, outward, Vector((0, 0, 1)))).transposed()
    blob(bm, knot, Vector((0.085, 0.07, 0.085)), subdivisions=3, matrix=frame)
    scarf = make_object("Scarf", bm, red, root, lump=(0.006, 6.0, 7))

    # Two tails hang from the knot. Each is a rounded slab bent to follow the
    # belly, built hanging from its pivot so swinging it reads as cloth.
    for name, length, spread, proud, seed in (
        ("ScarfTailA", 0.36, 0.07, 0.035, 8),
        ("ScarfTailB", 0.28, -0.08, 0.06, 9),
    ):
        bm = bmesh.new()
        blob(bm, Vector((0, 0, -length / 2)), Vector((0.068, 0.024, length / 2)),
             power=0.45, subdivisions=3)
        for v in bm.verts:
            s = -v.co.z / length  # 0 at the knot, 1 at the tip
            v.co.x += spread * s
            v.co.y += proud + 0.05 * math.sin(math.pi * min(s, 1.0) * 0.8)
            v.co = knot + frame @ v.co
        make_object(name, bm, red, scarf, knot, (0.004, 7.0, seed))

    return root


def export():
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=OUT,
        export_format="GLB",
        export_yup=True,
        export_texcoords=False,
        export_normals=True,
        export_materials="EXPORT",
        export_animations=False,
    )


def from_three(v):
    """three.js coordinates (Y up, facing +Z) to Blender's (Z up, facing -Y)."""
    return Vector((v[0], -v[2], v[1]))


def poster():
    """Renders the bear alone on a transparent ground, as three.js will first
    draw it. Lights and shadow are flat and shadowless on purpose: the live
    scene uses no shadow maps, and a softer render here would visibly pop when
    the canvas takes over."""
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 96
    scene.cycles.use_denoising = True
    scene.render.film_transparent = True
    scene.render.resolution_x = scene.render.resolution_y = 800
    scene.render.image_settings.file_format = "WEBP"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.quality = 88
    scene.view_settings.view_transform = "Standard"

    world = bpy.data.worlds.new("StageWorld")
    if bpy.app.version < (5, 0):
        world.use_nodes = True
    background = world.node_tree.nodes["Background"]
    background.inputs["Color"].default_value = srgb("#F6E9D2")
    background.inputs["Strength"].default_value = 0.68
    scene.world = world

    sun_data = bpy.data.lights.new("StageSun", "SUN")
    sun_data.energy = 1.6
    sun_data.use_shadow = False
    sun = bpy.data.objects.new("StageSun", sun_data)
    sun.rotation_euler = from_three(STAGE_SUN).to_track_quat("Z", "Y").to_euler()
    scene.collection.objects.link(sun)

    # Flat contact shadow: cocoa at low opacity, unlit, like the live scene.
    across, deep, opacity = STAGE_SHADOW
    shadow_mesh = bpy.data.meshes.new("StageShadow")
    bm = bmesh.new()
    bmesh.ops.create_circle(bm, cap_ends=True, segments=64, radius=1.0)
    bm.to_mesh(shadow_mesh)
    bm.free()
    shadow_mat = bpy.data.materials.new("StageShadow")
    if bpy.app.version < (5, 0):
        shadow_mat.use_nodes = True
    nodes, links = shadow_mat.node_tree.nodes, shadow_mat.node_tree.links
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    mix = nodes.new("ShaderNodeMixShader")
    clear = nodes.new("ShaderNodeBsdfTransparent")
    flat = nodes.new("ShaderNodeEmission")
    flat.inputs["Color"].default_value = srgb("#33241A")
    mix.inputs["Fac"].default_value = opacity
    links.new(clear.outputs[0], mix.inputs[1])
    links.new(flat.outputs[0], mix.inputs[2])
    links.new(mix.outputs[0], output.inputs["Surface"])
    shadow_mesh.materials.append(shadow_mat)
    shadow = bpy.data.objects.new("StageShadow", shadow_mesh)
    shadow.scale = (across, deep, 1)
    shadow.location = (0, 0, 0.002)
    scene.collection.objects.link(shadow)

    camera = bpy.data.objects.new("StageCamera", bpy.data.cameras.new("StageCamera"))
    camera.data.sensor_fit = "VERTICAL"
    camera.data.angle_y = math.radians(STAGE_FOV)
    camera.location = from_three(STAGE_CAMERA)
    camera.rotation_euler = (from_three(STAGE_TARGET) - camera.location).to_track_quat("-Z", "Y").to_euler()
    scene.collection.objects.link(camera)
    scene.camera = camera

    scene.render.filepath = POSTER
    bpy.ops.render.render(write_still=True)
    print(f"Wrote {POSTER} ({os.path.getsize(POSTER) / 1024:.0f} KB)")

    # Leave the scene as it was for the check renders.
    for obj in (sun, shadow, camera):
        bpy.data.objects.remove(obj)
    scene.render.film_transparent = False
    scene.render.image_settings.file_format = "PNG"


def preview(directory):
    """Renders check images. Not part of the shipped model."""
    os.makedirs(directory, exist_ok=True)
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 64
    scene.cycles.use_denoising = True
    scene.render.resolution_x = scene.render.resolution_y = 720
    scene.view_settings.view_transform = "Standard"

    world = bpy.data.worlds.new("World")
    if bpy.app.version < (5, 0):
        world.use_nodes = True
    background = world.node_tree.nodes["Background"]
    background.inputs["Color"].default_value = srgb("#FFF9ED")
    background.inputs["Strength"].default_value = 0.6
    scene.world = world

    floor_mesh = bpy.data.meshes.new("Floor")
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=20)
    bm.to_mesh(floor_mesh)
    bm.free()
    floor_mesh.materials.append(material("Floor", "#FFF9ED", 1.0))
    scene.collection.objects.link(bpy.data.objects.new("Floor", floor_mesh))

    sun_data = bpy.data.lights.new("Sun", "SUN")
    sun_data.energy = 1.6
    sun_data.angle = math.radians(25)
    sun = bpy.data.objects.new("Sun", sun_data)
    sun.rotation_euler = (math.radians(50), 0, math.radians(-35))
    scene.collection.objects.link(sun)

    camera = bpy.data.objects.new("Camera", bpy.data.cameras.new("Camera"))
    camera.data.lens = 70
    scene.collection.objects.link(camera)
    scene.camera = camera
    target = Vector((0, 0, 0.78))
    for name, azimuth, height in (
        ("front", 0, 1.0), ("three-quarter", 35, 1.2), ("side", 90, 1.0),
        ("back", 180, 1.1), ("top", 20, 3.4),
    ):
        a = math.radians(azimuth)
        camera.location = Vector((5.2 * math.sin(a), -5.2 * math.cos(a), height))
        camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
        scene.render.filepath = os.path.join(directory, f"pooh-{name}.png")
        bpy.ops.render.render(write_still=True)


if __name__ == "__main__":
    args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    build()
    export()
    print(f"Wrote {OUT} ({os.path.getsize(OUT) / 1024:.0f} KB)")
    poster()
    if "--preview" in args:
        preview(args[args.index("--preview") + 1])
