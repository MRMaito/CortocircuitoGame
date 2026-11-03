# Servidor local para jugar Cortocircuito en Windows sin instalar nada.
# Lo usa jugar.bat. Compatible con Windows PowerShell 5.1 (viene con Windows 10 y 11).
# Mensajes sin tildes a proposito: la consola de Windows a veces no las muestra bien.

param(
    [int]$Puerto = 8000,
    [switch]$SinNavegador
)

$ErrorActionPreference = 'Stop'
$raiz = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$separador = [System.IO.Path]::DirectorySeparatorChar
if (-not $raiz.EndsWith($separador)) { $raiz = $raiz + $separador }

$tipos = @{
    '.html'  = 'text/html; charset=utf-8'
    '.js'    = 'text/javascript; charset=utf-8'
    '.mjs'   = 'text/javascript; charset=utf-8'
    '.css'   = 'text/css; charset=utf-8'
    '.json'  = 'application/json; charset=utf-8'
    '.svg'   = 'image/svg+xml'
    '.png'   = 'image/png'
    '.jpg'   = 'image/jpeg'
    '.ico'   = 'image/x-icon'
    '.woff2' = 'font/woff2'
    '.mp3'   = 'audio/mpeg'
    '.md'    = 'text/plain; charset=utf-8'
}

# Busca un puerto libre entre $Puerto y $Puerto + 10
$listener = $null
for ($p = $Puerto; $p -le $Puerto + 10; $p++) {
    $intento = New-Object System.Net.HttpListener
    $intento.Prefixes.Add("http://localhost:$p/")
    try {
        $intento.Start()
        $listener = $intento
        $Puerto = $p
        break
    } catch {
        $intento.Close()
    }
}
if ($null -eq $listener) {
    Write-Host "No encontre ningun puerto libre entre $Puerto y $($Puerto + 10)." -ForegroundColor Red
    exit 1
}

$url = "http://localhost:$Puerto/"
Write-Host ''
Write-Host '  CORTOCIRCUITO - servidor local' -ForegroundColor Green
Write-Host "  El juego esta en: $url" -ForegroundColor Green
Write-Host '  Para cerrarlo, cerra esta ventana o apreta Ctrl + C.'
Write-Host ''

if (-not $SinNavegador) { Start-Process $url }

try {
    while ($listener.IsListening) {
        $contexto = $listener.GetContext()
        $respuesta = $contexto.Response
        try {
            $ruta = [System.Uri]::UnescapeDataString($contexto.Request.Url.AbsolutePath).TrimStart('/')
            if ($ruta -eq '' -or $ruta.EndsWith('/')) { $ruta = $ruta + 'index.html' }
            $archivo = [System.IO.Path]::GetFullPath((Join-Path $raiz $ruta))

            # Solo se sirven archivos de adentro del proyecto
            if ($archivo.StartsWith($raiz) -and (Test-Path -LiteralPath $archivo -PathType Leaf)) {
                $bytes = [System.IO.File]::ReadAllBytes($archivo)
                $extension = [System.IO.Path]::GetExtension($archivo).ToLower()
                $tipo = $tipos[$extension]
                if ($null -eq $tipo) { $tipo = 'application/octet-stream' }
                $respuesta.ContentType = $tipo
                $respuesta.Headers.Add('Cache-Control', 'no-store')
                $respuesta.ContentLength64 = $bytes.Length
                $respuesta.OutputStream.Write($bytes, 0, $bytes.Length)
                $estado = 200
            } else {
                $respuesta.StatusCode = 404
                $bytes = [System.Text.Encoding]::UTF8.GetBytes('No encontrado')
                $respuesta.OutputStream.Write($bytes, 0, $bytes.Length)
                $estado = 404
            }
            Write-Host ("  {0}  /{1}" -f $estado, $ruta) -ForegroundColor DarkGray
        } catch {
            Write-Host "  Error sirviendo $($contexto.Request.Url): $($_.Exception.Message)" -ForegroundColor Yellow
        } finally {
            $respuesta.Close()
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
