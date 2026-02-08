@echo off
echo Fixing Prisma Client...
echo.

echo Step 1: Removing .next cache...
rmdir /s /q .next 2>nul
echo Done!
echo.

echo Step 2: Generating Prisma Client...
call npx prisma generate
echo Done!
echo.

echo Step 3: Starting dev server...
call npm run dev
