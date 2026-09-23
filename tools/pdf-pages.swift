// =========================================================================
// tools/pdf-pages.swift — every page of a PDF, as an image.
// -------------------------------------------------------------------------
//   swift tools/pdf-pages.swift <in.pdf> <out-dir> [scale]
//
// The carousel shows pictures. A PDF in it would be a viewer inside a
// viewer — its own scroll, its own zoom, its own keyboard shortcuts, none
// of them the ones the rest of the page uses, and on iOS frequently just a
// grey box. So the pages become images like everything else, and the
// original PDF is still offered for download beside them.
//
// This is PDFKit rather than a dependency: the machine already has it, and
// a portfolio that runs with no build step should not acquire a toolchain
// to prepare four folders of pictures.
// =========================================================================

import Foundation
import PDFKit
import AppKit

let args = CommandLine.arguments
guard args.count >= 3 else {
    FileHandle.standardError.write("usage: pdf-pages.swift <in.pdf> <out-dir> [scale]\n".data(using: .utf8)!)
    exit(2)
}
guard let doc = PDFDocument(url: URL(fileURLWithPath: args[1])) else {
    FileHandle.standardError.write("cannot open \(args[1])\n".data(using: .utf8)!)
    exit(1)
}

let outDir = args[2]
let scale = CGFloat(args.count > 3 ? (Double(args[3]) ?? 2.0) : 2.0)
try? FileManager.default.createDirectory(atPath: outDir, withIntermediateDirectories: true)

for i in 0..<doc.pageCount {
    guard let page = doc.page(at: i) else { continue }
    let box = page.bounds(for: .mediaBox)
    let size = NSSize(width: box.width * scale, height: box.height * scale)

    let image = NSImage(size: size)
    image.lockFocus()
    // White behind the page: a PDF page is transparent where nothing is
    // drawn, and transparent becomes black in a JPEG.
    NSColor.white.setFill()
    NSRect(origin: .zero, size: size).fill()
    if let ctx = NSGraphicsContext.current?.cgContext {
        ctx.scaleBy(x: scale, y: scale)
        ctx.translateBy(x: -box.origin.x, y: -box.origin.y)
        page.draw(with: .mediaBox, to: ctx)
    }
    image.unlockFocus()

    guard let tiff = image.tiffRepresentation,
          let rep = NSBitmapImageRep(data: tiff),
          let png = rep.representation(using: .png, properties: [:]) else { continue }

    let name = String(format: "page-%02d.png", i + 1)
    try? png.write(to: URL(fileURLWithPath: "\(outDir)/\(name)"))
    print("\(name)  \(Int(size.width))×\(Int(size.height))")
}
