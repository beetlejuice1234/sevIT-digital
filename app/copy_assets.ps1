$src = 'C:\Users\Chamo\Downloads\models\New folder\'
$dst = 'd:\sevIT\sevIT landing page - Code version\app\public\images\renders\'
Copy-Item ($src + 'perf1.png') ($dst + 'perf1.png') -Force
Copy-Item ($src + 'perf3.png') ($dst + 'perf3.png') -Force
Copy-Item ($src + 'saraperf.png') ($dst + 'saraperf.png') -Force
Write-Host 'Done!'
