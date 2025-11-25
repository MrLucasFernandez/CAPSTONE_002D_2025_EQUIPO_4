echo Limpiando node_modules y cachés...
rd /s /q node_modules
rd /s /q .vite
del /f /q package-lock.json
echo Instalando dependencias...
npm install
echo Listo. Puedes ejecutar 'npm run dev'
pause
