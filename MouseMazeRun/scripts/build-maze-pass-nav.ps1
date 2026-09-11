Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$assetDir = Join-Path $root "v9\assets\runtime"

$variants = @(
    @{
        Source = "world-nav-map-active.png"
        Output = "world-nav-map-active-maze-pass-v1.png"
        CenterY = 241.0
        FontSize = 40.0
        MaxWidth = 234.0
        EraseTop = 203
        Active = $false
    },
    @{
        Source = "world-nav-shop-active-divider-v2.png"
        Output = "world-nav-shop-active-maze-pass-v1.png"
        CenterY = 224.0
        FontSize = 42.0
        MaxWidth = 244.0
        EraseTop = 187
        Active = $false
    },
    @{
        Source = "world-nav-pass-active.png"
        Output = "world-nav-pass-active-maze-pass-v1.png"
        CenterY = 220.0
        FontSize = 52.0
        MaxWidth = 296.0
        EraseTop = 187
        Active = $true
    }
)

function Remove-OldLabel {
    param(
        [System.Drawing.Bitmap]$Bitmap,
        [int]$Left,
        [int]$Top,
        [int]$Right,
        [int]$Bottom
    )

    for ($y = $Top; $y -le $Bottom; $y++) {
        $leftColor = $Bitmap.GetPixel($Left - 1, $y)
        $rightColor = $Bitmap.GetPixel($Right + 1, $y)
        $span = [double]($Right - $Left + 2)

        for ($x = $Left; $x -le $Right; $x++) {
            $amount = ($x - $Left + 1) / $span
            $a = [int][Math]::Round($leftColor.A + (($rightColor.A - $leftColor.A) * $amount))
            $r = [int][Math]::Round($leftColor.R + (($rightColor.R - $leftColor.R) * $amount))
            $g = [int][Math]::Round($leftColor.G + (($rightColor.G - $leftColor.G) * $amount))
            $b = [int][Math]::Round($leftColor.B + (($rightColor.B - $leftColor.B) * $amount))
            $Bitmap.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, $r, $g, $b))
        }
    }
}

function Add-MazePassLabel {
    param(
        [System.Drawing.Bitmap]$Bitmap,
        [double]$CenterY,
        [double]$FontSize,
        [double]$MaxWidth,
        [bool]$Active
    )

    $graphics = [System.Drawing.Graphics]::FromImage($Bitmap)
    try {
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

        $family = New-Object System.Drawing.FontFamily("Arial Rounded MT Bold")
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $format = New-Object System.Drawing.StringFormat
        $format.Alignment = [System.Drawing.StringAlignment]::Near
        $format.LineAlignment = [System.Drawing.StringAlignment]::Near

        do {
            $path.Reset()
            $path.AddString(
                "MAZE PASS",
                $family,
                [int][System.Drawing.FontStyle]::Regular,
                $fontSize,
                [System.Drawing.PointF]::new(0, 0),
                $format
            )
            $bounds = $path.GetBounds()
            if ($bounds.Width -gt $MaxWidth) {
                $fontSize -= 1.0
            }
        } while ($bounds.Width -gt $MaxWidth -and $fontSize -gt 28)

        $centerX = 995.0
        $translateX = $centerX - ($bounds.Left + ($bounds.Width / 2.0))
        $translateY = $CenterY - ($bounds.Top + ($bounds.Height / 2.0))
        $matrix = New-Object System.Drawing.Drawing2D.Matrix
        $matrix.Translate([single]$translateX, [single]$translateY)
        $path.Transform($matrix)

        $shadowPath = $path.Clone()
        $shadowMatrix = New-Object System.Drawing.Drawing2D.Matrix
        $shadowMatrix.Translate(0, 3)
        $shadowPath.Transform($shadowMatrix)

        if ($Active) {
            $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(165, 19, 75, 15))
            $outlinePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 255, 253, 239), 4.0)
            $fillBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 253, 239))
        } else {
            $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(100, 58, 20, 5))
            $outlinePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(225, 58, 21, 5), 2.2)
            $fillBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 94, 40, 10))
        }
        $outlinePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

        try {
            $graphics.FillPath($shadowBrush, $shadowPath)
            $graphics.DrawPath($outlinePen, $path)
            $graphics.FillPath($fillBrush, $path)
        } finally {
            $shadowBrush.Dispose()
            $outlinePen.Dispose()
            $fillBrush.Dispose()
            $shadowPath.Dispose()
            $shadowMatrix.Dispose()
            $matrix.Dispose()
            $format.Dispose()
            $path.Dispose()
            $family.Dispose()
        }
    } finally {
        $graphics.Dispose()
    }
}

foreach ($variant in $variants) {
    $sourcePath = Join-Path $assetDir $variant.Source
    $outputPath = Join-Path $assetDir $variant.Output
    $source = [System.Drawing.Image]::FromFile($sourcePath)
    try {
        $bitmap = New-Object System.Drawing.Bitmap($source.Width, $source.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        try {
            $graphics.DrawImageUnscaled($source, 0, 0)
        } finally {
            $graphics.Dispose()
        }

        Remove-OldLabel -Bitmap $bitmap -Left 874 -Top $variant.EraseTop -Right 1116 -Bottom 254
        Add-MazePassLabel -Bitmap $bitmap -CenterY $variant.CenterY -FontSize $variant.FontSize -MaxWidth $variant.MaxWidth -Active $variant.Active
        $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $bitmap.Dispose()
        Write-Output "Wrote $outputPath"
    } finally {
        $source.Dispose()
    }
}
