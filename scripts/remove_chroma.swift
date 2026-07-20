import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

guard CommandLine.arguments.count == 3 else {
  fputs("Usage: remove_chroma.swift <input.png> <output.png>\n", stderr)
  exit(1)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1]) as CFURL
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2]) as CFURL

guard
  let source = CGImageSourceCreateWithURL(inputURL, nil),
  let image = CGImageSourceCreateImageAtIndex(source, 0, nil)
else {
  fputs("Could not read input image.\n", stderr)
  exit(1)
}

let width = image.width
let height = image.height
let bytesPerRow = width * 4
var pixels = [UInt8](repeating: 0, count: height * bytesPerRow)
let colorSpace = CGColorSpaceCreateDeviceRGB()
let bitmapInfo = CGBitmapInfo.byteOrder32Big.rawValue |
  CGImageAlphaInfo.premultipliedLast.rawValue

guard let context = CGContext(
  data: &pixels,
  width: width,
  height: height,
  bitsPerComponent: 8,
  bytesPerRow: bytesPerRow,
  space: colorSpace,
  bitmapInfo: bitmapInfo
) else {
  fputs("Could not create image context.\n", stderr)
  exit(1)
}

context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))

for offset in stride(from: 0, to: pixels.count, by: 4) {
  let red = Double(pixels[offset])
  let green = Double(pixels[offset + 1])
  let blue = Double(pixels[offset + 2])
  let distance = sqrt(pow(255 - red, 2) + pow(green, 2) + pow(255 - blue, 2))
  let alpha = max(0, min(1, (distance - 10) / 85))

  if alpha < 1 {
    let despilledRed = min(red, green + 55)
    let despilledBlue = min(blue, green + 55)
    pixels[offset] = UInt8(max(0, min(255, despilledRed * alpha)))
    pixels[offset + 1] = UInt8(max(0, min(255, green * alpha)))
    pixels[offset + 2] = UInt8(max(0, min(255, despilledBlue * alpha)))
    pixels[offset + 3] = UInt8(alpha * 255)
  }
}

guard
  let outputImage = context.makeImage(),
  let destination = CGImageDestinationCreateWithURL(
    outputURL,
    UTType.png.identifier as CFString,
    1,
    nil
  )
else {
  fputs("Could not prepare output image.\n", stderr)
  exit(1)
}

CGImageDestinationAddImage(destination, outputImage, nil)
guard CGImageDestinationFinalize(destination) else {
  fputs("Could not write output image.\n", stderr)
  exit(1)
}
