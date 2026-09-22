@echo off
REM =====================================================================
REM Script de build automatise pour sigrh_testperso (Frontend + Backend)
REM =====================================================================

if exist "C:\Program Files\Java\jdk-21.0.11" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.11"
) else if exist "C:\Program Files\Java\latest" (
    set "JAVA_HOME=C:\Program Files\Java\latest"
)

echo JAVA_HOME : %JAVA_HOME%

echo =================================================
echo 1. Build du Frontend Angular (sigrh_frontend)
echo =================================================
cd /d "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_frontend"
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Erreur lors du build Angular.
    exit /b %ERRORLEVEL%
)

echo =================================================
echo 2. Copie des fichiers statiques dans le Backend (sanou)
echo =================================================
if not exist "c:\Users\ZOROM\Desktop\NEW BANK\sanou\src\main\resources\static" (
    mkdir "c:\Users\ZOROM\Desktop\NEW BANK\sanou\src\main\resources\static"
)
xcopy /E /Y /I "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_frontend\dist\hr-management\browser\*" "c:\Users\ZOROM\Desktop\NEW BANK\sanou\src\main\resources\static\"

echo =================================================
echo 3. Packaging du Backend Spring Boot (sanou)
echo =================================================
cd /d "c:\Users\ZOROM\Desktop\NEW BANK\sanou"
call mvnw.cmd clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo Erreur lors du packaging Maven.
    exit /b %ERRORLEVEL%
)

echo =================================================
echo 4. Mise a jour du dossier sigrh_testperso
echo =================================================
if not exist "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_testperso\backend" (
    mkdir "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_testperso\backend"
)
if not exist "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_testperso\frontend\dist\browser" (
    mkdir "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_testperso\frontend\dist\browser"
)

if exist "c:\Users\ZOROM\Desktop\NEW BANK\sanou\target\sigrh_app.jar" (
    copy /Y "c:\Users\ZOROM\Desktop\NEW BANK\sanou\target\sigrh_app.jar" "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_testperso\backend\sigrh_app.jar"
    copy /Y "c:\Users\ZOROM\Desktop\NEW BANK\sanou\target\sigrh_app.jar" "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_app.jar"
) else if exist "c:\Users\ZOROM\Desktop\NEW BANK\sanou\target\sirh_backend-0.0.1-SNAPSHOT.jar" (
    copy /Y "c:\Users\ZOROM\Desktop\NEW BANK\sanou\target\sirh_backend-0.0.1-SNAPSHOT.jar" "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_testperso\backend\sigrh_app.jar"
    copy /Y "c:\Users\ZOROM\Desktop\NEW BANK\sanou\target\sirh_backend-0.0.1-SNAPSHOT.jar" "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_app.jar"
)

copy /Y "c:\Users\ZOROM\Desktop\NEW BANK\sanou\Dockerfile" "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_testperso\backend\Dockerfile"
if exist "c:\Users\ZOROM\Desktop\NEW BANK\sanou\Dockerfile.vps" (
    copy /Y "c:\Users\ZOROM\Desktop\NEW BANK\sanou\Dockerfile.vps" "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_testperso\backend\Dockerfile.vps"
)

xcopy /E /Y /I "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_frontend\dist\hr-management\browser\*" "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_testperso\frontend\dist\browser\"
if exist "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_frontend\dist\hr-management\3rdpartylicenses.txt" (
    copy /Y "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_frontend\dist\hr-management\3rdpartylicenses.txt" "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_testperso\frontend\dist\"
)
if exist "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_frontend\dist\hr-management\prerendered-routes.json" (
    copy /Y "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_frontend\dist\hr-management\prerendered-routes.json" "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_testperso\frontend\dist\"
)

copy /Y "c:\Users\ZOROM\Desktop\NEW BANK\mes_donnees_locales.sql" "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_testperso\mes_donnees_locales.sql"
copy /Y "c:\Users\ZOROM\Desktop\NEW BANK\donnees_de_base_et_mariam.sql" "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_testperso\donnees_de_base_et_mariam.sql"
copy /Y "c:\Users\ZOROM\Desktop\NEW BANK\sanou\src\main\resources\seed_postes_fonctions.sql" "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_testperso\seed_postes_fonctions.sql"

echo =================================================
echo 5. Generation de sigrh_testperso.zip et tar.gz
echo =================================================
cd /d "c:\Users\ZOROM\Desktop\NEW BANK\sigrh_testperso"
if exist "..\sigrh_testperso.zip" del /f /q "..\sigrh_testperso.zip"
if exist "..\sigrh_testperso.tar.gz" del /f /q "..\sigrh_testperso.tar.gz"
if exist "..\sigrh_testperso_vps.zip" del /f /q "..\sigrh_testperso_vps.zip"

powershell -NoProfile -Command "Compress-Archive -Path 'c:\Users\ZOROM\Desktop\NEW BANK\sigrh_testperso\*' -DestinationPath 'c:\Users\ZOROM\Desktop\NEW BANK\sigrh_testperso.zip' -Force"
tar -czf "..\sigrh_testperso.tar.gz" *

echo =================================================
echo SUCCESS ! sigrh_testperso.zip, sigrh_testperso.tar.gz et sigrh_app.jar ont ete generes.
echo =================================================
